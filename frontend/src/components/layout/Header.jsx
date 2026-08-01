import React from 'react';
import { Search, Bell, Shield, User, Sparkles, Cpu } from 'lucide-react';

export default function Header({ currentScreen, onNavigate, renderEngine, onToggleEngine }) {
  return (
    <header className="h-16 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#00e5ff]/20 px-6 flex items-center justify-between font-mono select-none sticky top-0 z-50">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-[#00e5ff] font-bold text-base">
          <div className="p-1.5 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 glow-cyan">
            <Shield className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <span className="tracking-wider">SANDSHIELD AI</span>
        </div>
        <span className="text-gray-600">|</span>
        <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">
          GOVERNMENT COMMAND & CONTROL
        </span>
      </div>

      {/* Global Intelligence Search Bar */}
      <div className="hidden md:flex items-center w-96 relative text-xs">
        <Search className="w-4 h-4 text-gray-400 absolute left-3" />
        <input
          type="text"
          placeholder="Search coordinates, river basins, vehicle plates (TN52 AB4321)..."
          className="w-full bg-[#070d1e] border border-[#00e5ff]/20 focus:border-[#00e5ff] text-white pl-9 pr-4 py-1.5 rounded-lg outline-none transition-all placeholder-gray-500"
        />
      </div>

      {/* Right Actions & Officer Telemetry */}
      <div className="flex items-center space-x-4 text-xs">
        {/* Engine Render Switcher: Interactive React vs Stitch HTML */}
        <button
          onClick={onToggleEngine}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
            renderEngine === 'REACT'
              ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] glow-cyan'
              : 'bg-[#070d1e] text-emerald-400 border-emerald-500/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{renderEngine === 'REACT' ? 'INTERACTIVE REACT MODE' : 'STITCH HTML MODE'}</span>
        </button>

        {/* Real-Time Alert Bell Icon */}
        <div
          onClick={() => onNavigate('alerts')}
          className="relative p-2 rounded-lg bg-[#070d1e] border border-[#00e5ff]/20 text-gray-300 hover:text-[#00e5ff] cursor-pointer"
          title="View Incidents"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-black text-[9px] font-bold flex items-center justify-center animate-pulse">
            7
          </span>
        </div>

        {/* Officer Profile Badge */}
        <div className="flex items-center space-x-2 bg-[#070d1e] border border-[#00e5ff]/20 px-3 py-1 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff] text-[#00e5ff] flex items-center justify-center font-bold text-[10px]">
            RS
          </div>
          <div className="text-[11px]">
            <div className="font-bold text-white leading-tight">Inspector R. Sharma</div>
            <div className="text-[9px] text-gray-400">Enforcement Wing</div>
          </div>
        </div>
      </div>
    </header>
  );
}
