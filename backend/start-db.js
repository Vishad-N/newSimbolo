const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting DB migration script...');
const possiblePaths = [
  './prisma/schema.prisma',
  '../prisma/schema.prisma',
  '/app/backend/prisma/schema.prisma',
  '/app/prisma/schema.prisma',
  'backend/prisma/schema.prisma'
];

let schemaPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    schemaPath = p;
    break;
  }
}

if (schemaPath) {
  console.log('✅ Found Prisma schema at:', schemaPath);
  execSync(`npx prisma migrate deploy --schema=${schemaPath}`, { stdio: 'inherit' });
} else {
  console.log('❌ Could not find schema.prisma in standard locations. Running recursive search...');
  try {
    const findOutput = execSync('find /app -name schema.prisma -type f').toString().trim();
    if (findOutput) {
      const foundPaths = findOutput.split('\n');
      console.log('✅ Found schema recursively at:', foundPaths[0]);
      execSync(`npx prisma migrate deploy --schema=${foundPaths[0]}`, { stdio: 'inherit' });
    } else {
      console.error('❌ FATAL ERROR: schema.prisma is completely missing from the filesystem!');
    }
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
}
