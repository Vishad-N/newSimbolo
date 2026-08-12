const { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const packageJson = require('../package.json');

const backendRoot = process.cwd();
const distDirectory = path.resolve('dist');

function runStep(label, command, args, extraEnv = {}) {
  const startedAt = new Date();
  console.log(`[hostinger-build] ${label} started at ${startedAt.toISOString()}`);
  console.log(`[hostinger-build] running: ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    cwd: backendRoot,
    env: {
      ...process.env,
      ...extraEnv,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=512`.trim(),
    },
  });

  const elapsedSeconds = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
  if (result.status !== 0) {
    console.error(`[hostinger-build] ${label} failed after ${elapsedSeconds}s with exit code ${result.status}`);
    process.exit(result.status || 1);
  }

  console.log(`[hostinger-build] ${label} finished after ${elapsedSeconds}s`);
}

const nestCliPath = require.resolve('@nestjs/cli/bin/nest.js', { paths: [backendRoot] });
console.log(`[hostinger-build] Nest CLI resolved at ${nestCliPath}`);

runStep(
  'Standalone backend dependency install',
  'npm',
  ['install', '--omit=dev', '--no-workspaces', '--install-strategy=hoisted', '--no-fund', '--no-audit'],
  { NPM_CONFIG_WORKSPACES: 'false' },
);

runStep('Prisma client generation', 'node', [
  './scripts/with-direct-url.js',
  'prisma',
  'generate',
  '--schema',
  './prisma/schema.prisma',
]);

pinGeneratedPrismaClient(path.join(backendRoot, 'node_modules'));

runStep('Nest compilation', 'node', [nestCliPath, 'build']);

if (!existsSync(path.join(distDirectory, 'main.js'))) {
  console.error('[hostinger-build] Missing dist/main.js.');
  process.exit(1);
}

console.log('[hostinger-build] Found freshly compiled dist/main.js.');
stripSwaggerRuntimeImports(distDirectory);
cpSync(path.join(distDirectory, 'main.js'), path.join(distDirectory, 'nest-main.js'));
writeFileSync(
  path.join(distDirectory, 'package.json'),
  JSON.stringify(
    {
      name: `${packageJson.name}-hostinger-runtime`,
      version: packageJson.version,
      private: true,
      main: 'nest-main.js',
      engines: packageJson.engines,
    },
    null,
    2,
  ),
);

assertLocalModule('@nestjs/core');
assertLocalModule('@prisma/client');

console.log('[hostinger-build] Build completed successfully.');
console.log('[hostinger-build] Hostinger Business: Output directory=. Entry file=app.js PORT=3000');
console.log('[hostinger-build] app.js binds port 3000 before Nest loads so the Business proxy does not 503.');
process.exit(0);

function pinGeneratedPrismaClient(targetNodeModules) {
  const destinationClient = path.join(targetNodeModules, '@prisma', 'client');
  const destinationGenerated = path.join(targetNodeModules, '.prisma');
  const parentClient = path.join(backendRoot, '..', 'node_modules', '@prisma', 'client');
  const parentGenerated = path.join(backendRoot, '..', 'node_modules', '.prisma');

  if (existsSync(parentClient) && !existsSync(path.join(destinationClient, 'index.js'))) {
    console.log(`[hostinger-build] Pinning Prisma client into ${destinationClient}`);
    mkdirSync(path.dirname(destinationClient), { recursive: true });
    cpSync(parentClient, destinationClient, { recursive: true, dereference: true });
  }

  if (existsSync(parentGenerated) && !existsSync(path.join(destinationGenerated, 'client'))) {
    console.log(`[hostinger-build] Pinning Prisma engine into ${destinationGenerated}`);
    mkdirSync(path.dirname(destinationGenerated), { recursive: true });
    cpSync(parentGenerated, destinationGenerated, { recursive: true, dereference: true });
  }
}

function assertLocalModule(packageName) {
  const packageJsonPath = path.join(backendRoot, 'node_modules', ...packageName.split('/'), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error(`[hostinger-build] ${packageName} is missing from backend/node_modules.`);
    console.error('[hostinger-build] Hostinger only publishes the backend folder, so parent workspace node_modules is not available at runtime.');
    process.exit(1);
  }

  console.log(`[hostinger-build] Verified ${packageName} in backend/node_modules.`);
}

function stripSwaggerRuntimeImports(targetDirectory) {
  const shimPath = path.join(targetDirectory, 'swagger-shim.js');
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
  for (const filePath of walkJavaScriptFiles(targetDirectory)) {
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
