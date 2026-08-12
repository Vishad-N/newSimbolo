const http = require('http');

function startEmergencyServer(error) {
  const port = Number(process.env.PORT || 3000);
  const message = error instanceof Error ? error.stack || error.message : String(error);
  const payload = JSON.stringify({
    status: 'boot_error',
    service: 'simbolo-api',
    port,
    error: message,
  });

  console.error('[emergency-server] Application failed to start. Serving diagnostic HTTP on port', port);
  console.error(message);

  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(payload);
  });

  server.listen(port, '0.0.0.0', () => {
    console.error(`[emergency-server] Listening on 0.0.0.0:${port}`);
  });
}

module.exports = startEmergencyServer;
