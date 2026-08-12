const { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
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

if (!existsSync('./dist/main.js')) {
  console.error('[hostinger-build] Missing dist/main.js.');
  console.error('[hostinger-build] Run npm run build locally from the backend folder, commit backend/dist, then redeploy.');
  process.exit(1);
}

console.log('[hostinger-build] Found dist/main.js. Skipping Nest compilation on Hostinger.');
console.log('[hostinger-build] Preparing Hostinger runtime artifact.');

rmSync(outputDirectory, { recursive: true, force: true });
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
      },
      dependencies: packageJson.dependencies,
    },
    null,
    2,
  ),
);

cpSync(path.resolve('dist'), path.join(outputDirectory, 'dist'), { recursive: true });

const installedNodeModules = path.resolve('..', 'node_modules');

if (!existsSync(path.join(installedNodeModules, '@nestjs', 'core'))) {
  console.error('[hostinger-build] Missing installed dependency @nestjs/core in ../node_modules.');
  console.error('[hostinger-build] Hostinger must run npm install before npm run build.');
  process.exit(1);
}

console.log('[hostinger-build] Copying installed runtime dependencies into artifact.');
cpSync(installedNodeModules, path.join(outputDirectory, 'node_modules'), {
  recursive: true,
  filter: (source) =>
    !source.includes(`${path.sep}.cache${path.sep}`) &&
    !source.includes(`${path.sep}@simbolo${path.sep}`),
});

const generatedPrismaClient = path.resolve('..', 'node_modules', '.prisma');
const generatedPrismaPackage = path.resolve('..', 'node_modules', '@prisma', 'client');

if (existsSync(generatedPrismaClient)) {
  cpSync(generatedPrismaClient, path.join(outputDirectory, 'node_modules', '.prisma'), { recursive: true });
}

if (existsSync(generatedPrismaPackage)) {
  cpSync(generatedPrismaPackage, path.join(outputDirectory, 'node_modules', '@prisma', 'client'), { recursive: true });
}

console.log('[hostinger-build] Runtime artifact ready at hostinger-output.');
console.log('[hostinger-build] Build completed successfully.');
