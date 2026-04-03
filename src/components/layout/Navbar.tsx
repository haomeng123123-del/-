import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { menuConfig } from '../../config/menu';

const Navbar: React.FC = () => {
  const location = useLocation();

  // Helper to determine if a top-level menu is active
  const isActive = (path: string, id: string) => {
    if (id === 'overview') {
      return location.pathname === '/' || location.pathname.startsWith('/overview');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="glass-header h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-6 flex-1 overflow-hidden">
        <span className="text-xl font-black text-blue-900 font-headline tracking-tight whitespace-nowrap">智慧环卫监管中心</span>
        <div className="hidden md:flex gap-4 items-center overflow-x-auto scrollbar-hide flex-1 px-2">
          {menuConfig.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`text-sm whitespace-nowrap transition-colors py-5 ${
                isActive(item.path, item.id)
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-slate-600 hover:text-primary'
              }`}
              data-testid={`nav-menu-${item.id}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <div className="relative group hidden lg:block">
          <input
            className="bg-surface-container-low border-none rounded-full px-4 py-1.5 text-sm w-48 focus:ring-2 focus:ring-primary/20"
            placeholder="搜索..."
            type="text"
            data-testid="global-input-search"
          />
          <Search className="absolute right-3 top-1.5 w-4 h-4 text-slate-400" />
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600" data-testid="nav-btn-notifications">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary overflow-hidden border border-slate-200 shrink-0">
          <img
            alt="Admin"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnuNiDMTlwbTrafeA2Zl6g_-xcarpU04n8jpV0ddUwfp50k5FIFTc_Pr09QM9MFa0uYN83PIVBmW0mdM1jxEg0-AiA07DOElv0A2EAPI7RRLWE9ne4ha7mGjmSOrkeo80qdJnu1mDPtHsycLSnv-qHAhMQaj_hLBJmNGwmF9cdHXQ4MizL1yVL-F7HoXAMXbqS7NPlrd4Hnm-WLTQ6Yvoo9lRE0UsCPjFKqXiEcTP5SfnMOkj9dFb2qLU8xNnMdvLjXJjbuetxB9Y"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
