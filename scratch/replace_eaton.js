import fs from 'fs';
let content = fs.readFileSync('src/pages/AboutEaton.tsx', 'utf8');
content = content.replace(/amber/g, 'blue');
fs.writeFileSync('src/pages/AboutEaton.tsx', content);
