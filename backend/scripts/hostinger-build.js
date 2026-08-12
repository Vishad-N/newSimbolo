const { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } = require('node:fs');
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

const nestCliPath = require.resolve('@nestjs/cli/bin/nest.js', { paths: [backendRoot] });
console.log(`[hostinger-build] Nest CLI resolved at ${nestCliPath}`);

runStep('Prisma client generation', 'node', [
  './scripts/with-direct-url.js',
  'prisma',
  'generate',
  '--schema',
  './prisma/schema.prisma',
]);

pinGeneratedPrismaClient(path.join(backendRoot, '..', 'node_modules'));
pinGeneratedPrismaClient(path.join(backendRoot, 'node_modules'));
mergeNodeModules(path.join(backendRoot, '..', 'node_modules'), path.join(backendRoot, 'node_modules'));

runStep('Nest compilation', 'node', [nestCliPath, 'build']);

if (!existsSync(path.join(distDirectory, 'main.js'))) {
  console.error('[hostinger-build] Missing dist/main.js.');
  process.exit(1);
}

console.log('[hostinger-build] Found freshly compiled dist/main.js.');
stripSwaggerRuntimeImports(distDirectory);

const nestMainPath = path.join(distDirectory, 'nest-main.js');
cpSync(path.join(distDirectory, 'main.js'), nestMainPath);
writeFileSync(
  path.join(distDirectory, 'main.js'),
  "try { require('./nest-main.js'); } catch (error) { require('./emergency-server.js')(error); }\n",
);
writeFileSync(path.join(distDirectory, 'app.js'), "try { require('./nest-main.js'); } catch (error) { require('./emergency-server.js')(error); }\n");
writeFileSync(path.join(distDirectory, 'index.js'), "require('./app.js');\n");
writeFileSync(path.join(distDirectory, 'server.js'), "require('./app.js');\n");
cpSync(path.resolve('emergency-server.js'), path.join(distDirectory, 'emergency-server.js'));
writeFileSync(
  path.join(distDirectory, 'package.json'),
  JSON.stringify(
    {
      name: `${packageJson.name}-hostinger-runtime`,
      version: packageJson.version,
      private: true,
      main: 'app.js',
      engines: packageJson.engines,
    },
    null,
    2,
  ),
);

assertModuleExists(path.join(backendRoot, 'node_modules'), '@nestjs/core');
assertModuleExists(path.join(backendRoot, 'node_modules'), '@prisma/client');

console.log('[hostinger-build] Build completed successfully.');
console.log('[hostinger-build] Hostinger custom settings must be:');
console.log('[hostinger-build]   Output directory: .');
console.log('[hostinger-build]   Entry file: app.js');
console.log('[hostinger-build]   PORT=3000');
console.log('[hostinger-build] Do not set output directory to dist or hostinger-output.');
process.exit(0);

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
  }
  cpSync(source, destination, {
    recursive: true,
    dereference: true,
    filter: (filePath) => !filePath.includes(`${path.sep}.cache${path.sep}`),
  });
}

function pinGeneratedPrismaClient(targetNodeModules) {
  if (!existsSync(targetNodeModules)) {
    return;
  }

  const destinationClient = path.join(targetNodeModules, '@prisma', 'client');
  const destinationGenerated = path.join(targetNodeModules, '.prisma');
  const parentClient = path.join(backendRoot, '..', 'node_modules', '@prisma', 'client');
  const parentGenerated = path.join(backendRoot, '..', 'node_modules', '.prisma');

  if (existsSync(parentClient) && path.resolve(parentClient) !== path.resolve(destinationClient)) {
    mkdirSync(path.dirname(destinationClient), { recursive: true });
    if (!existsSync(path.join(destinationClient, 'package.json'))) {
      console.log(`[hostinger-build] Pinning Prisma client into ${destinationClient}`);
      cpSync(parentClient, destinationClient, { recursive: true, dereference: true });
    }
  }

  if (existsSync(parentGenerated) && path.resolve(parentGenerated) !== path.resolve(destinationGenerated)) {
    if (!existsSync(path.join(destinationGenerated, 'client'))) {
      console.log(`[hostinger-build] Pinning Prisma engine into ${destinationGenerated}`);
      mkdirSync(path.dirname(destinationGenerated), { recursive: true });
      cpSync(parentGenerated, destinationGenerated, { recursive: true, dereference: true });
    }
  }
}

function assertModuleExists(nodeModulesDirectory, packageName) {
  const packageJsonPath = path.join(nodeModulesDirectory, ...packageName.split('/'), 'package.json');
  const parentPackageJsonPath = path.join(backendRoot, '..', 'node_modules', ...packageName.split('/'), 'package.json');
  if (existsSync(packageJsonPath) || existsSync(parentPackageJsonPath)) {
    console.log(`[hostinger-build] ${packageName} is available for runtime resolution.`);
    return;
  }

  console.error(`[hostinger-build] ${packageName} is not installed.`);
  process.exit(1);
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
    if (path.basename(filePath) === 'main.js' || path.basename(filePath) === 'app.js') {
      continue;
    }

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
