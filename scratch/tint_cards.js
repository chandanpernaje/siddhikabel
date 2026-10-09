import fs from 'fs';

function updateCards(file, brandColor) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the image container background
  content = content.replace(/className="aspect-\[16\/10\] bg-slate-50 flex items-center/g, `className="aspect-[16/10] bg-${brandColor}-50/50 flex items-center`);
  
  // Replace the card border to be tinted
  content = content.replace(/border border-slate-200\/90/g, `border border-${brandColor}-200/60`);
  
  // Replace the border below the image
  content = content.replace(/border-b border-slate-100/g, `border-b border-${brandColor}-100`);

  // Replace the border above the quote button
  content = content.replace(/border-t border-slate-100/g, `border-t border-${brandColor}-100`);
  
  // Give the card a subtle colored shadow on hover instead of generic shadow
  content = content.replace(/hover:shadow-lg/g, `hover:shadow-lg hover:shadow-${brandColor}-500/10`);

  fs.writeFileSync(file, content);
}

updateCards('src/pages/AboutPartex.tsx', 'emerald');
updateCards('src/pages/AboutMennekes.tsx', 'rose');
updateCards('src/pages/AboutEaton.tsx', 'blue');
updateCards('src/pages/AboutLapp.tsx', 'blue');

console.log("Updated cards!");
