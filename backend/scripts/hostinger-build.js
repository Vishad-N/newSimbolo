const { spawnSync } = require('node:child_process');

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

runStep('Nest compilation', 'npx', ['nest', 'build']);

console.log('[hostinger-build] Build completed successfully.');
