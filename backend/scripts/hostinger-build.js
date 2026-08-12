const {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const packageJson = require('../package.json');

const backendRoot = process.cwd();
const outputDirectory = path.resolve('hostinger-output');

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

  const finishedAt = new Date();
  const elapsedSeconds = ((finishedAt.getTime() - startedAt.getTime()) / 1000).toFixed(1);

  if (result.status !== 0) {
    console.error(`[hostinger-build] ${label} failed after ${elapsedSeconds}s with exit code ${result.status}`);
    process.exit(result.status || 1);
  }

  console.log(`[hostinger-build] ${label} finished after ${elapsedSeconds}s`);
}

runStep('Prisma client generation', 'node', [
  './scripts/with-direct-url.js',
  'prisma',
  'generate',
  '--schema',
  './prisma/schema.prisma',
]);

pinGeneratedPrismaClient();

runStep('Nest compilation', 'node', [require.resolve('@nestjs/cli/bin/nest.js'), 'build']);

if (!existsSync('./dist/main.js')) {
  console.error('[hostinger-build] Missing dist/main.js.');
  console.error('[hostinger-build] Nest compilation did not produce dist/main.js.');
  process.exit(1);
}

console.log('[hostinger-build] Found freshly compiled dist/main.js.');
stripSwaggerRuntimeImports(path.resolve('dist'));

console.log('[hostinger-build] Preparing Hostinger runtime artifact.');
removeDirectory(outputDirectory);
mkdirSync(outputDirectory, { recursive: true });

writeHostingerEntryFiles(path.resolve('dist'), './main.js');
writeHostingerPackageJson(path.resolve('dist'), 'main.js');

writeFileSync(
  path.join(outputDirectory, 'package.json'),
  JSON.stringify(
    {
      name: `${packageJson.name}-hostinger-runtime`,
      version: packageJson.version,
      private: true,
      main: 'app.js',
      engines: packageJson.engines,
      scripts: {
        start: 'node app.js',
        'start:prod': 'node app.js',
      },
      dependencies: packageJson.dependencies,
    },
    null,
    2,
  ),
);

writeHostingerEntryFiles(outputDirectory, './main.js');

cpSync(path.resolve('dist'), path.join(outputDirectory, 'dist'), {
  recursive: true,
  filter: (source) => path.basename(source) !== 'node_modules',
});
cpSync(path.resolve('dist'), outputDirectory, {
  recursive: true,
  filter: (source) => path.basename(source) !== 'node_modules',
});
stripSwaggerRuntimeImports(path.join(outputDirectory, 'dist'));
linkNodeModules(path.resolve('dist', 'node_modules'), path.resolve('node_modules'));

const localNodeModules = path.join(backendRoot, 'node_modules');
const installedNodeModules = existsSync(path.join(localNodeModules, '@nestjs', 'core'))
  ? localNodeModules
  : resolveInstalledNodeModules('@nestjs/core');
if (!existsSync(path.join(installedNodeModules, '@nestjs', 'core'))) {
  console.error(`[hostinger-build] Missing installed dependency @nestjs/core in ${installedNodeModules}.`);
  console.error('[hostinger-build] Hostinger must run npm install before npm run build.');
  process.exit(1);
}

const artifactNodeModules = path.join(outputDirectory, 'node_modules');
console.log(`[hostinger-build] Linking runtime dependencies from ${installedNodeModules}.`);
if (!linkNodeModules(artifactNodeModules, installedNodeModules)) {
  console.log('[hostinger-build] Copying runtime dependencies into hostinger-output.');
  cpSync(installedNodeModules, artifactNodeModules, {
    recursive: true,
    filter: (source) =>
      !source.includes(`${path.sep}.cache${path.sep}`) &&
      !source.includes(`${path.sep}@simbolo${path.sep}`),
  });
}

pinGeneratedPrismaClient(path.join(outputDirectory, 'node_modules'));

console.log('[hostinger-build] Runtime artifact ready at hostinger-output.');
console.log('[hostinger-build] Hostinger does not use a start command. Use:');
console.log('[hostinger-build]   Output directory: dist');
console.log('[hostinger-build]   Entry file: main.js');
console.log('[hostinger-build]   PORT=3000');
console.log('[hostinger-build] Build completed successfully.');
process.exit(0);

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

