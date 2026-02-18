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
    { path: '/chat', icon: MessageSquare, label: 'SiagaBot' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
      
      {/* Header */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Cegah.AI</h1>
        </div>
        <div className="text-xs font-medium bg-red-700 px-2 py-1 rounded">
            IDCamp Challenge
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center py-2 px-1 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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