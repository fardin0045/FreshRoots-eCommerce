// Hero.jsx — FreshRoots Grocery Hero Section
import { useState, useEffect } from 'react';
import hero from '../assets/hero1.png';
import {
  ArrowRight,
  ShoppingCart,
  Leaf,
  Clock,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

// ── Animated number counter ───────────────────────────────────────────────────
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ── Trust badge pill ──────────────────────────────────────────────────────────
const TrustBadge = ({ icon: Icon, label }) => (
  <div
    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
                  rounded-full px-4 py-2 text-white/90 text-xs font-medium"
  >
    <Icon className="w-3.5 h-3.5 text-green-400 shrink-0" />
    {label}
  </div>
);

// ── Real-time countdown hook ──────────────────────────────────────────────────
const useCountdown = (targetHour = 23, targetMinute = 59) => {
  const getSecondsLeft = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, targetMinute, 59, 0);
    // If target already passed today, aim for tomorrow
    if (target <= now) target.setDate(target.getDate() + 1);
    return Math.max(0, Math.floor((target - now) / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(getSecondsLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const s = String(secondsLeft % 60).padStart(2, '0');
  const expired = secondsLeft === 0;

  return { h, m, s, expired };
};

// ── Countdown digit block ─────────────────────────────────────────────────────
const DigitBlock = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span
      className="bg-gray-800 text-white text-sm font-black w-9 h-9
                     rounded-lg flex items-center justify-center tabular-nums
                     shadow-inner shadow-black/30"
    >
      {value}
    </span>
    <span className="text-[9px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
);

// ── Floating offer card ───────────────────────────────────────────────────────
const OfferCard = () => {
  const { h, m, s, expired } = useCountdown(23, 59);

  return (
    <div
      className="hidden lg:flex flex-col gap-1 absolute right-10 top-3/4 -translate-y-1/2
                    bg-white rounded-2xl shadow-2xl shadow-black/30 p-5 w-56
                    animate-[floatY_4s_ease-in-out_infinite]"
    >
      {/* Sticker */}
      <div
        className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-green-500
                      flex flex-col items-center justify-center shadow-lg"
      >
        <span className="text-white font-black text-lg leading-none">30</span>
        <span className="text-white/80 text-[9px] font-semibold leading-none">
          % OFF
        </span>
      </div>

      <p className="text-[10px] font-semibold text-green-600 uppercase tracking-widest">
        Today's Deal
      </p>
      <p className="text-sm font-bold text-gray-800 leading-snug">
        Organic Veggie Bundle
      </p>
      <p className="text-xs text-gray-500">
        Fresh seasonal picks, farm to door
      </p>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Claimed</span>
          <span className="text-green-600 font-semibold">74%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-[74%] bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
        </div>
      </div>

      {/* Live countdown */}
      <div className="mt-3">
        <div className="flex items-center gap-1 mb-2">
          <Clock className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {expired ? 'Deal Expired' : 'Ends today in'}
          </span>
        </div>
        {expired ? (
          <p className="text-xs text-red-500 font-semibold">
            This deal has ended.
          </p>
        ) : (
          <div className="flex items-end gap-1.5">
            <DigitBlock value={h} label="hrs" />
            <span className="text-gray-400 font-bold text-lg mb-2.5 leading-none">
              :
            </span>
            <DigitBlock value={m} label="min" />
            <span className="text-gray-400 font-bold text-lg mb-2.5 leading-none">
              :
            </span>
            <DigitBlock value={s} label="sec" />
          </div>
        )}
      </div>
      <Link to="/products">
        <button
          className="mt-3 w-full rounded-xl bg-green-500 hover:bg-green-600 text-white
                         text-xs font-bold py-2.5 transition-colors duration-200"
        >
          Grab Deal →
        </button>
      </Link>
    </div>
  );
};

// ── Main Hero ─────────────────────────────────────────────────────────────────
export const Hero = () => {
  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(-50%) translateY(0px); }
          50%       { transform: translateY(-50%) translateY(-12px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.6s ease both 0.1s; }
        .anim-2 { animation: fadeSlideUp 0.6s ease both 0.25s; }
        .anim-3 { animation: fadeSlideUp 0.6s ease both 0.4s; }
        .anim-4 { animation: fadeSlideUp 0.6s ease both 0.55s; }
        .anim-5 { animation: fadeSlideUp 0.6s ease both 0.7s; }
        .anim-6 { animation: fadeSlideUp 0.6s ease both 0.85s; }
      `}</style>

      <section
        className="relative h-[90vh] min-h-[600px] bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Layered overlay: dark base + green gradient from bottom */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Floating offer card */}
        <OfferCard />

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="anim-1 flex items-center gap-2 mb-5">
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold tracking-[0.25em] uppercase text-xs">
                Fresh • Organic • Delivered Daily
              </span>
            </div>

            {/* Headline */}
            <h1
              className="anim-2 text-4xl sm:text-5xl md:text-[64px] font-black
                           leading-[1.05] tracking-tight text-white"
            >
              Fresh Roots.
              <br />
              <span
                className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-500
                               bg-clip-text text-transparent"
              >
                Delivered Fast.
              </span>
            </h1>

            {/* Subtext */}
            <p className="anim-3 mt-5 text-base md:text-lg text-white/70 leading-relaxed max-w-lg">
              Fresh Groceries Delivered to Your Doorstep in Under 2 Hours
            </p>

            {/* CTA buttons */}
            <div className="anim-4 flex flex-wrap gap-3 mt-8">
              <Link to="/products">
                <Button
                  className="group rounded-xl bg-green-500 hover:bg-green-600
                                   px-7 py-6 text-white font-semibold text-sm
                                   shadow-lg shadow-green-900/40 transition-all duration-200"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Shop Now
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform duration-300
                                        group-hover:translate-x-1"
                  />
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  variant="outline"
                  className="rounded-xl border-white/25 bg-white/10 backdrop-blur-sm
                             text-white hover:bg-white hover:text-gray-900 px-7 py-6
                             font-semibold text-sm transition-all duration-200"
                >
                  Explore Products
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="anim-5 flex flex-wrap gap-2 mt-6">
              <TrustBadge icon={Leaf} label="100% Organic" />
              <TrustBadge icon={Clock} label="2-Hour Delivery" />
              <TrustBadge icon={Shield} label="Quality Guaranteed" />
            </div>
          </div>
        </div>

        {/* Stats bar — pinned to bottom */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="anim-6 grid grid-cols-3 divide-x divide-white/10
                            bg-black/40 backdrop-blur-md border-t border-white/10
                            rounded-t-2xl overflow-hidden"
            >
              {[
                { end: 15000, suffix: '+', label: 'Happy Customers' },
                { end: 500, suffix: '+', label: 'Fresh Products' },
                { end: 98, suffix: '%', label: 'On-Time Delivery' },
              ].map(({ end, suffix, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-5 px-4"
                >
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    <Counter end={end} suffix={suffix} />
                  </span>
                  <span className="text-white/50 text-xs mt-1 font-medium text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-28 right-6 hidden md:flex flex-col items-center gap-1
                        text-white/30 text-[10px] font-medium tracking-widest uppercase"
        >
          <span>Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>
    </>
  );
};
