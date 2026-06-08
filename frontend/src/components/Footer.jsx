
import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/freshroots.png';
import { FacebookLogoIcon, InstagramLogoIcon, TwitterLogoIcon } from '@phosphor-icons/react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="FreshRoots"
              className="h-16rounded-lg p-2"
            />

            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              FreshRoots brings farm-fresh vegetables, organic fruits,
              groceries, and healthy essentials directly to your doorstep.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-green-600 transition"
              >
                <FacebookLogoIcon size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-green-600 transition"
              >
                <InstagramLogoIcon size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-green-600 transition"
              >
                <TwitterLogoIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Products
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Categories
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Categories
            </h3>

            <ul className="space-y-3">
              <li>Fresh Vegetables</li>
              <li>Organic Fruits</li>
              <li>Rice & Grains</li>
              <li>Fish & Meat</li>
              <li>Honey & Dates</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-green-500 mt-1" />
                <span>Tangail, Bangladesh</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" />
                <span>+880 1234-567890</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-500" />
                <span>support@freshroots.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 FreshRoots. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-green-400">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-green-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
