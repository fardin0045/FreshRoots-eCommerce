import hero from '../assets/hero.png';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const Hero = () => {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${hero})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center">
        <div className="max-w-xl  rounded-3xl p-8 md:p-12 ">
          <p className="text-green-400 font-medium tracking-[0.2em] uppercase text-sm">
            Fresh • Organic • Healthy
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight text-white/95">
            Fresh Choices,
            <br />
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
              Stronger Roots
            </span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-gray-200/80 leading-relaxed">
            Discover farm-fresh vegetables, organic fruits and healthy groceries
            delivered straight to your doorstep with quality you can trust.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button className="group rounded-xl bg-green-600 hover:bg-green-700 px-7 py-6 text-white">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black px-7 py-6"
            >
              Explore Products
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Offer Card */}
    </section>
  );
};
