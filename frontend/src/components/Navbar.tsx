import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Route, LogOut, User as UserIcon, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Navigation className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            RouteBatch<span className="text-sky-400">.AI</span>
          </span>
        </Link>

        {/* Auth / Navigation Controls */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Route className="w-4 h-4 text-sky-400" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs sm:text-sm">
                <UserIcon className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-lg shadow-sky-600/25 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
