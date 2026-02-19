import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Camera, MapPin, AlertTriangle, Menu, X, Shield, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', icon: Home, label: 'Beranda', desc: 'Dashboard utama' },
    { path: '/risk', icon: MapPin, label: 'Peta Rawan', desc: 'Analisis risiko lokasi' },
    { path: '/report', icon: Camera, label: 'Lapor', desc: 'Lapor kerusakan' },
    { path: '/checklist', icon: Package, label: 'Tas Siaga', desc: 'Persiapan darurat' },
    { path: '/chat', icon: MessageSquare, label: 'CegahBot', desc: 'Asisten AI bencana' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col md:flex-row">
      
      {/* Collapsible Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col glass-dark text-white sticky top-0 h-screen border-r border-white/5 transition-all duration-300 ease-in-out relative overflow-hidden ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className={`p-4 transition-all duration-300 ${
          sidebarOpen ? '' : 'px-2'
        }`}>
          <div className={`flex items-center justify-between mb-1 transition-all duration-300`}>
            <div className={`flex items-center transition-all duration-300 ${
              sidebarOpen ? 'space-x-3' : 'justify-center w-full'
            }`}>
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30 flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${
                sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
              }`}>
                <h1 className="text-xl font-black tracking-tight whitespace-nowrap">Cegah.AI</h1>
                <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">IDCamp 2025</p>
              </div>
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 transition-all flex-shrink-0 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full mt-2 p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 transition-all flex items-center justify-center hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className={`px-4 mb-2 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0'
        }`}>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>
        
        <nav className={`flex-1 py-2 space-y-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${
          sidebarOpen ? 'px-2' : 'px-1'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-300 group relative ${
                  sidebarOpen ? 'px-3 py-3.5 space-x-3' : 'px-2 py-3 justify-center'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  isActive ? 'bg-red-500/20' : 'group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`flex-1 transition-all duration-300 overflow-hidden ${
                  sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                }`}>
                  <span className="font-semibold text-sm block whitespace-nowrap">{item.label}</span>
                  <p className={`text-[10px] block whitespace-nowrap ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}>{item.desc}</p>
                </div>
                {sidebarOpen && isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-soft flex-shrink-0"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className={`px-4 mb-2 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0'
        }`}>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        <div className={`p-4 space-y-3 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'
        }`}>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Dibuat oleh</p>
            <p className="text-sm font-bold text-white mt-0.5 whitespace-nowrap">Riski Pratama</p>
          </div>
        </div>
      </aside>
      
      {/* Header - Mobile */}
      <header className="md:hidden glass sticky top-0 z-40 border-b border-slate-200/50">
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
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-72 glass-dark text-white z-50 transform transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">Cegah.AI</h1>
                  <p className="text-[10px] text-slate-400 font-medium">IDCamp 2025</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-red-500/20' : 'hover:bg-white/10'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-soft"></div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">Dibuat oleh</p>
              <p className="text-sm font-bold text-white mt-0.5">Riski Pratama</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 custom-scrollbar">
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