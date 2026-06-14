// HomepageSections.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/pages/ProductCard";

const GRID_LIMIT = 5;      // ≤ this → plain grid
const MAX_SECTIONS = 4;    // max sections shown
const CARDS_PER_SLIDE = 5; // cards visible at once in carousel
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

// ── Decorative Section Title ──────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <div className="flex flex-col items-center mb-10">
    <div className="flex items-center w-full max-w-lg mb-4 gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-green-500" />
      <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0l1.6 5.6H16l-5 3.5 1.9 5.9L8 11.4l-4.9 3.6 1.9-5.9-5-3.5h6.4z" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-300 to-green-500" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight text-center">
      {title}
    </h2>
    <div className="flex items-center w-full max-w-lg mt-4 gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-green-500" />
      <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0l1.6 5.6H16l-5 3.5 1.9 5.9L8 11.4l-4.9 3.6 1.9-5.9-5-3.5h6.4z" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-300 to-green-500" />
    </div>
  </div>
);

// ── Arrow Button ──────────────────────────────────────────────────────────────
const ArrowBtn = ({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === "prev" ? "Previous" : "Next"}
    className={`
      w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0
      transition-all duration-200
      ${disabled
        ? "border-gray-200 text-gray-300 cursor-not-allowed"
        : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white hover:shadow-md hover:shadow-green-200"
      }
    `}
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);

// ── Carousel (> 6 products) ───────────────────────────────────────────────────
const ProductCarousel = ({ products }) => {
  const [page, setPage] = useState(0);
  const trackRef = useRef(null);

  const totalPages = Math.ceil(products.length / CARDS_PER_SLIDE);
  const start = page * CARDS_PER_SLIDE;
  const visible = products.slice(start, start + CARDS_PER_SLIDE);

  // Pad last page so grid doesn't collapse
  const padded = [...visible];
  while (padded.length < CARDS_PER_SLIDE) padded.push(null);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div>
      {/* Track */}
      <div
        ref={trackRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 transition-all duration-300"
      >
        {padded.map((product, i) =>
          product ? (
            <ProductCard key={product._id} product={product} loading={false} />
          ) : (
            <div key={`pad-${i}`} className="invisible" />
          )
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <ArrowBtn direction="prev" onClick={prev} disabled={page === 0} />

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? "w-6 h-2.5 bg-green-500"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-green-300"
              }`}
            />
          ))}
        </div>

        <ArrowBtn direction="next" onClick={next} disabled={page === totalPages - 1} />
      </div>

      {/* Page label */}
      <p className="text-center text-xs text-gray-400 mt-3 font-medium">
        Showing {start + 1}–{Math.min(start + CARDS_PER_SLIDE, products.length)} of {products.length}
      </p>
    </div>
  );
};

// ── Static Grid (≤ 6 products) ────────────────────────────────────────────────
const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} loading={false} />
    ))}
  </div>
);

// ── Section wrapper ───────────────────────────────────────────────────────────
const ProductSection = ({ title, products }) => (
  <section className="mb-20">
    <SectionHeader title={title} />
    {products.length > GRID_LIMIT
      ? <ProductCarousel products={products} />
      : <ProductGrid products={products} />
    }
  </section>
);

// ── Main Component ────────────────────────────────────────────────────────────
const HomepageSections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/products/getAllProducts`,
          {
            params: { t: Date.now() },
            headers: { 'Cache-Control': 'no-cache' },
          },
        );
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groupedSections = Object.entries(
    products.reduce((acc, product) => {
      const key = product.section || "Featured Products";
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {})
  ).slice(0, MAX_SECTIONS);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading products…</p>
      </div>
    );
  }

  if (!groupedSections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
        <p className="text-lg font-medium">No products available right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {groupedSections.map(([section, items]) => (
        <ProductSection key={section} title={section} products={items} />
      ))}
    </div>
  );
};

export default HomepageSections;
