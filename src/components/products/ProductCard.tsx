import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Check, ShieldCheck, Zap } from "lucide-react";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onDirectQuote?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  
  const isLappCat1 = product.id === "lapp-cat-1";
  const isLappOtherCat = product.id.startsWith("lapp-cat-") && product.id !== "lapp-cat-1";
  const isLappCategory = isLappCat1 || isLappOtherCat;
  
  const isInCart = !isLappCategory && cart.some((item) => item.id === product.id);

  // Dynamic rich brand styling matching each industrial manufacturer
  const getBrandStyle = (brand: string) => {
    const b = brand.toLowerCase();
    if (b.includes("lapp")) {
      return {
        cardBg: "bg-gradient-to-b from-blue-500/10 via-blue-50/70 to-white",
        cardBorder: "border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/20",
        topStrip: "border-t-4 border-t-blue-500",
        imageBg: "bg-gradient-to-b from-blue-100/50 via-blue-50/40 to-white",
        badge: "bg-blue-100/90 text-blue-900 border-blue-300 font-bold",
        titleHover: "hover:text-blue-700",
        bullet: "text-blue-500",
        priceText: "text-blue-950",
        btnGradient: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/25",
        accentGlow: "group-hover:shadow-blue-500/15",
      };
    }
    if (b.includes("eaton")) {
      return {
        cardBg: "bg-gradient-to-b from-blue-500/10 via-sky-50/70 to-white",
        cardBorder: "border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/20",
        topStrip: "border-t-4 border-t-blue-500",
        imageBg: "bg-gradient-to-b from-blue-100/50 via-sky-50/40 to-white",
        badge: "bg-blue-100/90 text-blue-900 border-blue-300 font-bold",
        titleHover: "hover:text-blue-700",
        bullet: "text-blue-500",
        priceText: "text-blue-950",
        btnGradient: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md shadow-blue-500/25",
        accentGlow: "group-hover:shadow-blue-500/15",
      };
    }
    if (b.includes("mennekes")) {
      return {
        cardBg: "bg-gradient-to-b from-rose-500/10 via-rose-50/70 to-white",
        cardBorder: "border-rose-200/90 hover:border-rose-400 hover:shadow-rose-500/20",
        topStrip: "border-t-4 border-t-rose-500",
        imageBg: "bg-gradient-to-b from-rose-100/50 via-rose-50/40 to-white",
        badge: "bg-rose-100/90 text-rose-900 border-rose-300 font-bold",
        titleHover: "hover:text-rose-700",
        bullet: "text-rose-500",
        priceText: "text-rose-950",
        btnGradient: "bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white shadow-md shadow-rose-500/25",
        accentGlow: "group-hover:shadow-rose-500/15",
      };
    }
    if (b.includes("partex")) {
      return {
        cardBg: "bg-gradient-to-b from-emerald-500/10 via-emerald-50/70 to-white",
        cardBorder: "border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/20",
        topStrip: "border-t-4 border-t-emerald-500",
        imageBg: "bg-gradient-to-b from-emerald-100/50 via-emerald-50/40 to-white",
        badge: "bg-emerald-100/90 text-emerald-900 border-emerald-300 font-bold",
        titleHover: "hover:text-emerald-700",
        bullet: "text-emerald-500",
        priceText: "text-emerald-950",
        btnGradient: "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25",
        accentGlow: "group-hover:shadow-emerald-500/15",
      };
    }
    return {
      cardBg: "bg-gradient-to-b from-purple-500/10 via-purple-50/70 to-white",
      cardBorder: "border-purple-200/90 hover:border-purple-400 hover:shadow-purple-500/20",
      topStrip: "border-t-4 border-t-purple-500",
      imageBg: "bg-gradient-to-b from-purple-100/50 via-purple-50/40 to-white",
      badge: "bg-purple-100/90 text-purple-900 border-purple-300 font-bold",
      titleHover: "hover:text-purple-700",
      bullet: "text-purple-500",
      priceText: "text-purple-950",
      btnGradient: "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-500/25",
      accentGlow: "group-hover:shadow-purple-500/15",
    };
  };

  const style = getBrandStyle(product.brand);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl ${style.cardBg} border ${style.cardBorder} ${style.topStrip} transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${style.accentGlow} overflow-hidden`}
    >
      {/* Product Image Slot with tinted brand background */}
      <div className={`relative aspect-[4/3] ${style.imageBg} flex items-center justify-center p-4 overflow-hidden border-b border-slate-200/70`}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/images/card-olflex.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-white/60 rounded-lg">
            <ShieldCheck className="w-10 h-10 mb-2 opacity-50 text-blue-500" />
            <span className="text-xs uppercase tracking-wider font-mono font-bold">Industrial OEM Part</span>
          </div>
        )}

        {/* Quick View Button - Removed as per user request */}

        {/* Stock tag */}
        <div className="absolute top-3 left-3 text-[11px] font-mono text-emerald-800 font-bold flex items-center gap-1.5 bg-white/95 px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{product.stock.includes("(") ? product.stock.split("(")[0].trim() : "Ready Stock"}</span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Brand & Part pill */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-mono mb-2 min-w-0">
          <span className={`px-2 py-0.5 rounded border text-[10px] shrink-0 font-bold ${style.badge}`}>
            {product.brand}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600 font-semibold truncate max-w-[140px] sm:max-w-none">{product.partNo}</span>
        </div>

        {/* Product Title */}
        {isLappCat1 ? (
          <Link
            to="/olflex-cables"
            className={`text-xs sm:text-sm font-bold text-slate-900 ${style.titleHover} transition-colors line-clamp-2 mb-2 sm:mb-3 leading-snug break-words hyphens-auto`}
          >
            {product.name}
          </Link>
        ) : (
          <div
            className={`text-xs sm:text-sm font-bold text-slate-900 transition-colors line-clamp-2 mb-2 sm:mb-3 leading-snug break-words hyphens-auto`}
          >
            {product.name}
          </div>
        )}

        {/* Key Specs bullets */}
        <ul className="space-y-1 mb-3 sm:mb-4 text-[11px] sm:text-xs text-slate-700 flex-1 font-medium min-w-0">
          {product.specs.slice(0, 2).map((spec, i) => (
            <li key={i} className="line-clamp-1 flex items-baseline gap-1.5 min-w-0">
              <span className={`${style.bullet} font-mono text-[10px] font-bold shrink-0`}>▪</span>
              <span className="truncate">{spec}</span>
            </li>
          ))}
        </ul>

        {/* Primary Buy / Add to RFQ CTA - Removed as per user request */}
      </div>
    </div>
  );
};
