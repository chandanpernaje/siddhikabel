const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

const startMarker = '{/* 1. AUTHORIZED BRAND PORTFOLIOS: 4 BRAND CARDS & INLINE CATALOG */}';
const endMarker = '{/* 7. ABOUT COMPANY SECTION                                 */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found");
    process.exit(1);
}

const replacement = `{/* 1. AUTHORIZED BRAND PORTFOLIOS: CONTINUOUS CATALOG */}
      {/* ======================================================== */}
      <section id="brand-portfolios" className="w-full scroll-mt-24 pt-12 lg:pt-16 pb-12 lg:pb-16 bg-slate-50 border-y border-slate-200 text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
          {BRANDS.map((brand: any) => {
            const brandProducts = PRODUCTS_DATA.filter((p) => p.brand.toLowerCase().includes(brand.id));
            const displayProducts = brandProducts.slice(0, 6);
            
            if (displayProducts.length === 0) return null;
            
            const brandStyles: any = {
              lapp: { bg: "bg-orange-500", text: "text-orange-600", hover: "hover:bg-orange-600" },
              eaton: { bg: "bg-blue-600", text: "text-blue-600", hover: "hover:bg-blue-700" },
              mennekes: { bg: "bg-red-600", text: "text-red-600", hover: "hover:bg-red-700" },
              partex: { bg: "bg-zinc-600", text: "text-zinc-700", hover: "hover:bg-zinc-700" },
            };
            const bStyle = brandStyles[brand.id] || brandStyles.partex;
            
            // Map the link to dedicated pages
            const brandLink = brand.id === "lapp" ? "/olflex-cables" : brand.id === "mennekes" ? "/about-mennekes" : "/#contact";

            return (
              <div key={brand.id} className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Brand Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-200 pb-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm h-14 sm:h-16 w-32 sm:w-40 flex items-center justify-center shrink-0">
                      <img src={brand.logo} alt={brand.name} className="max-h-8 sm:max-h-10 w-auto object-contain" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {brand.name.split(" ")[0]} <span className={bStyle.text}>Products</span>
                      </h3>
                      <p className="hidden sm:block text-sm text-slate-500 font-medium max-w-xl line-clamp-1">{brand.description}</p>
                    </div>
                  </div>
                  
                  {brandProducts.length > 6 && (
                    <Link
                      to={brandLink}
                      className={\`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white \${bStyle.bg} \${bStyle.hover} transition-all hover:scale-105 shadow-md shrink-0\`}
                    >
                      View More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* 6 Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onDirectQuote={(p) => { setRfqProductName(\`\${p.name} (\${p.partNo})\`); setRfqProductPrice(p.price); setRfqModalOpen(true); }}
                    />
                  ))}
                </div>

                {/* Mobile View More */}
                {brandProducts.length > 6 && (
                  <div className="sm:hidden flex justify-center pt-2">
                    <Link
                      to={brandLink}
                      className={\`flex w-full justify-center items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white \${bStyle.bg} shadow-md\`}
                    >
                      View All {brand.name.split(" ")[0]}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ======================================================== */}
      `;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(homePath, newContent);
console.log("Successfully updated Home.tsx");
