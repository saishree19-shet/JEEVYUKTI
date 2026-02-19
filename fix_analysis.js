const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/app/analysis/page.js');
const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

// 1-based to 0-based
const line315 = lines[314];
const line316 = lines[315];

console.log('Line 315:', JSON.stringify(line315));
console.log('Line 316:', JSON.stringify(line316));

if (line315.trim() === '</div>' && line316.trim() === '</div>') {
    console.log('Found redundant lines. Removing...');
    lines.splice(314, 2); // Remove 2 lines starting at index 314
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Fixed file.');
} else {
    console.log('Lines do not match expectation. Aborting.');
}
