const path = require('path');
const fs = require('fs');

const compiledEntry = fs.existsSync(path.join(__dirname, 'dist', 'nest-main.js'))
  ? './dist/nest-main.js'
  : fs.existsSync(path.join(__dirname, 'nest-main.js'))
    ? './nest-main.js'
    : fs.existsSync(path.join(__dirname, 'dist', 'main.js'))
      ? './dist/main.js'
      : './main.js';

try {
  require(compiledEntry);
} catch (error) {
  require('./emergency-server.js')(error);
}
