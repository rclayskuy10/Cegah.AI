import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Camera, MapPin, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Beranda' },
    { path: '/risk', icon: MapPin, label: 'Peta Rawan' },
    { path: '/report', icon: Camera, label: 'Lapor' },
    { path: '/chat', icon: MessageSquare, label: 'CegahBot' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Header - Mobile */}
      <header className="md:hidden bg-red-600 text-white p-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Cegah.AI</h1>
        </div>
        <div className="text-xs font-medium bg-red-700 px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
            IDCamp 2025 Challenge
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-red-600 text-white shadow-lg sticky top-0 h-screen">
        <div className="p-6 border-b border-red-700">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Cegah.AI</h1>
              <p className="text-xs text-red-100">IDCamp 2025</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-red-700 text-white' 
                    : 'text-red-100 hover:bg-red-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-700 text-xs text-red-100">
          <p>Dibuat oleh Kak Riski Pratama</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 px-1 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full py-1 transition-colors duration-200 ${
                isActive ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;