function pinGeneratedPrismaClient(targetNodeModules = path.join(backendRoot, 'node_modules')) {
  const destinationClient = path.join(targetNodeModules, '@prisma', 'client');
  const destinationGenerated = path.join(targetNodeModules, '.prisma');
  const parentClient = path.join(backendRoot, '..', 'node_modules', '@prisma', 'client');
  const parentGenerated = path.join(backendRoot, '..', 'node_modules', '.prisma');

  let resolvedClient = null;
  try {
    resolvedClient = path.dirname(resolvePackageJson('@prisma/client'));
  } catch {
    resolvedClient = existsSync(parentClient) ? parentClient : null;
  }

  const resolvedGenerated = resolvedClient
    ? path.join(path.dirname(path.dirname(resolvedClient)), '.prisma')
    : parentGenerated;
  const clientSource = firstExistingDirectory(resolvedClient, parentClient, destinationClient);
  const generatedSource = firstExistingDirectory(resolvedGenerated, parentGenerated, destinationGenerated);

  if (clientSource && path.resolve(clientSource) !== path.resolve(destinationClient)) {
    console.log(`[hostinger-build] Pinning Prisma client from ${clientSource} -> ${destinationClient}`);
    mkdirSync(path.dirname(destinationClient), { recursive: true });
    cpSync(clientSource, destinationClient, { recursive: true });
  }

  if (generatedSource && path.resolve(generatedSource) !== path.resolve(destinationGenerated)) {
    console.log(`[hostinger-build] Pinning generated Prisma engine from ${generatedSource} -> ${destinationGenerated}`);
    mkdirSync(path.dirname(destinationGenerated), { recursive: true });
    cpSync(generatedSource, destinationGenerated, { recursive: true });
  }

  if (!existsSync(path.join(destinationClient, 'package.json')) && !existsSync(path.join(destinationGenerated, 'client'))) {
    console.error('[hostinger-build] Prisma Client is missing from backend/node_modules after generate.');
    console.error('[hostinger-build] Hostinger only packages the backend folder, so ../node_modules is not enough.');
    process.exit(1);
  }

  console.log(`[hostinger-build] Prisma Client is available in ${targetNodeModules}.`);
}

function firstExistingDirectory(...directories) {
  return directories.find((directory) => directory && existsSync(directory));
}

function linkNodeModules(linkPath, targetPath) {
  try {
    if (existsSync(linkPath)) {
      return true;
    }

    mkdirSync(path.dirname(linkPath), { recursive: true });
    symlinkSync(targetPath, linkPath, 'dir');
    console.log(`[hostinger-build] Linked ${linkPath} -> ${targetPath}`);
    return true;
  } catch (error) {
    console.warn(`[hostinger-build] Could not symlink node_modules (${error.code || error.message}).`);
    return false;
  }
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

function removeDirectory(directory) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      rmSync(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
      return;
    } catch (error) {
      if (attempt === 5) {
        throw error;
      }

      console.warn(`[hostinger-build] Retrying cleanup of ${directory} after ${error.code || error.message}.`);
    }
  }
}

function resolveInstalledNodeModules(packageName) {
  const packageJsonPath = resolvePackageJson(packageName);
  let directory = path.dirname(packageJsonPath);

  while (directory !== path.dirname(directory)) {
    if (
      path.basename(directory) === packageName.split('/').pop() &&
      path.basename(path.dirname(directory)) === packageName.split('/')[0]
    ) {
      return path.dirname(path.dirname(directory));
    }

    if (path.basename(directory) === 'node_modules') {
      return directory;
    }

    directory = path.dirname(directory);
  }

  throw new Error(`[hostinger-build] Could not resolve node_modules directory for ${packageName}.`);
}

function resolvePackageJson(packageName) {
  try {
    return require.resolve(`${packageName}/package.json`, { paths: [backendRoot] });
  } catch (error) {
    console.error(`[hostinger-build] Unable to resolve ${packageName}. Run npm install before npm run build.`);
    throw error;
  }
}
