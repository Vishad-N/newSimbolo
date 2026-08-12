const fs = require('fs');
const http = require('http');
const Module = require('module');
const path = require('path');

// Hostinger Business proxies only to 3000 and kills processes that exceed plan RAM.
if (!process.env.PORT) {
  process.env.PORT = '3000';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const extraNodePaths = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'dist', 'node_modules'),
].filter((directory) => fs.existsSync(directory));

if (extraNodePaths.length > 0) {
  process.env.NODE_PATH = [process.env.NODE_PATH, ...extraNodePaths].filter(Boolean).join(path.delimiter);
  Module._initPaths();
}

const port = Number(process.env.PORT || 3000);
let bootError = null;
let nestHandler = null;

function diagnosticHandler(_req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: bootError ? 'boot_error' : 'starting',
      service: 'simbolo-api',
      hosting: 'hostinger-business',
      port,
      error: bootError,
    }),
  );
}

const server = http.createServer((req, res) => {
  if (typeof nestHandler === 'function') {
    nestHandler(req, res);
    return;
  }

  diagnosticHandler(req, res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[app.js] Listening on 0.0.0.0:${port} before Nest bootstrap (Hostinger Business).`);
  setImmediate(bootNest);
});

async function bootNest() {
  const compiledEntry = [
    path.join(__dirname, 'dist', 'nest-main.js'),
    path.join(__dirname, 'nest-main.js'),
    path.join(__dirname, 'dist', 'main.js'),
  ].find((candidate) => fs.existsSync(candidate));

  if (!compiledEntry) {
    bootError = 'Compiled Nest entry was not found. Expected dist/nest-main.js after npm run build.';
    console.error('[app.js]', bootError);
    return;
  }

  try {
    const exported = require(compiledEntry);
    if (typeof exported.createExpressApplication !== 'function') {
      throw new Error('dist/nest-main.js does not export createExpressApplication. Redeploy the latest backend build.');
    }

    nestHandler = await exported.createExpressApplication();
    console.log('[app.js] Nest is attached to the existing Hostinger HTTP server.');
  } catch (error) {
    bootError = error instanceof Error ? error.stack || error.message : String(error);
    console.error('[app.js] Nest bootstrap failed; diagnostic server remains on port', port);
    console.error(bootError);
  }
}
