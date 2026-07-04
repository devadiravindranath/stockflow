import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full glass-panel shadow-glass rounded-2xl p-8 border border-slate-200/50 text-center transform transition duration-500 hover:scale-[1.02]">
        
        {/* Logo/Icon placeholder */}
        <div className="mx-auto w-16 h-16 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          StockFlow <span className="text-brand-600">MVP</span>
        </h1>
        <p className="text-slate-500 mb-6 font-medium">
          SaaS Inventory Management System
        </p>

        <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200/40 text-left inline-block w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Status</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">Tailwind CSS Configured</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tailwind CSS, PostCSS, and Autoprefixer configured successfully. Custom branding color palette and premium layout classes verified.
          </p>
        </div>

        <div className="mt-8 text-xs text-slate-400">
          Ready for database initialization
        </div>
      </div>
    </div>
  );
}

export default Home;
