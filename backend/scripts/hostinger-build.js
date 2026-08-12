const {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const packageJson = require('../package.json');

const backendRoot = process.cwd();
const distDirectory = path.resolve('dist');

function runStep(label, command, args) {
  const startedAt = new Date();
  console.log(`[hostinger-build] ${label} started at ${startedAt.toISOString()}`);
  console.log(`[hostinger-build] running: ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=768`.trim(),
    },
  });

  const elapsedSeconds = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
  if (result.status !== 0) {
    console.error(`[hostinger-build] ${label} failed after ${elapsedSeconds}s with exit code ${result.status}`);
    process.exit(result.status || 1);
  }

  console.log(`[hostinger-build] ${label} finished after ${elapsedSeconds}s`);
}

const nestCliPath = resolveNestCli();
const completeNodeModules = resolveCompleteNodeModules();
const localNodeModules = path.join(backendRoot, 'node_modules');

runStep('Prisma client generation', 'node', [
  './scripts/with-direct-url.js',
  'prisma',
  'generate',
  '--schema',
  './prisma/schema.prisma',
]);

pinGeneratedPrismaClient(completeNodeModules);
mergeNodeModules(completeNodeModules, localNodeModules);

runStep('Nest compilation', 'node', [nestCliPath, 'build']);

if (!existsSync(path.join(distDirectory, 'main.js'))) {
  console.error('[hostinger-build] Missing dist/main.js.');
  process.exit(1);
}

console.log('[hostinger-build] Found freshly compiled dist/main.js.');
stripSwaggerRuntimeImports(distDirectory);
writeHostingerEntryFiles(distDirectory, './main.js');
writeHostingerPackageJson(distDirectory, 'main.js');

const distNodeModules = path.join(distDirectory, 'node_modules');
console.log(`[hostinger-build] Assembling dist/node_modules from ${completeNodeModules} and ${localNodeModules}.`);
copyDirectory(completeNodeModules, distNodeModules);
mergeNodeModules(localNodeModules, distNodeModules);
pinGeneratedPrismaClient(distNodeModules);
assertRuntimeResolves(distDirectory);

console.log('[hostinger-build] dist is a self-contained Hostinger runtime.');
console.log('[hostinger-build] Hostinger settings:');
console.log('[hostinger-build]   Root directory: backend');
console.log('[hostinger-build]   Framework: Other');
console.log('[hostinger-build]   Output directory: dist');
console.log('[hostinger-build]   Entry file: main.js');
console.log('[hostinger-build]   PORT=3000');
console.log('[hostinger-build] Build completed successfully.');
process.exit(0);

function resolveCompleteNodeModules() {
  const candidates = [
    path.join(backendRoot, 'node_modules'),
    path.join(backendRoot, '..', 'node_modules'),
  ];

  try {
    let directory = path.dirname(resolvePackageJson('@nestjs/core'));
    while (directory !== path.dirname(directory) && path.basename(directory) !== 'node_modules') {
      directory = path.dirname(directory);
    }
    if (path.basename(directory) === 'node_modules') {
      candidates.unshift(directory);
    }
  } catch {
    // Fall through to explicit candidates.
  }

  const uniqueCandidates = [...new Set(candidates.map((directory) => path.resolve(directory)))];
  const complete = uniqueCandidates.find((directory) => existsSync(path.join(directory, '@nestjs', 'core')));
  if (!complete) {
    console.error('[hostinger-build] Could not find a node_modules tree that contains @nestjs/core.');
    process.exit(1);
  }

  console.log(`[hostinger-build] Using complete dependency tree at ${complete}`);
  return complete;
}

function resolveNestCli() {
  try {
    const nestCliPath = require.resolve('@nestjs/cli/bin/nest.js', { paths: [backendRoot] });
    console.log(`[hostinger-build] Nest CLI resolved at ${nestCliPath}`);
    return nestCliPath;
  } catch {
    console.error('[hostinger-build] Cannot find @nestjs/cli. Hostinger must run npm install before npm run build.');
    process.exit(1);
  }
}

function mergeNodeModules(source, destination) {
  if (!existsSync(source) || path.resolve(source) === path.resolve(destination)) {
    return;
  }

  console.log(`[hostinger-build] Merging ${source} -> ${destination} without deleting existing packages.`);
  mkdirSync(destination, { recursive: true });

  if (process.platform !== 'win32') {
    const result = spawnSync('cp', ['-a', `${source}/.`, destination], { stdio: 'inherit' });
    if (result.status === 0) {
      return;
    }
    console.warn('[hostinger-build] cp merge failed, falling back to Node copy.');
  }

  cpSync(source, destination, {
    recursive: true,
    dereference: true,
    filter: (filePath) => !filePath.includes(`${path.sep}.cache${path.sep}`),
  });
}

function copyDirectory(source, destination) {
  removePath(destination);
  mkdirSync(path.dirname(destination), { recursive: true });

  if (process.platform !== 'win32') {
    const result = spawnSync('cp', ['-a', source, destination], { stdio: 'inherit' });
    if (result.status === 0 && existsSync(path.join(destination, '@nestjs', 'core'))) {
      return;
    }
    console.warn('[hostinger-build] cp -a failed, falling back to Node copy.');
    removePath(destination);
  }

  cpSync(source, destination, {
    recursive: true,
    dereference: true,
    filter: (filePath) => !filePath.includes(`${path.sep}.cache${path.sep}`),
  });
}

function removePath(target) {
  try {
    lstatSync(target);
  } catch {
    return;
  }

  rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
}

