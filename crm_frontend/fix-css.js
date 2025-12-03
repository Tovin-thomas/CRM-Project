const fs = require('fs');

// Read the CSS file
let css = fs.readFileSync('src/index.css', 'utf8');

// Fix orphaned properties by removing lines that are just properties without selectors
// This regex finds lines that start with whitespace, have a CSS property, but aren't inside a proper rule
const lines = css.split('\n');
const fixed = [];
let inMediaQuery = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track media queries
    if (trimmed.includes('@media')) {
        inMediaQuery = true;
        braceCount = 0;
    }

    // Count braces
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;

    // Skip orphaned properties (properties not in a selector block)
    if (trimmed.match(/^[a-z-]+:\s*.+;$/) && braceCount <= (inMediaQuery ? 1 : 0)) {
        console.log(`Skipping orphaned property at line ${i + 1}: ${trimmed}`);
        continue;
    }

    if (braceCount === 0) {
        inMediaQuery = false;
    }

    fixed.push(line);
}

// Write the fixed CSS
fs.writeFileSync('src/index.css', fixed.join('\n'), 'utf8');
console.log('CSS file fixed!');
