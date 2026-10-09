import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, FileText, Settings, Menu, X, LogOut, Bell, Search } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isMob = window.innerWidth < 1024;
      setIsMobile(isMob);
      if (!isMob) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const currentAdminStr = localStorage.getItem('siddhi_admin_user');
  const currentAdmin = currentAdminStr ? JSON.parse(currentAdminStr) : null;
  const isAdmin = currentAdmin?.role === 'Admin' || currentAdmin?.role === 'Super Admin';

  if (!currentAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('siddhi_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'RFQs (Quotations)', path: '/admin/rfqs', icon: FileText },
    ...(isAdmin ? [{ name: 'Users', path: '/admin/users', icon: Users }] : []),
  ];

  const sidebarWidth = sidebarOpen ? 'w-72' : 'w-20';
  const sidebarTranslate = isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0';
  const mainMargin = isMobile ? 'ml-0' : (sidebarOpen ? 'ml-72' : 'ml-20');

  return (
    <div className="min-h-screen w-full bg-slate-50 flex font-sans overflow-hidden selection:bg-amber-500 selection:text-white">
      
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium 2026 Light Orange Theme */}
      <aside className={`bg-orange-50/90 backdrop-blur-xl border-r border-orange-200/50 transition-all duration-300 ease-in-out ${sidebarWidth} ${sidebarTranslate} flex flex-col fixed inset-y-0 left-0 h-full z-50 shadow-[4px_0_24px_rgba(249,115,22,0.05)]`}>
        {/* Subtle ambient lighting inside sidebar */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
        
        <div className="h-20 flex items-center justify-between px-5 border-b border-orange-200/50 relative z-10 shrink-0">
          {(sidebarOpen || isMobile) ? (
             <img 
               src="/images/siddhi-kabel-lockup.png" 
               alt="Siddhi Kabel" 
               className="h-8 sm:h-9 object-contain drop-shadow-sm" 
               onError={(e) => { e.currentTarget.src = '/images/siddhi-kabel-logo.png'; }}
             />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg mx-auto">
              S
            </div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isMobile ? <X size={20} /> : (sidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />)}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 relative z-10 custom-scrollbar">
          <div className={`mb-6 px-2 text-xs font-bold tracking-widest text-slate-400 uppercase ${( !sidebarOpen && !isMobile ) && 'hidden'}`}>
            Overview
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden ${isActive ? 'text-orange-950 bg-white shadow-[0_2px_10px_rgba(249,115,22,0.1)] border border-orange-200/60' : 'text-orange-900/70 hover:text-orange-950 hover:bg-orange-100/50 border border-transparent'}`}
              >
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                )}
                <Icon size={22} className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-orange-600' : 'text-orange-400 group-hover:scale-110 group-hover:text-orange-600'}`} />
                {(sidebarOpen || isMobile) && <span className={`ml-4 font-semibold text-sm relative z-10 tracking-wide ${isActive ? 'text-orange-950' : ''}`}>{item.name}</span>}
              </Link>
            );
          })}
        </div>
        
        <div className="p-5 border-t border-orange-200/50 bg-orange-100/30 backdrop-blur-md relative z-10 shrink-0">
          <button onClick={handleLogout} className={`flex items-center w-full px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden hover:bg-red-50 border border-transparent hover:border-red-100 ${isMobile || sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <LogOut size={22} className="text-orange-900/50 group-hover:text-red-500 group-hover:scale-110 transition-transform duration-300" />
            {(sidebarOpen || isMobile) && <span className="ml-4 font-semibold text-sm text-orange-900/60 group-hover:text-red-600 tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out relative w-full ${mainMargin}`}>
        
        {/* Dynamic Abstract Background (Premium 2026 Mesh Gradient) */}
        <div className="fixed inset-0 bg-[#f8fafc] z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-gradient-to-br from-amber-400/30 to-rose-400/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse duration-[10s]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-blue-500/20 to-violet-500/20 rounded-full blur-[120px] mix-blend-multiply" />
           <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-emerald-400/10 rounded-full blur-[90px] mix-blend-multiply" />
        </div>

        {/* Top Header */}
        <header className="h-16 sm:h-20 bg-white/40 backdrop-blur-3xl border-b border-white/60 flex items-center justify-between px-4 sm:px-8 lg:px-12 z-20 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)] shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight truncate">
              {navItems.find(i => i.path === location.pathname)?.name || 'Admin Portal'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2.5 border border-slate-200 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all w-64 shadow-inner">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search records..." className="bg-transparent border-none outline-none text-sm ml-3 w-full font-medium placeholder-slate-400 text-slate-700" />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="h-6 sm:h-8 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center space-x-3 cursor-pointer group relative">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-amber-600 transition-colors">{currentAdmin.name}</span>
                <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{currentAdmin.role}</span>
              </div>
              <div className="relative" tabIndex={0} onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  // handle close if needed, but we can just use group-focus-within
                }
              }}>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
                  {currentAdmin.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                
                {/* Profile Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                  <div className="p-3 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800">{currentAdmin.name}</p>
                    <p className="text-xs font-medium text-slate-500">{currentAdmin.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                      Profile Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-3 py-2 mt-1 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 lg:p-12 flex-1 overflow-x-hidden overflow-y-auto z-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
