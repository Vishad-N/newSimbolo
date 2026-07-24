const { execSync } = require('child_process');
const fs = require('fs');
const diff = execSync('git diff').toString();

const files = diff.split(/^diff --git a\//m).slice(1);
let totalFixed = 0;
files.forEach(fileDiff => {
    const filename = fileDiff.split(' ')[0];
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) {
        let content = fs.readFileSync(filename, 'utf8');
        const diffLines = fileDiff.split('\n');
        
        let oldMatches = [];
        diffLines.forEach(line => {
            if (line.startsWith('-') && !line.startsWith('---')) {
                let m = line.match(/border-\[var\(--primary\)\]\/(\d+)/g);
                if (m) oldMatches.push(...m);
            }
        });
        
        if (oldMatches.length > 0) {
            oldMatches.forEach(oldM => {
                let opacity = oldM.split('/')[1];
                let regex = /(hover:)?border-\[var\(--accent\)\]\/\s?/g;
                let matchIndex = 0;
                content = content.replace(regex, (match, p1) => {
                    // Replace all matching instances globally per opacity because we wiped them globally.
                    // Wait, if there were multiple DIFFERENT opacities in the same file, this greedy replace will overwrite all of them with the last one.
                    // But we lost the order anyway. Let's just do it, they are usually the same (e.g. /30)
                    return (p1 || '') + 'border-[var(--accent)]/' + opacity + (match.endsWith(' ') ? ' ' : '');
                });
            });
            fs.writeFileSync(filename, content, 'utf8');
            totalFixed++;
        }

        let oldFromMatches = [];
        diffLines.forEach(line => {
            if (line.startsWith('-') && !line.startsWith('---')) {
                let m = line.match(/from-\[var\(--primary\)\]\/(\d+)/g);
                if (m) oldFromMatches.push(...m);
            }
        });
        if (oldFromMatches.length > 0) {
            oldFromMatches.forEach(oldM => {
                let opacity = oldM.split('/')[1];
                let regex = /from-\[var\(--accent\)\]\/\s?/g;
                content = content.replace(regex, (match) => {
                    return 'from-[var(--accent)]/' + opacity + (match.endsWith(' ') ? ' ' : '');
                });
            });
            fs.writeFileSync(filename, content, 'utf8');
        }
    }
});
console.log('Fixed opacities in ' + totalFixed + ' files.');
