import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/40">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">StockFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors shadow-lg shadow-brand-500/30"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          Inventory Management — Simplified
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight max-w-3xl">
          Take control of your{' '}
          <span className="text-brand-400">stock</span>,{' '}
          effortlessly.
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          StockFlow gives your team a single place to track products, manage inventory movements, and stay ahead of low stock — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/signup"
            className="px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-base shadow-xl shadow-brand-500/30 transition-all hover:scale-105"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base border border-white/10 transition-all hover:scale-105 backdrop-blur-sm"
          >
            Sign in to your account
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {['Product Catalog', 'Stock Movements', 'Low Stock Alerts', 'Organization Settings', 'Secure JWT Auth'].map((feat) => (
            <span
              key={feat}
              className="px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-sm rounded-full"
            >
              {feat}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-sm">
        © {new Date().getFullYear()} StockFlow. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
