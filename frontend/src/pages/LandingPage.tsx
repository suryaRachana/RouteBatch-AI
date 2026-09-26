import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  Zap,
  Bot,
  MapPin,
  CheckCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  Globe,
  Layers,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Field Logistics Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              AI-Powered Route Optimization for{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300 bg-clip-text text-transparent">
                Field Workers
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
              Eliminate manual dispatch chaos. Sequence multi-stop field routes in seconds with 2-Opt spatial algorithms, real-time OpenStreetMap geocoding, and an interactive AI Route Assistant.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 text-base"
              >
                <span>Launch Field Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl transition text-base"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Paid API Keys Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Offline-Friendly Local Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Secure Backend Cookie Auth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Interactive Value Highlights */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Built for Speed, Distance Efficiency & Tactical Control
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything field logistics teams need to save fuel, hit deadlines, and eliminate route overlap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative group hover:border-sky-500/50 transition">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2-Opt Route Optimizer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Uses Haversine distance calculations combined with 2-Opt local search heuristics to eliminate crossing paths and reduce total drive distance by up to 35%.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative group hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Leaflet & Nominatim Mapping</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatic geocoding for any street address, custom numbered map markers, and interactive path polylines powered by OpenStreetMap tiles.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative group hover:border-amber-500/50 transition">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Dispatch Assistant</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask the AI assistant for priority callouts, deadline conflict checks, and tactical recommendations tailored to your exact task schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Field Worker Workflow Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-sky-400 text-xs font-bold uppercase tracking-wider">
                Hackathon Operational Architecture
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Designed for Field Operations on Mobile & Desktop
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Whether you are servicing 5 stops or 50, RouteBatch-AI guarantees offline task persistence via LocalStorage, so your field stops are safe even with unstable mobile connectivity.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg transition text-sm"
                >
                  Start Routing Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3 font-mono text-xs text-slate-300 shadow-2xl">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                <span>// RouteBatch-AI Optimization Pipeline</span>
                <span className="text-emerald-400">● Live</span>
              </div>
              <p><span className="text-sky-400">INPUT:</span> 4 Field Stops (High/Medium Priority)</p>
              <p><span className="text-indigo-400">GEOCODE:</span> Nominatim OSM API -&gt; [lat, lng]</p>
              <p><span className="text-amber-400">HAVERSINE:</span> Matrix Pairwise Distance Calculation</p>
              <p><span className="text-emerald-400">OPTIMIZER:</span> 2-Opt Swap Heuristic Applied</p>
              <p className="text-slate-400 pt-2 border-t border-slate-800">
                RESULT: 24.6 km total distance | 49 min est travel time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Polished Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300">RouteBatch-AI</span>
            <span>&copy; {new Date().getFullYear()} Field Logistics Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300 transition">Login</Link>
            <Link to="/register" className="hover:text-slate-300 transition">Register</Link>
            <Link to="/dashboard" className="hover:text-slate-300 transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
