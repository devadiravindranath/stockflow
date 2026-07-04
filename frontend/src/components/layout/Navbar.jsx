import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ setIsSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button */}
        <button
          type="button"
          className="text-slate-500 hover:text-slate-700 lg:hidden focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        {/* Search or title placeholder (empty for now, keeps layout balanced) */}
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex items-center lg:hidden">
             {/* Logo on mobile maybe? */}
          </div>
        </div>

        {/* Right side icons / profile */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.name}
          </span>
          
          <div className="relative">
            <button
              onClick={logout}
              className="flex items-center justify-center h-9 px-4 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
