const { spawnSync } = require('node:child_process');
require('dotenv/config');

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const [command, ...args] = process.argv.slice(2);
const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

process.exit(result.status ?? 1);
