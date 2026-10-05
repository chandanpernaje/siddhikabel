import fs from 'fs';
let content = fs.readFileSync('src/components/ui/AuthModal.tsx', 'utf8');
content = content.replace(/amber/g, 'blue').replace(/orange/g, 'sky');
fs.writeFileSync('src/components/ui/AuthModal.tsx', content);
