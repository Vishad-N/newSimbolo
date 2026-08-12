const { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const packageJson = require('../package.json');

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

runStep('Nest compilation', 'node', [require.resolve('@nestjs/cli/bin/nest.js'), 'build']);

if (!existsSync('./dist/main.js')) {
  console.error('[hostinger-build] Missing dist/main.js.');
  console.error('[hostinger-build] Nest compilation did not produce dist/main.js.');
  process.exit(1);
}

console.log('[hostinger-build] Found freshly compiled dist/main.js.');
console.log('[hostinger-build] Preparing Hostinger runtime artifact.');

removeDirectory(outputDirectory);
mkdirSync(outputDirectory, { recursive: true });

writeFileSync(
  path.join(outputDirectory, 'package.json'),
  JSON.stringify(
    {
      name: `${packageJson.name}-hostinger-runtime`,
      version: packageJson.version,
      private: true,
      engines: packageJson.engines,
      scripts: {
        start: 'node dist/main.js',
        'start:prod': 'node dist/main.js',
      },
      dependencies: packageJson.dependencies,
    },
    null,
    2,
  ),
);

cpSync(path.resolve('dist'), path.join(outputDirectory, 'dist'), { recursive: true });
stripSwaggerRuntimeImports(path.resolve('dist'));
stripSwaggerRuntimeImports(path.join(outputDirectory, 'dist'));

for (const entryFile of ['app.js', 'server.js']) {
  if (existsSync(path.resolve(entryFile))) {
    cpSync(path.resolve(entryFile), path.join(outputDirectory, entryFile));
  }
}

const shouldBundleDependencies = process.env.HOSTINGER_BUNDLE_DEPENDENCIES === '1';

if (shouldBundleDependencies) {
  const installedNodeModules = resolveInstalledNodeModules('@nestjs/core');

  if (!existsSync(path.join(installedNodeModules, '@nestjs', 'core'))) {
    console.error(`[hostinger-build] Missing installed dependency @nestjs/core in ${installedNodeModules}.`);
    console.error('[hostinger-build] Hostinger must run npm install before npm run build.');
    process.exit(1);
  }

  console.log(`[hostinger-build] Copying installed runtime dependencies from ${installedNodeModules} into artifact.`);
  cpSync(installedNodeModules, path.join(outputDirectory, 'node_modules'), {
    recursive: true,
    filter: (source) =>
      !source.includes(`${path.sep}.cache${path.sep}`) &&
      !source.includes(`${path.sep}@simbolo${path.sep}`),
  });

  const generatedPrismaPackage = path.dirname(resolvePackageJson('@prisma/client'));
  const generatedPrismaClient = path.join(path.dirname(path.dirname(generatedPrismaPackage)), '.prisma');

  if (existsSync(generatedPrismaClient)) {
    cpSync(generatedPrismaClient, path.join(outputDirectory, 'node_modules', '.prisma'), { recursive: true });
  }

  if (existsSync(generatedPrismaPackage)) {
    cpSync(generatedPrismaPackage, path.join(outputDirectory, 'node_modules', '@prisma', 'client'), { recursive: true });
  }
} else {
  console.log('[hostinger-build] Skipping node_modules copy. Hostinger installs dependencies during deploy.');
  console.log('[hostinger-build] Set HOSTINGER_BUNDLE_DEPENDENCIES=1 only if you are uploading a prebuilt ZIP.');
}

console.log('[hostinger-build] Runtime artifact ready at hostinger-output.');
console.log('[hostinger-build] Build completed successfully.');

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
    if (path.basename(directory) === packageName.split('/').pop() && path.basename(path.dirname(directory)) === packageName.split('/')[0]) {
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
    return require.resolve(`${packageName}/package.json`, { paths: [process.cwd()] });
  } catch (error) {
    console.error(`[hostinger-build] Unable to resolve ${packageName}. Run npm install before npm run build.`);
    throw error;
  }
}
