import fs from 'fs';

// Process AboutPartex
let partex = fs.readFileSync('src/pages/AboutPartex.tsx', 'utf8');
partex = partex.replace(/blue/g, 'emerald');
fs.writeFileSync('src/pages/AboutPartex.tsx', partex);

// Process AboutMennekes
let mennekes = fs.readFileSync('src/pages/AboutMennekes.tsx', 'utf8');
mennekes = mennekes.replace(/amber/g, 'rose');
fs.writeFileSync('src/pages/AboutMennekes.tsx', mennekes);

// Process AboutLapp
let lapp = fs.readFileSync('src/pages/AboutLapp.tsx', 'utf8');
lapp = lapp.replace(/amber/g, 'blue');
fs.writeFileSync('src/pages/AboutLapp.tsx', lapp);
