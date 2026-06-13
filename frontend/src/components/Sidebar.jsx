import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  ShoppingCart,
  Leaf,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard/sales',
    icon: LayoutDashboard,
  },
  {
    name: 'Add Product',
    path: '/dashboard/add-product',
    icon: PlusCircle,
  },
  {
    name: 'Products',
    path: '/dashboard/products',
    icon: Package,
  },
  {
    name: 'Users',
    path: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Orders',
    path: '/dashboard/orders',
    icon: ShoppingCart,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-2 rounded-xl shadow-md">
            <Leaf className="text-white" size={22} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-green-700">
              FreshRoots
            </h1>
            <p className="text-xs text-gray-500">
              Admin Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden"
        >
          <X size={22} />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 px-3">
          Main Menu
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                <Icon
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Section */}
      {/* <div className="border-t border-green-100 p-4">
        <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-3">
          <img
            src="https://i.pravatar.cc/150"
            alt="Admin"
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              Admin User
            </h3>

            <p className="text-xs text-gray-500">
              Store Manager
            </p>
          </div>
        </div>

        <button className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 py-2 text-red-500 hover:bg-red-50 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div> */}
    </>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-green-100 shadow-sm">
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={22} />
            <span className="font-bold text-green-700">
              FreshRoots
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-screen w-[280px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-green-100 shadow-xl flex-col z-40">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;