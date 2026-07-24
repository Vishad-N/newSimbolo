const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);
let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Global replacements for backgrounds
  content = content.replace(/bg-\[\#050816\]/gi, 'bg-[var(--background)]');
  content = content.replace(/bg-\[\#0b1120\]/gi, 'bg-[var(--sidebar)]');
  content = content.replace(/bg-\[\#0f172a\]/gi, 'bg-[var(--card)]');
  content = content.replace(/bg-\[\#111827\]/gi, 'bg-[var(--surface)]');
  
  // Replace hardcoded text colors
  content = content.replace(/text-\[\#F8FAFC\]/gi, 'text-[var(--text-primary)]');
  content = content.replace(/text-\[\#94A3B8\]/gi, 'text-[var(--muted)]');
  
  // Enforce true white text on primary/colorful elements
  content = content.replace(/className=(["'\{`])(.*?)(["'\}`])/g, (match, p1, classes, p3) => {
    if (
        classes.includes('bg-[var(--primary)]') || 
        classes.includes('bg-blue-') ||
        classes.includes('bg-red-') ||
        classes.includes('bg-green-') ||
        classes.includes('bg-[var(--accent)]') ||
        classes.includes('bg-purple-')
       ) {
       let newClasses = classes.replace(/\btext-white\b/g, 'text-[#ffffff]');
       return `className=${p1}${newClasses}${p3}`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated:', file);
  }
}

console.log(`Refactored ${changedFiles} files successfully.`);
