import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { RFQModal } from "../components/ui/RFQModal";
import type { OlflexProduct } from "../types";
import {
  OLFLEX_110_PRODUCTS,
  OLFLEX_110SY_PRODUCTS,
  OLFLEX_110CY_PRODUCTS,
  OLFLEX_100I_PRODUCTS,
} from "../data/olflexData";

const SECTIONS = [
  { id: '110', title: 'ÖLFLEX® CLASSIC 110', data: OLFLEX_110_PRODUCTS, image: '/images/cable-olflex-cores.png' },
  { id: '110sy', title: 'ÖLFLEX® CLASSIC 110 SY', data: OLFLEX_110SY_PRODUCTS, image: '/images/products/lapp-02.jpg' },
  { id: '110cy', title: 'ÖLFLEX® CLASSIC 110 CY', data: OLFLEX_110CY_PRODUCTS, image: '/images/products/lapp-03.jpg' },
  { id: '100', title: 'ÖLFLEX® CLASSIC 100', data: OLFLEX_100I_PRODUCTS, image: '/images/products/lapp-01.jpg' }
];

const CompactCableCard = ({ product, image, onQuote }: { product: OlflexProduct, image: string, onQuote: (p: OlflexProduct) => void }) => {
  return (
    <div 
      className="group relative flex flex-col rounded-3xl h-full bg-gradient-to-b from-orange-500/10 via-orange-50/70 to-white border border-orange-200/90 border-t-4 border-t-orange-500 hover:border-orange-400 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-orange-500/20 overflow-hidden" 
    >
      <Link to={`/product/${product.partNo}`} className="relative aspect-[4/3] bg-gradient-to-b from-orange-100/50 via-orange-50/40 to-white flex items-center justify-center p-2 sm:p-4 overflow-hidden border-b border-orange-200/50 block">
        <img src={image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-1 sm:p-2 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-sm" />
      </Link>
      <div className="flex flex-col flex-1 p-3 sm:p-4 items-center text-center justify-center space-y-2">
        <div>
          <span className="px-2.5 py-1 rounded-lg border text-[10px] sm:text-[11px] tracking-wider uppercase font-bold bg-orange-100/90 text-orange-900 border-orange-300">
            LAPP
          </span>
        </div>
        <Link to={`/product/${product.partNo}`} className="block w-full">
          <h4 className="text-[12px] sm:text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h4>
        </Link>
      </div>
    </div>
  )
}

export const OlflexCables: React.FC = () => {
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqProductName, setRfqProductName] = useState<string | null>(null);
  const [rfqProductPrice, setRfqProductPrice] = useState<number | null>(null);
  
  // Track which sections are expanded to show all products
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuote = (p: OlflexProduct) => {
    setRfqProductName(`${p.name} (${p.partNo})`);
    setRfqProductPrice(p.price);
    setRfqModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-600 transition-colors font-medium">
            Home
          </Link>
          <span>/</span>
          <Link to="/about-lapp" className="hover:text-amber-600 transition-colors font-medium">
            LAPP Kabel
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">ÖLFLEX® Cable Center</span>
        </div>

        {/* Hero Header */}
        <div className="relative rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 overflow-hidden shadow-lg">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 font-mono font-bold">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Official German Cable Configurator · Direct Stockist</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              ÖLFLEX® Industrial Flexible Control Cables
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engineered by LAPP Stuttgart. High flexibility, chemical and oil resistance according to DIN EN 50290-2-22, and VDE registration. Browse standard configurations available with same-day dispatch from our Bangalore central warehouse.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 pt-2 font-medium">
              <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                VDE Reg. No. 7030
              </span>
              <span>·</span>
              <span>Test Voltage: 4000 V</span>
              <span>·</span>
              <span>Temp: -40°C to +80°C</span>
              <span>·</span>
              <span>Class 5 Bare Copper</span>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-12">
          {SECTIONS.map(section => {
            const isExpanded = expandedSections[section.id];
            const displayData = isExpanded ? section.data : section.data.slice(0, 6);
            
            if (!section.data || section.data.length === 0) return null;

            return (
              <div key={section.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                    {section.title}
                  </h2>
                  <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    {section.data.length} Variants Available
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {displayData.map((p, idx) => (
                    <CompactCableCard 
                      key={`${p.partNo}-${idx}`} 
                      product={p} 
                      image={section.image} 
                      onQuote={handleQuote} 
                    />
                  ))}
                </div>

                {section.data.length > 6 && (
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors shadow-xs"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>View More Products <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for RFQ */}
        <RFQModal
          productName={rfqProductName}
          productPrice={rfqProductPrice}
          isOpen={rfqModalOpen}
          onClose={() => {
            setRfqModalOpen(false);
            setRfqProductName(null);
            setRfqProductPrice(null);
          }}
        />
      </div>
    </div>
  );
};
