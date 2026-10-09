const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

const targetStr = `<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 lg:space-y-12">
          {BRANDS.map((brand: any) => {`;

const insertStr = `<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 lg:space-y-12">
          {/* Top Brand Cards Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pb-2">
            {BRANDS.map((b: any) => (
              <div 
                key={b.id}
                onClick={() => {
                  const el = document.getElementById(\`brand-section-\${b.id}\`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="group flex flex-col rounded-3xl h-full bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b border-slate-200/70">
                  <img src={b.logo} alt={b.name} className="max-h-10 sm:max-h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out" />
                </div>
                <div className="flex flex-col flex-1 p-2 sm:p-3 items-center text-center justify-center space-y-1">
                  <span className="px-2 py-0.5 rounded border text-[9px] sm:text-[10px] tracking-wider uppercase font-bold bg-slate-100 text-slate-700 border-slate-200">
                    {b.origin}
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                    {b.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {BRANDS.map((brand: any) => {`;

content = content.replace(targetStr, insertStr);

const idTargetStr = `return (
              <div key={brand.id} className="space-y-4 lg:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">`;

const idReplaceStr = `return (
              <div id={\`brand-section-\${brand.id}\`} key={brand.id} className="space-y-4 lg:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">`;

content = content.replace(idTargetStr, idReplaceStr);

fs.writeFileSync(homePath, content);
console.log("Successfully updated Home.tsx");
