const path = require('path');
const fs = require('fs');

const compiledEntry = fs.existsSync(path.join(__dirname, 'dist', 'main.js'))
  ? './dist/main.js'
  : './main.js';

require(compiledEntry);
