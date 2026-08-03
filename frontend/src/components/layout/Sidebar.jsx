import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Video,
  Truck,
  TrendingUp,
  ShieldCheck,
  AlertOctagon,
  FileText,
  Smartphone,
  LogOut,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export default function Sidebar({ currentScreen, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, num: '02' },
    { id: 'gis', label: 'GIS Monitoring', icon: Layers, num: '03' },
    { id: 'satellite', label: 'Satellite Intelligence', icon: Globe, num: '04' },
    { id: 'drone', label: 'Drone Verification', icon: Video, num: '05' },
    { id: 'vehicle', label: 'Vehicle Analytics', icon: Truck, num: '06' },
    { id: 'prediction', label: 'AI Prediction', icon: TrendingUp, num: '07' },
    { id: 'xai', label: 'AI Explainability', icon: ShieldCheck, num: '08' },
    { id: 'alerts', label: 'Alert Management', icon: AlertOctagon, num: '09', badge: '8' },
    { id: 'reports', label: 'Report Generation', icon: FileText, num: '10' }
  ];

  return (
    <aside className="w-64 bg-[#2d2418]/95 backdrop-blur-md border-r border-[#d9a441]/20 flex flex-col justify-between p-4 font-mono text-xs select-none">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div className="text-[10px] font-bold text-[#d9a441] tracking-widest uppercase px-3 border-b border-[#d9a441]/20 pb-2">
          INTELLIGENCE MODULES
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#d9a441]/15 text-[#d9a441] border border-[#d9a441]/40 font-bold glow-cyan'
                    : 'text-[#b9b1a7] hover:text-white hover:bg-[#3d2f23]/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#d9a441]' : 'text-[#b9b1a7]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="bg-red-500 text-black px-1.5 py-0.2 rounded font-bold text-[9px]">
                    {item.badge}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600 font-normal">{item.num}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout / Switch Auth Link */}
      <div className="pt-4 border-t border-[#d9a441]/20">
        <button
          onClick={() => onNavigate('login')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[#b9b1a7] hover:text-[#c94c2b] hover:bg-[#3d2f23]/70 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Re-authenticate</span>
        </button>
      </div>
    </aside>
  );
}
