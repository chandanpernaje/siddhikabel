const fs = require('fs');
const html = fs.readFileSync('C:/Users/LENOVO/.gemini/antigravity-ide/brain/fcab0f90-4f3c-4006-8b30-d7b8315efd89/.system_generated/steps/267/content.md', 'utf-8');
const urls = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log(urls.join('\n'));
