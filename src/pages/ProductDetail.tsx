import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Plus,
  Minus,
  ArrowRight,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { PRODUCTS_DATA, ALL_OLFLEX_PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { RFQModal } from "../components/ui/RFQModal";
import { ImageZoomModal } from "../components/ui/ImageZoomModal";

export const ProductDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const searchParams = new URLSearchParams(location.search);
  const productId = routeId || searchParams.get("id") || "lapp-01";
  const { openCart } = useCart();

  const product = useMemo(() => {
    // 1. Direct match in PRODUCTS_DATA by ID
    const foundDirect = PRODUCTS_DATA.find((p) => p.id === productId);
    if (foundDirect) return foundDirect;

    // 2. Match in PRODUCTS_DATA by Part Number
    const foundByPartNo = PRODUCTS_DATA.find(
      (p) => p.partNo.toLowerCase() === productId.toLowerCase()
    );
    if (foundByPartNo) return foundByPartNo;

    // 3. Match in ALL_OLFLEX_PRODUCTS by Part Number
    const olflexMatch = ALL_OLFLEX_PRODUCTS.find(
      (p) => p.partNo.toLowerCase() === productId.toLowerCase()
    );
    if (olflexMatch) {
      return {
        id: `olflex-${olflexMatch.partNo}`,
        category: "cables" as const,
        brand: "LAPP KABEL",
        partNo: olflexMatch.partNo,
        name: olflexMatch.name,
        specs: [
          `Cores: ${olflexMatch.core} Cores (${olflexMatch.pe === "G" ? "With Yellow/Green Earth" : "Black Numbered Cores"})`,
          `Cross Section: ${olflexMatch.size} mm² (Flexible bare copper Class 5)`,
          `Outer Diameter: ${olflexMatch.outerDia ? `${olflexMatch.outerDia} mm` : "Approx. 6.3 mm"}`,
          `Copper Index: ${olflexMatch.copperIndex ? `${olflexMatch.copperIndex} kg/km` : "Approx. 28.8 kg/km"}`,
          `Weight: ${olflexMatch.weight ? `${olflexMatch.weight} kg/km` : "Approx. 75 kg/km"}`,
          `Test Voltage: 4000 V · Temp: -40°C to +80°C static / -5°C to +70°C flexing`,
        ],
        voltage: "300/500 V",
        tempRange: "-40°C to +80°C static / -5°C to +70°C flexing",
        conductor: "Fine-wire strands of bare copper (IEC 60228 Class 5)",
        price: olflexMatch.price,
        unit: "meter" as const,
        stock: "Bangalore Central Hub (In Stock - Ready Cut)",
        icon: "cable",
        application: "Oil-resistant, flexible control and power cable for machine tools, assembly lines, automation, and control cabinets (VDE 7030 / IEC 60332-1-2 flame retardant).",
        image: "/images/cable-olflex-cores.png",
        hsnCode: "85444990",
      };
    }

    return PRODUCTS_DATA[0];
  }, [productId]);

  const [qty, setQty] = useState(product?.brand?.includes("LAPP") ? 25 : 1);
  const [selectedImg, setSelectedImg] = useState(product.image || "/images/cable-olflex-cores.png");
  const [rfqOpen, setRfqOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [inlineZoom, setInlineZoom] = useState(1);

  // Variant States
  const [selectedCore, setSelectedCore] = useState('2 Core');
  const [selectedSize, setSelectedSize] = useState('0.5 Sqmm');
  const [selectedEarth, setSelectedEarth] = useState('Without (All Numbered - X)');
  const [selectedColor, setSelectedColor] = useState('Black');

  const isSingleCore = product.name.toLowerCase().includes("single core") || product.category === 'Single Core';

  React.useEffect(() => {
    if (product.id === "lapp-cat-1") {
      navigate("/olflex-cables", { replace: true });
    } else if (product) {
      setQty(product.brand.includes("LAPP") ? 25 : 1);
      setSelectedImg(product.image || "/images/cable-olflex-cores.png");
    }
  }, [product, navigate]);

  const { addToCart, cart } = useCart();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (product.brand.includes("LAPP") && selectedCore) {
      const coreNum = parseInt(selectedCore.split(' ')[0]) || 2;
      const sizeNum = parseFloat(selectedSize.split(' ')[0]) || 0.5;
      const sumHash = coreNum + sizeNum * 100; // unique enough index

      // Authentic LAPP product images from e.lapp.com
      const images = [
        "https://e.lapp.com/media/wysiwyg/OLFLEX_11.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/PbY69fQAPx2jbzbFLWJfwdvd-a9AiEdYbYYUvbrNCYM~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/PSJEYSpSwPlHnFF-lpM68WdZH4LF9jsH7rclnWxtZeM~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/EN2KMbDoEZCg_FD0D9IzzPI5QIGik6TS-fjcuKjvp0o~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/l226RQIO9d26Nb_87YS6mdKBc4s0fzmcxUk6uXlc5sY~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/5OILG9D2NXU-DmxaMYhFp6OL36Smk1VziSJvYQcFDWA~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/Ib2fY_XWT6H8uh7_b2NOlMIHhIMLeD8wNWXfsOedcfM~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/zXRgMuVfRgn1g-opCvBSZKGhLXYCRdUHCs_tSjAgZVs~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/3uslMUlDV0KDCAoc_UArzCGcCddjKAv5bqLnPICPLG0~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/v5VKLl89Hqf5UYY4wTbXWI4rI4JUg10N5kBAVLJOJ3A~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/7Xpi1vuBlWGibTwYyj0Jou1HDxMBnG2K7ScLPCQg9ZM~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/0L0kZmOzGLB281eBk7IWCabfUxaZuDrpBF_89NiySy8~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/9gSa0efisdBRoLm9czBhIy1RGq1j09haviQwSeM-SKU~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/HBMdVPVjxRiW9xzyIQrv4GxVbJXJTzcHugoSggvtVX8~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/ke_oT2_ms7wgMBZQ3n0b8v4A0BPB7QOSO1n71KyW7co~.jpg",
        "https://e.lapp.com/media/catalog/product/e/lapp/tNgrNuMzBB9kOnJ6tn_kmMZheU8vDlyLeNo154Xcs1c~.jpg"
      ];
      // Pick a deterministic image based on core number and size
      const index = Math.floor(sumHash) % images.length;
      setSelectedImg(images[index]);
    }
  }, [selectedCore, selectedSize, product.brand]);
  const handleStepUp = () => {
    if (product.unit === "meter") {
      setQty((q) => {
        if (q < 25) return 25;
        return Math.floor(q / 25) * 25 + 25;
      });
    } else {
      setQty((q) => q + 1);
    }
  };

  const handleStepDown = () => {
    if (product.unit === "meter") {
      setQty((q) => {
        if (q <= 25) return 25;
        return Math.ceil(q / 25) * 25 - 25;
      });
    } else {
      setQty((q) => Math.max(1, q - 1));
    }
  };

  const galleryImages = [
    { src: "/images/cable-olflex-cores.png", label: "Numbered Cores" },
    { src: "/images/cable-olflex-angle.png", label: "Angle View" },
    { src: "/images/cable-olflex-drum.png", label: "Wooden Drum" },
  ];

  const isInCart = cart.some((item) => item.id === product.id);

  const calculatedPrice = useMemo(() => {
    if (!product.brand.includes("LAPP")) return product.price;
    const coreNum = isSingleCore ? 1 : (parseInt(selectedCore.split(' ')[0]) || 2);
    const sizeNum = parseFloat(selectedSize.split(' ')[0]) || 0.5;
    
    // Calculate a dynamic price based on the selected core and size
    // Using simple multipliers based on the base values (2 core, 0.5 sqmm)
    const coreMultiplier = isSingleCore ? 1 : coreNum / 2;
    const sizeMultiplier = sizeNum / 0.5;
    
    // To ensure price doesn't go crazy high for 52 cores, we add a simple dampening formula
    let finalPrice = product.price * Math.pow(coreMultiplier, 0.85) * Math.pow(sizeMultiplier, 0.9);
    
    // Add a small 5% premium for the Yellow/Green (Earth) color option
    if (selectedEarth === 'With (Yellow/Green - G)') {
      finalPrice = finalPrice * 1.05;
    }
    
    return Math.round(finalPrice * 100) / 100;
  }, [product.price, product.brand, selectedCore, selectedSize, selectedEarth]);

  const handleAddToCart = () => {
    const variantName = product.brand.includes("LAPP") 
      ? isSingleCore 
        ? `${product.name} (${selectedSize}, ${selectedColor})`
        : `${product.name} (${selectedCore}, ${selectedSize}, ${selectedEarth === 'With (Yellow/Green - G)' ? 'With Earth' : 'Without Earth'})`
      : product.name;

    addToCart({ ...product, name: variantName, price: calculatedPrice }, qty);
    openCart();
  };

  const handleInstantQuote = () => {
    setRfqOpen(true);
  };

  const lineTotal = calculatedPrice * qty;
  const gstLine = lineTotal * 0.18;
  const totalWithGst = lineTotal + gstLine;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-600 transition-colors font-medium">
            Home
          </Link>
          <span>/</span>
          <Link to="/#catalog" className="hover:text-amber-600 transition-colors font-medium">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-amber-700 font-bold">{product.brand}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {product.partNo}
          </span>
        </div>

        {/* Contiguous PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & High-Res Inspection (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 flex items-center justify-center aspect-square relative overflow-hidden shadow-lg group">
              <div
                className="w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setIsZoomModalOpen(true)}
              >
                <img
                  src={selectedImg}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  style={{
                    transform: `scale(${inlineZoom})`,
                    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="max-h-80 object-contain drop-shadow-sm select-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = product.image || "/images/card-olflex.jpg";
                  }}
                />
              </div>

              {/* Ready Stock badge */}
              <div className="absolute top-4 left-4 text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs pointer-events-none">
                {product.stock}
              </div>

              {/* Interactive Zoom Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl backdrop-blur-md z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInlineZoom((prev) => Math.max(prev - 0.25, 1));
                  }}
                  disabled={inlineZoom <= 1}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-40 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-amber-400 px-1.5 tabular-nums min-w-[40px] text-center">
                  {Math.round(inlineZoom * 100)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInlineZoom((prev) => Math.min(prev + 0.25, 2.5));
                  }}
                  disabled={inlineZoom >= 2.5}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-40 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {inlineZoom > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInlineZoom(1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Reset Zoom (100%)"
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
                <div className="h-4 w-px bg-slate-700 mx-0.5" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomModalOpen(true);
                  }}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px] font-bold"
                  title="Open Fullscreen Lightbox (+/- zoom)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Zoom Full</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex items-center gap-3 mt-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img.src)}
                  className={`w-20 h-20 rounded-xl border-2 p-1 overflow-hidden transition-all ${
                    selectedImg === img.src
                      ? "border-amber-500 shadow-md"
                      : "border-slate-200 hover:border-amber-300 hover:shadow-sm opacity-70 hover:opacity-100 bg-white"
                  }`}
                  title={img.label}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Quick Fact sheet */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-2 text-xs shadow-2xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Authorized Distribution Compliance</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Supplied under official warranty directly from LAPP Kabel / EATON manufacturing plants. Test reports and factory inspection certificates are issued with every dispatch drum.
              </p>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono text-slate-400 mb-2 font-bold">
                <span className="text-amber-600">{product.brand}</span>
                <span>·</span>
                <span>Part No: {product.partNo}</span>
                {product.hsnCode && (
                  <>
                    <span>·</span>
                    <span>HSN: {product.hsnCode}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-6">
                {product.name}
              </h1>
            </div>

            {/* LAPP Variant Layout - New Design */}
            {product.brand.includes("LAPP") && (
              <div className="border-[1.5px] border-[#00a7e1]/20 rounded-[24px] p-5 sm:p-6 bg-white mb-6 shadow-sm space-y-6">
                
                {/* Grid for Variant Options */}
                <div className="space-y-5">
                  {!isSingleCore && (
                    <div>
                      <label className="font-bold text-slate-800 text-sm block mb-2">1. Core</label>
                      <div className="flex flex-wrap gap-2">
                        {['2 Core', '3 Core', '4 Core', '5 Core', '6 Core', '7 Core', '8 Core', '10 Core', '12 Core', '14 Core', '16 Core', '18 Core', '20 Core', '25 Core', '30 Core', '34 Core', '40 Core', '50 Core'].map(core => (
                          <button
                            key={core}
                            onClick={() => setSelectedCore(core)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedCore === core ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50'}`}
                          >
                            {core}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-800 text-sm block mb-2">{isSingleCore ? '1. Size (Sqmm)' : '2. Size (Sqmm)'}</label>
                    <div className="flex flex-wrap gap-2">
                      {['0.5 Sqmm', '0.75 Sqmm', '1 Sqmm', '1.5 Sqmm', '2.5 Sqmm', '4 Sqmm', '6 Sqmm', '10 Sqmm', '16 Sqmm', '25 Sqmm', '35 Sqmm'].map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedSize === size ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isSingleCore ? (
                    <div>
                      <label className="font-bold text-slate-800 text-sm block mb-2">2. Color</label>
                      <div className="flex flex-wrap gap-2">
                        {['Black', 'Red', 'Blue', 'Yellow', 'Green', 'Grey', 'Brown', 'White'].map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedColor === color ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50'}`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-slate-800 text-sm leading-tight">3. Protective conductor</label>
                        <span className="text-amber-600 font-bold text-[11px]">
                          {selectedEarth === 'Without (All Numbered - X)' ? 'Without Earth (X)' : 'With Earth (G)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <button 
                          onClick={() => setSelectedEarth('With (Yellow/Green - G)')}
                          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${
                            selectedEarth === 'With (Yellow/Green - G)'
                              ? 'border-emerald-500 text-emerald-700 bg-emerald-50 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50'
                          }`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 shadow-xs" />
                          With (Yellow/Green - G)
                        </button>
                        <button 
                          onClick={() => setSelectedEarth('Without (All Numbered - X)')}
                          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${
                            selectedEarth === 'Without (All Numbered - X)'
                              ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
                          Without (All Numbered - X)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Real-time Meter / Quantity Calculator */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-0">
                <div>
                  <span className="text-[11px] uppercase font-mono text-slate-400 font-bold block">
                    Contract Rate (Ex-GST)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                      ₹{calculatedPrice % 1 === 0 ? calculatedPrice.toLocaleString("en-IN") : calculatedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      /{product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">
                    Update Qty ({product.unit === 'meter' ? 'Mtrs' : 'Nos'})
                  </span>
                  <div className="flex items-center justify-start sm:justify-end">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                      <button onClick={handleStepDown} className="px-4 py-2 sm:px-3.5 sm:py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold border-r border-slate-200 transition-colors active:bg-slate-200">-</button>
                      <span className="px-6 py-2 sm:px-4 sm:py-1.5 text-base sm:text-sm font-bold font-mono text-slate-900 bg-white min-w-[4rem] sm:min-w-[3.5rem] text-center">{qty}</span>
                      <button onClick={handleStepUp} className="px-4 py-2 sm:px-3.5 sm:py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold border-l border-slate-200 transition-colors active:bg-slate-200">+</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {product.unit === 'meter' && (
                <div className="text-[10px] sm:text-[11px] text-amber-600 font-medium flex items-start gap-1 mt-2">
                  <span className="text-amber-500 shrink-0">⚠️</span>
                  <span>Caution: order Multiple of 10 Mtrs or 25 mtrs for all multicore</span>
                </div>
              )}

              {/* Dynamic Cost Projection */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total:</span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    ₹{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    ₹{gstLine.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Estimated Total (Incl. GST):</span>
                  <span className="text-amber-600 font-mono tabular-nums text-base font-black">
                    ₹{totalWithGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>



              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isInCart
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Updated in RFQ Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Quote Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleInstantQuote}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  <span>Request Quotation (RFQ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Direct Warehouse Dispatch from Bangalore</span>
                <button
                  onClick={() => setRfqOpen(true)}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Need Custom Project Cutting?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Description vs Technical Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm h-full">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Product Description & Highlights
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-8 font-medium">
                {product.application}
              </p>

              <div className="space-y-4">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm">
                    <div className="w-5 h-5 shrink-0 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 border border-amber-200">
                      <Check className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="leading-relaxed">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-6 shadow-sm h-full">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Technical Datasheet</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Conductor Design</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {product.conductor || "Fine-wire bare copper, Class 5"}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Nominal Voltage</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {product.voltage || "300 / 500 V"}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Operating Temp</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {product.tempRange || "-40°C to +80°C"}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Bending Radius</span>
                  <span className="text-slate-900 font-bold text-sm">
                    Flexing: 10x OD
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Flame Retardancy</span>
                  <span className="text-slate-900 font-bold text-sm">
                    IEC 60332-1-2
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1">
                  <span className="text-slate-400 font-mono block">Oil Resistance</span>
                  <span className="text-slate-900 font-bold text-sm">
                    DIN EN 50290-2-22
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RFQ Modal */}
        <RFQModal
          productName={`${product.name} (${product.partNo})`}
          isOpen={rfqOpen}
          onClose={() => setRfqOpen(false)}
        />

        {/* Fullscreen Image Zoom Modal (+/-) */}
        <ImageZoomModal
          isOpen={isZoomModalOpen}
          onClose={() => setIsZoomModalOpen(false)}
          imageSrc={selectedImg}
          altText={product.name}
          title={product.name}
          brand={product.brand}
          partNo={product.partNo}
        />
      </div>
    </div>
  );
};
