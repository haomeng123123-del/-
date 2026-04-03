import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { menuConfig } from '../../config/menu';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Find the active top-level menu based on the current path
  const activeTopMenu = useMemo(() => {
    // Check specific paths first
    const matchedMenu = menuConfig.find(menu => 
      menu.id !== 'overview' && location.pathname.startsWith(menu.path)
    );
    // Fallback to overview if nothing else matches
    return matchedMenu || menuConfig.find(menu => menu.id === 'overview');
  }, [location.pathname]);

  if (!activeTopMenu) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col pt-4 bg-slate-50 border-r border-slate-200 z-40 overflow-y-auto">
      <div className="px-6 mb-4">
        <h2 className="text-blue-800 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <activeTopMenu.icon className="w-4 h-4" />
          {activeTopMenu.name}
        </h2>
      </div>
      <nav className="flex-1 space-y-1 pb-4">
        {activeTopMenu.children.map((item) => {
          // Exact match for root paths, startsWith for others
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== activeTopMenu.path);
            
          // If it's the default path for the module, check if we're exactly on it
          const isDefaultActive = item.path === activeTopMenu.path && location.pathname === activeTopMenu.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-link",
                (isActive || isDefaultActive) && "sidebar-link-active"
              )}
              data-testid={`sidebar-menu-${item.name}`}
            >
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
