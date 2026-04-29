import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ocean-950 text-white" style={{ background: '#0a1929' }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-ocean-900/80 backdrop-blur border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <FiMenu className="w-5 h-5" />
            </button>
            {title && <h1 className="font-display font-bold text-lg text-white hidden sm:block">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-aqua-400 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-aqua-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name[0].toUpperCase()}
              </div>
              <span className="text-sm text-white/70 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
