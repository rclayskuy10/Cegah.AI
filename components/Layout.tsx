import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Camera, MapPin, AlertTriangle, Menu, X, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Beranda', desc: 'Dashboard utama' },
    { path: '/risk', icon: MapPin, label: 'Peta Rawan', desc: 'Analisis risiko lokasi' },
    { path: '/report', icon: Camera, label: 'Lapor', desc: 'Lapor kerusakan' },
    { path: '/chat', icon: MessageSquare, label: 'CegahBot', desc: 'Asisten AI bencana' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col md:flex-row">
      
      {/* Header - Mobile */}
      <header className="md:hidden glass sticky top-0 z-50 border-b border-slate-200/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-xl shadow-lg shadow-red-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-800">Cegah<span className="gradient-text">.AI</span></h1>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">IDCamp 2025 Challenge</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {sidebarOpen && (
          <div className="animate-fade-in border-t border-slate-100 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <span className="font-semibold text-sm">{item.label}</span>
                    <p className="text-[10px] opacity-60">{item.desc}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 glass-dark text-white sticky top-0 h-screen border-r border-white/5">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-1">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Cegah.AI</h1>
              <p className="text-[11px] text-slate-400 font-medium">IDCamp 2025 Challenge</p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-red-500/20' : 'group-hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm">{item.label}</span>
                  <p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-soft"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 mb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-[11px] text-slate-400 font-medium">Dibuat oleh</p>
            <p className="text-sm font-bold text-white mt-0.5">Kak Riski Pratama</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:h-screen custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 w-full glass border-t border-slate-200/50 z-50">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-red-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-red-50 scale-110' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-red-600' : ''}`}>{item.label}</span>
                {isActive && <div className="w-4 h-0.5 rounded-full bg-red-500 mt-1"></div>}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;