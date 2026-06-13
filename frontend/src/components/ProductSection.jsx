// components/ProductSection.jsx
import { useState, useRef } from "react";
import ProductCard from "@/pages/ProductCard";

const LeafIcon = () => (
  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-4 8-2 8-2C19 3 17 8 17 8z" />
  </svg>
);

const SectionTitle = ({ title }) => (
  <div className="w-full mb-12 flex justify-center">
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Top decorative line */}
      <div className="w-full flex items-center justify-center mb-3">
        <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-80 rounded-full" />
        <div className="mx-6 flex items-center gap-3">
          <div className="w-20 h-1 bg-gradient-to-r from-green-300 to-green-600 rounded-full shadow-lg" />
          <LeafIcon />
          <div className="w-20 h-1 bg-gradient-to-l from-green-300 to-green-600 rounded-full shadow-lg" />
        </div>
        <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-green-200 to-transparent opacity-80 rounded-full" />
      </div>

      {/* Title centered */}
      <div className="relative px-6 py-2 text-center">
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-green-50 to-white rounded-full -z-10 mx-4 opacity-90 shadow-inner" />
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-500">Curated picks just for you</p>
      </div>

      {/* Bottom decorative line */}
      <div className="w-full flex items-center justify-center mt-4">
        <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-80 rounded-full" />
        <div className="mx-6 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-md" />
          <div className="w-4 h-2 rounded-full bg-green-500 shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-md" />
        </div>
        <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-green-200 to-transparent opacity-80 rounded-full" />
      </div>
    </div>
  </div>
);

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const ProductSection = ({ title, products = [], loading, sectionIndex, useCarousel = false }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef(null);
  const carouselRef = useRef(null);

  // If parent passes an index, only render the first 4 sections (0..3)
  if (typeof sectionIndex === "number" && sectionIndex >= 4) return null;
  if (!products.length) return null;

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, products.length));
    setTimeout(() => {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <section className="mb-24 px-2">
      <SectionTitle title={title} />

      {/* Products - grid or carousel */}
      {useCarousel ? (
        <div className="relative">
          <button
            aria-label="scroll-left"
            onClick={() => carouselRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-green-50"
          >
            ‹
          </button>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto no-scrollbar py-4 px-6 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayedProducts.map((product, index) => (
              <div
                key={product._id}
                ref={index === displayedProducts.length - 1 ? loadMoreRef : null}
                className="min-w-[280px] max-w-[320px] flex-shrink-0 scroll-mx-4 scroll-snap-align-start animate-fadeIn"
                style={{ animationDelay: `${(index % LOAD_MORE_COUNT) * 60}ms` }}
              >
                <ProductCard product={product} loading={loading} />
              </div>
            ))}
          </div>

          <button
            aria-label="scroll-right"
            onClick={() => carouselRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-green-50"
          >
            ›
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedProducts.map((product, index) => (
            <div
              key={product._id}
              ref={index === displayedProducts.length - 1 ? loadMoreRef : null}
              className="animate-fadeIn"
              style={{ animationDelay: `${(index % LOAD_MORE_COUNT) * 60}ms` }}
            >
              <ProductCard product={product} loading={loading} />
            </div>
          ))}
        </div>
      )}

      {/* Load More / Show Less */}
      {products.length > INITIAL_COUNT && (
        <div className="flex flex-col items-center gap-2 mt-10">
          {hasMore ? (
            <>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Showing{" "}
                <span className="text-green-600 font-semibold">{displayedProducts.length}</span>
                {" "}of{" "}
                <span className="text-gray-600 font-semibold">{products.length}</span>{" "}
                products
              </p>

              {/* Progress bar */}
              <div className="w-56 h-2 bg-gray-100 rounded-full overflow-hidden shadow-sm">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(displayedProducts.length / products.length) * 100}%` }}
                />
              </div>

              <button
                onClick={handleLoadMore}
                className="mt-3 group relative inline-flex items-center gap-2 px-7 py-2.5 rounded-full border-2 border-green-500 text-green-600 font-semibold text-sm overflow-hidden transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-green-100"
              >
                <span className="absolute inset-0 bg-green-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
                <span className="relative z-10 flex items-center gap-2">
                  Load {Math.min(LOAD_MORE_COUNT, products.length - visibleCount)} More
                  <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setVisibleCount(INITIAL_COUNT)}
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 text-gray-500 font-medium text-sm hover:border-green-400 hover:text-green-600 transition-all duration-200"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Show Less
            </button>
          )}
        </div>
      )}

      {/* Section bottom divider */}
      <div className="mt-14 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="w-1 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease both; }
        /* hide native scrollbar for modern browsers */
        .no-scrollbar::-webkit-scrollbar { height: 8px; }
        .no-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(59,130,246,0.4) transparent; }
      `}</style>
    </section>
  );
};

export default ProductSection;