function assertRuntimeResolves(runtimeRoot) {
  for (const packageName of ['@nestjs/core', '@prisma/client']) {
    try {
      const resolved = require.resolve(`${packageName}/package.json`, { paths: [runtimeRoot] });
      console.log(`[hostinger-build] Verified ${packageName} from ${runtimeRoot} -> ${resolved}`);
    } catch {
      console.error(`[hostinger-build] ${packageName} cannot be required from ${runtimeRoot}.`);
      console.error('[hostinger-build] Hostinger will 503 if this check fails.');
      process.exit(1);
    }
  }
}

function pinGeneratedPrismaClient(targetNodeModules) {
  const destinationClient = path.join(targetNodeModules, '@prisma', 'client');
  const destinationGenerated = path.join(targetNodeModules, '.prisma');
  const parentClient = path.join(backendRoot, '..', 'node_modules', '@prisma', 'client');
  const parentGenerated = path.join(backendRoot, '..', 'node_modules', '.prisma');

  let resolvedClient = existsSync(parentClient) ? parentClient : null;
  try {
    resolvedClient = path.dirname(resolvePackageJson('@prisma/client'));
  } catch {
    // Keep parent fallback.
  }

  const resolvedGenerated = resolvedClient
    ? path.join(path.dirname(path.dirname(resolvedClient)), '.prisma')
    : parentGenerated;
  const clientSource = [resolvedClient, parentClient, destinationClient].find((directory) => directory && existsSync(directory));
  const generatedSource = [resolvedGenerated, parentGenerated, destinationGenerated].find(
    (directory) => directory && existsSync(directory),
  );

  if (clientSource && path.resolve(clientSource) !== path.resolve(destinationClient)) {
    console.log(`[hostinger-build] Pinning Prisma client from ${clientSource} -> ${destinationClient}`);
    mkdirSync(path.dirname(destinationClient), { recursive: true });
    copyDirectory(clientSource, destinationClient);
  }

  if (generatedSource && path.resolve(generatedSource) !== path.resolve(destinationGenerated)) {
    console.log(`[hostinger-build] Pinning Prisma engine from ${generatedSource} -> ${destinationGenerated}`);
    mkdirSync(path.dirname(destinationGenerated), { recursive: true });
    copyDirectory(generatedSource, destinationGenerated);
  }

  if (!existsSync(path.join(destinationClient, 'package.json')) && !existsSync(path.join(destinationGenerated, 'client'))) {
    console.error(`[hostinger-build] Prisma Client is missing from ${targetNodeModules}.`);
    process.exit(1);
  }
}

function writeHostingerEntryFiles(directory, compiledEntry) {
  const bootstrap = `require('${compiledEntry}');\n`;
  writeFileSync(path.join(directory, 'app.js'), bootstrap);
  writeFileSync(path.join(directory, 'index.js'), bootstrap);
  writeFileSync(path.join(directory, 'server.js'), bootstrap);
}

function writeHostingerPackageJson(directory, mainFile) {
  writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify(
      {
        name: `${packageJson.name}-hostinger-runtime`,
        version: packageJson.version,
        private: true,
        main: mainFile,
        engines: packageJson.engines,
        scripts: {
          start: `node ${mainFile}`,
        },
      },
      null,
      2,
    ),
  );
}

function stripSwaggerRuntimeImports(distDirectory) {
  const shimPath = path.join(distDirectory, 'swagger-shim.js');
  writeFileSync(
    shimPath,
    `class DocumentBuilder {
  setTitle() { return this; }
  setDescription() { return this; }
  setVersion() { return this; }
  addBearerAuth() { return this; }
  addTag() { return this; }
  build() { return {}; }
}

const SwaggerModule = {
  createDocument() { return {}; },
  setup() {},
};

function createDecorator() {
  return () => undefined;
}

function PartialType(classRef) {
  return class extends classRef {};
}

module.exports = new Proxy(
  {
    DocumentBuilder,
    SwaggerModule,
    PartialType,
  },
  {
    get(target, property) {
      if (property in target) {
        return target[property];
      }

      return createDecorator;
    },
  },
);
`,
  );

  let patchedFiles = 0;
  for (const filePath of walkJavaScriptFiles(distDirectory)) {
    const source = readFileSync(filePath, 'utf8');
    if (!source.includes('@nestjs/swagger')) {
      continue;
    }

    const relativeShimPath = toRequirePath(path.relative(path.dirname(filePath), shimPath));
    const patchedSource = source
      .replaceAll('require("@nestjs/swagger")', `require("${relativeShimPath}")`)
      .replaceAll("require('@nestjs/swagger')", `require('${relativeShimPath}')`);

    if (patchedSource !== source) {
      writeFileSync(filePath, patchedSource);
      patchedFiles += 1;
    }
  }

  console.log(`[hostinger-build] Replaced Swagger runtime imports in ${patchedFiles} compiled files.`);
}

function* walkJavaScriptFiles(directory) {
  if (!existsSync(directory)) {
    return;
  }

  for (const entry of readdirSync(directory)) {
    const filePath = path.join(directory, entry);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      if (entry === 'node_modules') {
        continue;
      }
      yield* walkJavaScriptFiles(filePath);
      continue;
    }

    if (filePath.endsWith('.js')) {
      yield filePath;
    }
  }
}

function toRequirePath(relativePath) {
  const normalizedPath = relativePath.split(path.sep).join('/');
  return normalizedPath.startsWith('.') ? normalizedPath : `./${normalizedPath}`;
}

function resolvePackageJson(packageName) {
  return require.resolve(`${packageName}/package.json`, { paths: [backendRoot] });
}
