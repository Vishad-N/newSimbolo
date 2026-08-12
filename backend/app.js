const fs = require('fs');
const http = require('http');
const Module = require('module');
const path = require('path');

if (!process.env.PORT) {
  process.env.PORT = '3000';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const extraNodePaths = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'dist', 'node_modules'),
  path.join(__dirname, '..', 'node_modules'),
].filter((directory) => fs.existsSync(directory));

if (extraNodePaths.length > 0) {
  process.env.NODE_PATH = [process.env.NODE_PATH, ...extraNodePaths].filter(Boolean).join(path.delimiter);
  Module._initPaths();
}

function startEmergencyServer(error) {
  const port = Number(process.env.PORT || 3000);
  const payload = JSON.stringify({
    status: 'boot_error',
    service: 'simbolo-api',
    port,
    error: error instanceof Error ? error.stack || error.message : String(error),
  });

  console.error('[app.js] Nest failed to start. Serving diagnostic HTTP so Hostinger does not return 503.');
  console.error(payload);

  http
    .createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(payload);
    })
    .listen(port, '0.0.0.0', () => {
      console.error(`[app.js] Diagnostic server listening on 0.0.0.0:${port}`);
    });
}

const compiledEntry = [
  path.join(__dirname, 'dist', 'nest-main.js'),
  path.join(__dirname, 'nest-main.js'),
  path.join(__dirname, 'dist', 'main.js'),
  path.join(__dirname, 'main.js'),
].find((candidate) => fs.existsSync(candidate));

if (!compiledEntry) {
  startEmergencyServer(new Error('Compiled Nest entry was not found. Expected dist/nest-main.js after npm run build.'));
} else {
  try {
    require(compiledEntry);
  } catch (error) {
    startEmergencyServer(error);
  }
}
