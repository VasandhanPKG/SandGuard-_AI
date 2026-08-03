import React from 'react';
import { Search, Bell, Shield, User, Sparkles, Cpu } from 'lucide-react';

export default function Header({ currentScreen, onNavigate, renderEngine, onToggleEngine }) {
  return (
    <header className="h-16 bg-[#2d2418]/95 backdrop-blur-md border-b border-[#d9a441]/20 px-6 flex items-center justify-between font-mono select-none sticky top-0 z-50">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-[#d9a441] font-bold text-base animate-float">
          <div className="p-1.5 rounded-lg bg-[#d9a441]/10 border border-[#d9a441]/30 glow-sand shadow-lg">
            <Shield className="w-5 h-5 text-[#d9a441]" />
          </div>
          <span className="tracking-wider text-glow">SAND GUARD</span>
        </div>
        <span className="text-gray-500">|</span>
        <span className="text-xs text-[#b9b1a7] uppercase tracking-widest font-semibold">
          GOVERNMENT COMMAND & CONTROL
        </span>
      </div>

      {/* Global Intelligence Search Bar */}
      <div className="hidden md:flex items-center w-96 relative text-xs">
          <Search className="w-4 h-4 text-[#b9b1a7] absolute left-3" />
          <input
            type="text"
            placeholder="Search coordinates, river basins, vehicle plates (TN52 AB4321)..."
            className="w-full bg-[#1e1810] border border-[#d9a441]/20 focus:border-[#d9a441] text-[var(--text-primary)] pl-9 pr-4 py-1.5 rounded-2xl outline-none transition-all duration-300 shadow-inner shadow-[#d9a441]/10 placeholder-[#b9b1a7]"
          />
      </div>

      {/* Right Notification Icon Only */}
      <div className="flex items-center text-xs">
        <div
          onClick={() => onNavigate('alerts')}
          className="relative p-2 rounded-2xl bg-[#1b1610] border border-[#d9a441]/20 text-[#b9b1a7] hover:text-[#d9a441] cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#d9a441]/10"
          title="View Incidents"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-black text-[9px] font-bold flex items-center justify-center animate-pulse">
            7
          </span>
        </div>
      </div>
    </header>
  );
}
