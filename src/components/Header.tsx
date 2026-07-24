import React from 'react';
import { Terminal, Layout, FileText, CheckCircle2, Phone, Mail, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'portfolio' | 'api-explorer' | 'architecture';
  setActiveTab: (tab: 'portfolio' | 'api-explorer' | 'architecture') => void;
  apiStatus: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, apiStatus }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-neutral-800 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <a href="#home" onClick={() => setActiveTab('portfolio')} className="flex items-center gap-3 group">
            <img
              src="https://i.ibb.co/1GtSWCf3/logo-art-sneyder.png"
              alt="Art Sneyder Logo"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-white text-base tracking-wide">Art Sneyder</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  REST API v1
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">Sneyder Riaño Hernández</p>
            </div>
          </a>
        </div>

        {/* View / Tab Switcher */}
        <nav className="flex items-center bg-neutral-900/80 p-1 rounded-full border border-neutral-800">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'portfolio'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span className="hidden md:inline">Portafolio UI</span>
            <span className="md:hidden">UI</span>
          </button>

          <button
            onClick={() => setActiveTab('api-explorer')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'api-explorer'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">API Explorer (/api/v1)</span>
            <span className="md:hidden">API</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Arquitectura</span>
            <span className="md:hidden">Docs</span>
          </button>
        </nav>

        {/* Quick Contact & API Status */}
        <div className="hidden xl:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] text-emerald-400 font-medium">API 200 OK</span>
          </div>

          <a
            href="mailto:bogofija@gmail.com"
            className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors"
            title="Correo Oficial"
          >
            <Mail className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono">bogofija@gmail.com</span>
          </a>

          <a
            href="https://api.whatsapp.com/send?phone=573118113811"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 transition-colors"
            title="WhatsApp Directo"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono">3118113811</span>
          </a>
        </div>

      </div>
    </header>
  );
};
