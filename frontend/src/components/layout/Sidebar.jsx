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
    { id: 'reports', label: 'Report Generation', icon: FileText, num: '10' },
    { id: 'mobile', label: 'Mobile Officer App', icon: Smartphone, num: '11' }
  ];

  return (
    <aside className="w-64 bg-[#0f172a]/95 backdrop-blur-md border-r border-[#00e5ff]/20 flex flex-col justify-between p-4 font-mono text-xs select-none">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div className="text-[10px] font-bold text-[#00e5ff] tracking-widest uppercase px-3 border-b border-[#00e5ff]/20 pb-2">
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
                    ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 font-bold glow-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-[#17213b]/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00e5ff]' : 'text-gray-400'}`} />
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
      <div className="pt-4 border-t border-[#00e5ff]/20">
        <button
          onClick={() => onNavigate('login')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Re-authenticate</span>
        </button>
      </div>
    </aside>
  );
}
