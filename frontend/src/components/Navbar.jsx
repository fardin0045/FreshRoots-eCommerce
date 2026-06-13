// Navbar.jsx — FreshRoots | Fully Responsive + Search + Profile Avatar
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/freshroots.png';
import {
  ShoppingCart, Menu, X, Search, Heart,
  LayoutDashboard, Package, Home, ChevronDown,
  LogOut, User, Settings
} from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { useState, useRef, useEffect } from 'react';

// ── Avatar: profile pic or initials fallback ──────────────────────────────────
const Avatar = ({ user, size = 'sm' }) => {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  if (user?.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt={user.firstName}
        className={`${dim} rounded-full object-cover ring-2 ring-green-400 ring-offset-1`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-green-400 to-emerald-600
                     flex items-center justify-center font-bold text-white
                     ring-2 ring-green-400 ring-offset-1`}>
      {initials}
    </div>
  );
};

// ── Search bar ────────────────────────────────────────────────────────────────
const SearchBar = ({ className = '', onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search vegetables, fruits…"
        className="w-full pl-9 pr-10 py-2 rounded-full bg-gray-100 border border-transparent
                   text-sm text-gray-700 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white
                   transition-all duration-200"
      />
      {query && (
        <button type="button" onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
};

// ── Nav link with active state ────────────────────────────────────────────────
const NavLink = ({ to, icon: Icon, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 px-1 py-0.5
                  border-b-2 ${active
                    ? 'text-green-600 border-green-500'
                    : 'text-gray-600 hover:text-green-600 border-transparent'
                  }`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
export const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const isAdmin = user?.role === 'admin';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // mobile search
  const profileRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/users/logout`, {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        setProfileOpen(false);
        setMobileOpen(false);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const cartCount = cart.items?.length || 0;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md
                         border-b border-gray-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Logo ── */}
            <Link to="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
              <img src={logo} alt="FreshRoots" className="h-11 w-auto object-contain" />
            </Link>

            {/* ── Desktop Search (center) ── */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <SearchBar />
            </div>

            {/* ── Desktop Nav links ── */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/products" icon={Package}>Products</NavLink>
              <NavLink to="/my-order">Orders</NavLink>
              {isAdmin && <NavLink to="/dashboard/sales" icon={LayoutDashboard}>Dashboard</NavLink>}
            </nav>

            {/* ── Right cluster ── */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist"
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition text-gray-600 relative"
                aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link to="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white
                                   text-[10px] font-bold min-w-[18px] h-[18px] rounded-full
                                   flex items-center justify-center leading-none px-0.5">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown (desktop) / Login button */}
              {user ? (
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full
                               hover:bg-gray-100 transition-all duration-150"
                    aria-expanded={profileOpen}
                  >
                    <Avatar user={user} />
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200
                                            ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl
                                    shadow-xl shadow-black/10 border border-gray-100
                                    overflow-hidden z-50 py-1">
                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                        <Avatar user={user} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <Link to={`/profile/${user._id}`} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 hover:text-green-600 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>

                      <Link to="/my-order" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 hover:text-green-600 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>

                      <Link to="/wishlist" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 hover:text-green-600 transition-colors">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>

                      {isAdmin && (
                        <Link to="/dashboard/sales" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                     hover:bg-gray-50 hover:text-green-600 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}

                      

                      <div className="border-t border-gray-100 mt-1">
                        <button onClick={logoutHandler}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm
                                     text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex bg-green-600 hover:bg-green-700 text-white
                             rounded-full px-5 text-sm font-medium h-9"
                >
                  Login
                </Button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Mobile search bar (expands below header) ── */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <SearchBar onSearch={() => setSearchOpen(false)} className="w-full" />
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl
                       flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden
                       ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src={logo} alt="FreshRoots" className="h-9 w-auto" />
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border-b border-green-100">
            <Avatar user={user} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {[
            { to: '/', icon: Home, label: 'Home' },
            { to: '/products', icon: Package, label: 'Products' },
            { to: '/my-order', icon: Package, label: 'My Orders' },
            { to: '/wishlist', icon: Heart, label: 'Wishlist' },
            ...(user ? [{ to: `/profile/${user._id}`, icon: User, label: 'My Profile' }] : []),
            ...(isAdmin ? [{ to: '/dashboard/sales', icon: LayoutDashboard, label: 'Dashboard' }] : []),
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                         text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom: Login or Logout */}
        <div className="px-4 py-5 border-t border-gray-100">
          {user ? (
            <button onClick={logoutHandler}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                         bg-red-50 text-red-500 text-sm font-semibold
                         hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <Button onClick={() => { navigate('/login'); setMobileOpen(false); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3">
              Login
            </Button>
          )}
        </div>
      </div>
    </>
  );
};