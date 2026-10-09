import fs from 'fs';

function updateHero(file, color, originalBgStr) {
  let content = fs.readFileSync(file, 'utf8');
  
  const newBgStr = `bg-gradient-to-br from-${color}-50 via-white to-${color}-50/30 border-${color}-200/60 shadow-${color}-500/10`;
  content = content.replace(originalBgStr, newBgStr);

  fs.writeFileSync(file, content);
}

updateHero('src/pages/AboutEaton.tsx', 'blue', 'bg-white border border-slate-200');
updateHero('src/pages/AboutPartex.tsx', 'emerald', 'bg-white border border-slate-200');
updateHero('src/pages/AboutMennekes.tsx', 'rose', 'bg-white border border-slate-200');
updateHero('src/pages/AboutLapp.tsx', 'blue', 'bg-white border border-slate-200/80');

console.log("Updated hero cards!");
