import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Search,
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Upload,
  Paperclip,
  Award,
  Truck,
  Users,
  X,
} from "lucide-react";
import { PRODUCTS_DATA, CATEGORIES, BRANDS } from "../data/products";
import { ProductCard } from "../components/products/ProductCard";
import { QuickViewModal } from "../components/ui/QuickViewModal";
import { RFQModal } from "../components/ui/RFQModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { Product, QuotationDocument, QuotationItem } from "../types";

export const Home: React.FC = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const { user, saveQuote } = useAuth();
  const { showToast } = useToast();

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Catalog Filtering State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("lapp");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [showCatalog, setShowCatalog] = useState(true);

  // Modals
  const [brandModal, setBrandModal] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqProductName, setRfqProductName] = useState<string | null>(null);
  const [rfqProductPrice, setRfqProductPrice] = useState<number | null>(null);

  // RFQ Form Section State
  const [rfqCompany, setRfqCompany] = useState(user?.company || "");
  const [rfqName, setRfqName] = useState(user?.name || "");
  const [rfqEmail, setRfqEmail] = useState(user?.email || "");
  const [rfqPhone, setRfqPhone] = useState(user?.phone || "");
  const [rfqGstin, setRfqGstin] = useState(user?.gstin || "");
  const [rfqCategory, setRfqCategory] = useState("lapp");
  const [rfqQuantity, setRfqQuantity] = useState("500");
  const [rfqCity, setRfqCity] = useState(user?.city || "Bangalore");
  const [rfqNotes, setRfqNotes] = useState("");
  const [rfqFiles, setRfqFiles] = useState<{ name: string; size: number }[]>([]);
  const [rfqSubmitting, setRfqSubmitting] = useState(false);
  const [rfqSuccessRef, setRfqSuccessRef] = useState<string | null>(null);

  // Sync user state to RFQ form if user logs in
  useEffect(() => {
    if (user) {
      if (!rfqCompany) setRfqCompany(user.company || "");
      if (!rfqName) setRfqName(user.name);
      if (!rfqEmail) setRfqEmail(user.email);
      if (!rfqPhone) setRfqPhone(user.phone || "");
      if (!rfqGstin) setRfqGstin(user.gstin || "");
    }
  }, [user]);

  // Handle URL hashes for smooth scrolling & catalog visibility
  useEffect(() => {
    if (location.hash === "#catalog" || location.search.includes("search")) {
      setShowCatalog(true);
    }
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
      setShowCatalog(true);
    }
  }, [location]);

  // Auto-advance Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5); // 5 slides now
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      brand: "LAPP KABEL STUTTGART",
      origin: "Germany",
      logo: "/images/logo-lapp.png",
      tagline: "World's First Flexible Control Cable",
      headline: "ÖLFLEX® CLASSIC 110 Ready Stock",
      description:
        "High flexibility, flame retardant to IEC 60332-1, and certified oil resistance. Available in over 100 core and cross-section combinations directly from Bangalore warehouse.",
      img: "/images/promo-lapp.jpg",
      badge: "VDE REG. NO. 7030",
      ctaText: "Open ÖLFLEX® Center",
      ctaLink: "/about-lapp",
      productSampleId: "lapp-01",
      bgClass: "bg-gradient-to-r from-zinc-950 via-slate-900 to-amber-950/80 border-amber-500/30",
      pillClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      btnClass: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30",
      cardBorder: "border-amber-500/30",
    },
    {
      brand: "EATON - MOELLER",
      origin: "Germany / USA",
      logo: "/images/logo-eaton.png",
      tagline: "Intelligent Motor Protection & Switchgear",
      headline: "PKZM0 Breakers & DILM Contactors",
      description:
        "Switching capacity up to 150 kA, differential phase-failure sensitivity, and electronic wide-range coil technology for modern automated industrial panels.",
      img: "/images/promo-eaton.jpg",
      badge: "DIRECT FACTORY RATES",
      ctaText: "Explore Eaton Switchgear",
      ctaLink: "/about-eaton",
      productSampleId: "eaton-01",
      bgClass: "bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/90 border-blue-500/30",
      pillClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      btnClass: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/30",
      cardBorder: "border-blue-500/30",
    },
    {
      brand: "MENNEKES GERMANY",
      origin: "Germany",
      logo: "/images/logo-mennekes.png",
      tagline: "Industrial CEE Pin & Sleeve Standards",
      headline: "Watertight IP44 & IP67 Plugs & Sockets",
      description:
        "Manufactured using robust Polyamide 6 material and premium nickel-plated contacts for ultimate durability. We offer exclusive factory box rates tailored for machine builders and large-scale industrial projects.",
      img: "/images/promo-mennekes.jpg",
      badge: "OEM BOX RATES",
      ctaText: "Explore Mennekes",
      ctaLink: "/about-mennekes",
      productSampleId: "menn-01",
      bgClass: "bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/90 border-rose-500/30",
      pillClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      btnClass: "bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white shadow-rose-500/30",
      cardBorder: "border-rose-500/30",
    },
    {
      brand: "PARTEX SWEDEN",
      origin: "Sweden",
      logo: "/images/logo-partex.png",
      tagline: "Swedish Precision Wire Identification",
      headline: "PA Chevron Markers & ProMark T-1000",
      description:
        "Interlocking chevron cut guarantees alignment. Self-extinguishing UL94-V0 PVC and high-speed portable thermal printers for control panel builders and switchboard makers.",
      img: "/images/promo-partex.jpg",
      badge: "FREE SAMPLE KIT ON RFQ",
      ctaText: "Explore Partex Marking",
      ctaLink: "/about-partex",
      productSampleId: "partex-01",
      bgClass: "bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/90 border-emerald-500/30",
      pillClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      btnClass: "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-emerald-500/30",
      cardBorder: "border-emerald-500/30",
    },
    {
      brand: "CLEARANCE SALE",
      origin: "India",
      isFullBanner: true,
      logo: "",
      tagline: "",
      headline: "",
      description: "",
      img: "/images/slider4.jpg",
      badge: "",
      ctaText: "",
      ctaLink: "",
      productSampleId: "",
      bgClass: "",
      pillClass: "",
      btnClass: "",
      cardBorder: "",
    }
  ];

  // Filter Catalog
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_DATA];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory || p.id === selectedCategory);
    }

    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.partNo.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleRfqFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const arr = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      setRfqFiles((prev) => [...prev, ...arr]);
      showToast(`Attached ${arr.length} file(s) to RFQ`, "info");
    }
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitting(true);

    const refNo = `SE-BOM-${Date.now().toString().slice(-6)}`;
    setRfqSuccessRef(refNo);

    const qty = parseFloat(rfqQuantity) || 100;
    const estRate = 85.0;
    const sub = qty * estRate;
    const gst = sub * 0.18;

    const mockItem: QuotationItem = {
      id: `bom-${Date.now()}`,
      partNo: "BOM-SCHEDULE",
      name: `Project BOM Schedule (${rfqCategory.toUpperCase()})`,
      brand: rfqCategory.toUpperCase(),
      hsnCode: "85444990",
      unit: "lot",
      qty: 1,
      unitPrice: sub,
      totalBeforeTax: sub,
      gstRate: 18,
      gstAmount: gst,
      totalWithTax: sub + gst,
    };

    const doc: QuotationDocument = {
      id: refNo,
      quoteNo: refNo,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      validUntil: new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      customerName: rfqName,
      companyName: rfqCompany,
      gstin: rfqGstin,
      email: rfqEmail,
      phone: rfqPhone,
      address: "Project Site Delivery",
      city: rfqCity,
      state: "Karnataka",
      pincode: "560001",
      items: [mockItem],
      subtotal: sub,
      cgst: gst / 2,
      sgst: gst / 2,
      igst: 0,
      isInterstate: false,
      freight: 0,
      grandTotal: sub + gst,
      deliveryTerms: "Ex-Bangalore Central Warehouse",
      paymentTerms: "Standard Corporate Credit Terms",
      status: "Generated",
      notes: rfqNotes,
    };

    saveQuote(doc);

    setTimeout(() => {
      setRfqSubmitting(false);
      showToast("Quotation request registered! Reference generated.", "success");
    }, 600);
  };

  const brandCardStyles: Record<string, { bg: string; border: string; strip: string; badge: string; text: string }> = {
    lapp: {
      bg: "bg-gradient-to-br from-amber-500/15 via-amber-50 to-orange-100/70",
      border: "border-amber-300 hover:border-amber-500 shadow-amber-500/10",
      strip: "border-t-4 border-t-amber-500",
      badge: "bg-amber-200 text-amber-950 font-bold",
      text: "text-amber-800 hover:text-amber-950",
    },
    eaton: {
      bg: "bg-gradient-to-br from-blue-500/15 via-sky-50 to-blue-100/70",
      border: "border-blue-300 hover:border-blue-500 shadow-blue-500/10",
      strip: "border-t-4 border-t-blue-500",
      badge: "bg-blue-200 text-blue-950 font-bold",
      text: "text-blue-800 hover:text-blue-950",
    },
    mennekes: {
      bg: "bg-gradient-to-br from-rose-500/15 via-rose-50 to-red-100/70",
      border: "border-rose-300 hover:border-rose-500 shadow-rose-500/10",
      strip: "border-t-4 border-t-rose-500",
      badge: "bg-rose-200 text-rose-950 font-bold",
      text: "text-rose-800 hover:text-rose-950",
    },
    partex: {
      bg: "bg-gradient-to-br from-emerald-500/15 via-emerald-50 to-teal-100/70",
      border: "border-emerald-300 hover:border-emerald-500 shadow-emerald-500/10",
      strip: "border-t-4 border-t-emerald-500",
      badge: "bg-emerald-200 text-emerald-950 font-bold",
      text: "text-emerald-800 hover:text-emerald-950",
    },
  };

  return (
    <main className="flex flex-col gap-0">
      {/* Spacer wrapper for sections after the hero */}
      {/* ======================================================== */}
      {/* HERO BANNER CAROUSEL SLIDER                               */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* HERO BANNER CAROUSEL SLIDER                               */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* HERO BANNER CAROUSEL SLIDER                               */}
      {/* ======================================================== */}
      <section className="w-full text-slate-900 bg-slate-950 border-b border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="w-full relative max-w-7xl mx-auto">
          <div className="relative">
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              if (!isActive) return null;

              if (slide.isFullBanner) {
                return (
                  <div
                    key={slide.brand}
                    className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] z-10 animate-in fade-in duration-500 cursor-pointer overflow-hidden bg-slate-950"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedBrand("all");
                      setShowCatalog(true);
                      setTimeout(() => {
                        const catEl = document.getElementById("catalog");
                        if (catEl) catEl.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    <img src={slide.img} alt="Clearance Sale" className="absolute inset-0 w-full h-full object-cover object-center" />
                  </div>
                );
              }

              return (
                <div
                  key={slide.brand}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 md:p-12 min-h-[460px] md:min-h-[500px] relative z-10 animate-in fade-in duration-500"
                >
                  {/* Left Side — Text Container */}
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-5 z-10">
                    {/* Brand Logo & Country Origin Pill */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white px-3 py-1.5 rounded-xl flex items-center shadow-md h-10">
                        <img src={slide.logo} alt={slide.brand} className="h-6 sm:h-7 object-contain" />
                      </div>
                    </div>

                    {/* Subtitle / Eyebrow Text */}
                    <span className="text-amber-400 font-extrabold text-xs tracking-widest uppercase">
                      {slide.tagline}
                    </span>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                      {slide.headline}
                    </h1>

                    {/* Description Paragraph */}
                    <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Buttons Group */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        to={slide.ctaLink}
                        className={`px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg ${slide.btnClass}`}
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          const brandId = slide.brand.toLowerCase().includes("lapp")
                            ? "lapp"
                            : slide.brand.toLowerCase().includes("eaton")
                            ? "eaton"
                            : slide.brand.toLowerCase().includes("mennekes")
                            ? "mennekes"
                            : "partex";
                          setSelectedBrand(brandId);
                          setSelectedCategory("all");
                          setShowCatalog(true);
                          setTimeout(() => {
                            const catEl = document.getElementById("catalog");
                            if (catEl) catEl.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-colors backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <span>Explore {slide.brand.split(" ")[0]} Catalog ⚡</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Side — Image / Media Container */}
                  <div className="lg:col-span-5 relative flex justify-center items-center z-10 w-full mt-6 lg:mt-0">
                    <div className={`relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border ${slide.cardBorder} shadow-2xl bg-slate-900/80 group`}>
                      <img src={slide.img} alt={slide.brand} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-md p-3 px-4 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-slate-300">
                        <span>{slide.brand}</span>
                        <Zap className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg backdrop-blur-md hidden sm:flex"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg backdrop-blur-md hidden sm:flex"
            >
              ›
            </button>

            {/* Carousel Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide
                      ? "w-7 bg-amber-400 shadow-sm"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 1. AUTHORIZED BRAND PORTFOLIOS: 4 BRAND CARDS & INLINE CATALOG */}
      {/* ======================================================== */}
      <section id="brand-portfolios" className="w-full scroll-mt-24 pt-12 lg:pt-16 pb-8 lg:pb-12 bg-white border-y border-slate-200 text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Authorized Brand Portfolios
              </h2>
            </div>
          </div>

          {/* 4 Brand Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full">
            {BRANDS.map((b: any) => {
              const style = brandCardStyles[b.id] || {
                bg: "bg-white",
                border: "border-slate-200 hover:border-slate-400",
                strip: "border-t-4 border-t-slate-500",
                badge: "bg-slate-100 text-slate-700",
                text: "text-amber-600",
              };
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand(b.id);
                    setSelectedCategory("all");
                    setShowCatalog(true);
                    setTimeout(() => {
                      const el = document.getElementById("catalog");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 150);
                  }}
                  className={`rounded-2xl ${style.bg} ${style.border} ${style.strip} p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2 min-h-[260px] lg:min-h-[290px] w-full ${
                    selectedBrand === b.id && showCatalog ? "ring-2 ring-amber-500 shadow-xl scale-[1.02] bg-white" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs h-14 flex items-center justify-center max-w-[140px] shrink-0">
                        <img src={b.logo} alt={b.name} className="max-h-8 w-auto object-contain" />
                      </div>
                      <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-md font-bold ${style.badge}`}>
                        {b.origin}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                        {b.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-medium line-clamp-3">
                        {b.description}
                      </p>
                    </div>
                  </div>
                  <div className={`pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs sm:text-sm font-bold ${style.text}`}>
                    <span>Explore {b.name.split(" ")[0]} Catalog</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline Product Catalog */}
          {showCatalog && (
            <div id="catalog" className={`w-full mt-4 pt-6 pb-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-r-2xl rounded-bl-2xl shadow-lg border-l-4 border-t-4 relative ${
              selectedBrand === 'lapp' ? 'border-amber-500 bg-amber-50/20' :
              selectedBrand === 'eaton' ? 'border-blue-500 bg-blue-50/20' :
              selectedBrand === 'mennekes' ? 'border-rose-500 bg-rose-50/20' :
              selectedBrand === 'partex' ? 'border-emerald-500 bg-emerald-50/20' :
              'border-slate-200'
            }`}>
              {/* Caret pointing to selected brand (visible mainly on lg screens where they are in 1 row) */}
              {selectedBrand !== 'all' && (
                <div className={`absolute -top-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] hidden lg:block ${
                  selectedBrand === 'lapp' ? 'left-[12.5%] border-b-amber-500' :
                  selectedBrand === 'eaton' ? 'left-[37.5%] border-b-blue-500' :
                  selectedBrand === 'partex' ? 'left-[62.5%] border-b-emerald-500' :
                  selectedBrand === 'mennekes' ? 'left-[87.5%] border-b-rose-500' : ''
                }`} style={{ transform: 'translateX(-50%)' }} />
              )}
              
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-slate-200 pb-6">
                {/* Header Side */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {selectedBrand !== "all" && (
                      <span className={`text-xs font-mono uppercase px-2.5 py-1 rounded-lg text-white font-bold ${
                        selectedBrand === 'lapp' ? 'bg-amber-500' :
                        selectedBrand === 'eaton' ? 'bg-blue-500' :
                        selectedBrand === 'mennekes' ? 'bg-rose-500' :
                        selectedBrand === 'partex' ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}>
                        {BRANDS.find((b) => b.id === selectedBrand)?.name || selectedBrand.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {selectedBrand !== "all"
                      ? `${BRANDS.find((b) => b.id === selectedBrand)?.name || selectedBrand.toUpperCase()} Product Catalog`
                      : "Industrial Electrical & Automation Catalog"}
                  </h3>
                </div>

                {/* Filters Side (Right Aligned) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 text-xs w-full xl:w-auto shrink-0">
                  <div className="relative w-full sm:w-64 lg:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder={selectedBrand !== "all" 
                        ? `Search part number or description across ${BRANDS.find((b) => b.id === selectedBrand)?.name?.split(' ')[0] || selectedBrand.toUpperCase()}...`
                        : "Search part number or description..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-white border rounded-xl pl-10 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs font-medium ${
                        selectedBrand === 'lapp' ? 'border-amber-200 focus:border-amber-500' :
                        selectedBrand === 'eaton' ? 'border-blue-200 focus:border-blue-500' :
                        selectedBrand === 'mennekes' ? 'border-rose-200 focus:border-rose-500' :
                        selectedBrand === 'partex' ? 'border-emerald-200 focus:border-emerald-500' : 'border-slate-300 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  {selectedBrand !== "all" && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full sm:w-auto max-w-[200px] truncate bg-white border rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none shadow-xs font-semibold ${
                        selectedBrand === 'lapp' ? 'border-amber-200 focus:border-amber-500' :
                        selectedBrand === 'eaton' ? 'border-blue-200 focus:border-blue-500' :
                        selectedBrand === 'mennekes' ? 'border-rose-200 focus:border-rose-500' :
                        selectedBrand === 'partex' ? 'border-emerald-200 focus:border-emerald-500' : 'border-slate-300 focus:border-amber-500'
                      }`}
                    >
                      <option value="all">All {BRANDS.find((b) => b.id === selectedBrand)?.name.split(' ')[0] || ""} Products</option>
                      {PRODUCTS_DATA.filter(p => p.brand.toLowerCase().includes(selectedBrand.toLowerCase())).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`w-full sm:w-auto bg-white border rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none shadow-xs font-semibold ${
                      selectedBrand === 'lapp' ? 'border-amber-200 focus:border-amber-500' :
                      selectedBrand === 'eaton' ? 'border-blue-200 focus:border-blue-500' :
                      selectedBrand === 'mennekes' ? 'border-rose-200 focus:border-rose-500' :
                      selectedBrand === 'partex' ? 'border-emerald-200 focus:border-emerald-500' : 'border-slate-300 focus:border-amber-500'
                    }`}
                  >
                    <option value="featured">Sort: Featured OEM</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Product Name (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onDirectQuote={(p) => { setRfqProductName(`${p.name} (${p.partNo})`); setRfqProductPrice(p.price); setRfqModalOpen(true); }}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white text-slate-500 text-xs space-y-2">
                  <p>No products matched your active filters.</p>
                  <button
                    onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); setSearchQuery(""); }}
                    className="text-amber-600 underline font-bold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>



      {/* ======================================================== */}
      {/* 5. RFQ & BULK QUOTATION FORM: CLEAN WHITE PANEL          */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 5. RFQ & BULK QUOTATION FORM: CLEAN WHITE PANEL          */}
      {/* ======================================================== */}
      <section id="rfq" className="w-full bg-white scroll-mt-24 pt-6 lg:pt-8 pb-6 lg:pb-8 text-slate-900 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Subtle amber background glow */}
          <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8 space-y-2 relative z-10">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 flex items-center gap-2 font-bold">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>B2B Commercial Procurement Desk</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Request a Bulk Project Quotation (RFQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Submit your project schedule, cable sizing requirements, or upload an Excel Bill of Materials (BOM). Our engineering sales desk generates official GST quotations with delivery timeline commitments.
            </p>
          </div>

          {rfqSuccessRef ? (
            <div className="border border-emerald-200 bg-emerald-50 rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Quotation Request Dispatched!
              </h3>
              <div className="font-mono text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-300 inline-block text-sm font-bold shadow-xs">
                Quotation Reference: <strong>{rfqSuccessRef}</strong>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto font-medium">
                Your quotation has been compiled and saved to your Corporate Portal. An official commercial copy has been submitted for dispatch review.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/quotation"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  View Quotation Document &amp; Print PDF
                </Link>
                <button
                  onClick={() => setRfqSuccessRef(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Submit Another RFQ
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRfqSubmit} className="space-y-4 text-xs relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Automation Pvt Ltd"
                    value={rfqCompany}
                    onChange={(e) => setRfqCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Contact Officer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Purchasing / Project Engineer"
                    value={rfqName}
                    onChange={(e) => setRfqName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@company.com"
                    value={rfqEmail}
                    onChange={(e) => setRfqEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99000 48877"
                    value={rfqPhone}
                    onChange={(e) => setRfqPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Delivery Site City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bangalore, Chennai, Pune..."
                    value={rfqCity}
                    onChange={(e) => setRfqCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Buyer GSTIN (for ITC 18%)
                  </label>
                  <input
                    type="text"
                    placeholder="29ABCDE1234F1Z5"
                    value={rfqGstin}
                    onChange={(e) => setRfqGstin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono uppercase"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Primary Product Line
                  </label>
                  <select
                    value={rfqCategory}
                    onChange={(e) => setRfqCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="lapp">LAPP Kabel Flexible Cables &amp; Wires</option>
                    <option value="eaton">EATON Moeller Switchgear &amp; Starters</option>
                    <option value="mennekes">MENNEKES CEE Industrial Plugs</option>
                    <option value="partex">PARTEX Sweden Marking Systems</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-800 font-bold mb-1">
                    Estimated Meters / Quantity
                  </label>
                  <input
                    type="text"
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(e.target.value)}
                    placeholder="e.g. 500m of 4G2.5, 20x 32A 5P plugs"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Bill of Materials (BOM) Details &amp; Specifications
                </label>
                <textarea
                  rows={3}
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Mention exact part numbers, cable sizes (e.g. 3G1.5, 4G4.0, 7G1.0), required drum cutting lengths, and site delivery dates..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white leading-relaxed font-medium"
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
                  <span>Attach Excel BOM / Drawing / RFQ Schedule (Optional)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Max 25MB each</span>
                </label>
                <label className="border border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Upload className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-slate-900 font-bold">Drop BOM spreadsheet or click to browse</span>
                  <span className="text-[11px] text-slate-500 font-medium">Excel (.xlsx, .csv), PDF, CAD, ZIP</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleRfqFileChange}
                    className="hidden"
                  />
                </label>
                {rfqFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rfqFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                        <span className="truncate max-w-[180px]">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={rfqSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50"
                >
                  {rfqSubmitting ? "Submitting Request..." : "Submit Request for Quotation"}
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 7. ABOUT COMPANY SECTION                                 */}
      {/* ======================================================== */}
      <section id="about" className="w-full scroll-mt-24 pt-8 lg:pt-12 pb-12 lg:pb-16 bg-white border-b border-slate-200 text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
                Company Profile
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Siddhi Kabel Corporation Private Limited
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                <p>
                  Siddhi Kabel Corporation Private Limited is one of the leading and reliable suppliers of world class Industrial Electrical, Automation & Safety Products.
                </p>
                <p>
                  We at Siddhi Kabel specialize in providing solutions for high quality industrial products. Our primary focus is to service the needs of our customers for high quality products and services, with more than 15 years of experience in industrial Electrical field and association with leading national and multinational customers & Suppliers, Siddhi Kabel offers superior quality products coupled with best technical support.
                </p>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <img 
                src="/images/company-profile.jpg" 
                alt="Industrial Automation and Robotics - Siddhi Kabel" 
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80 text-xs">
            <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-white border border-amber-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>15+ Years Experience</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                More than 15 years of technical experience in the industrial electrical field, serving leading national and multinational customers & suppliers with best technical support.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-50/60 to-white border border-blue-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Warehouse Infrastructure</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Equipped with motorized cable decoilers, drum handling cranes, and specialized cutting stations to provide exact length requirements without charging for unnecessary scrap.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/60 to-white border border-emerald-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Transparent Commercials</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Full 18% GST Input Tax Credit (ITC) compliance, formal commercial quotations with price firm commitments, and structured credit facilities for verified industrial corporate accounts.
              </p>
            </div>
            </div>
            {/* 4 Trust Metrics Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-200/80">
          {/* Card 1: Amber / Ready stock */}
          <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-white border border-amber-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>25,000m+ Ready Stock</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium text-xs">
              Maintained in Bangalore central depot across ÖLFLEX® cables, CEE plugs, and motor breakers.
            </p>
          </div>

          {/* Card 2: Blue / OEM Genuine */}
          <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-50/60 to-white border border-blue-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>100% OEM Genuine</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium text-xs">
              Direct factory warranty with manufacturer batch test reports (VDE, UL, CSA, CE, RoHS).
            </p>
          </div>

          {/* Card 3: Emerald / Rapid Dispatch */}
          <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/60 to-white border border-emerald-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>24-48 Hrs Dispatch</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium text-xs">
              Immediate same-day or next-day dispatch for Peenya, Bommasandra, Hosur, and South-India sites.
            </p>
          </div>

          {/* Card 4: Purple / Corporate Clients */}
          <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-50/60 to-white border border-purple-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>1,200+ Corporate Clients</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium text-xs">
              Trusted by automation OEMs, panel builders, switchgear fabricators, and infrastructure leaders.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onRequestQuoteNow={(p) => {
          setQuickViewProduct(null);
          setRfqProductName(`${p.name} (${p.partNo})`);
          setRfqModalOpen(true);
        }}
      />

      {/* Global RFQ Modal */}
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
    </main>
  );
};
