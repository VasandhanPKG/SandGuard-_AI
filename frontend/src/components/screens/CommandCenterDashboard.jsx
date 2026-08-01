import React from 'react';
import { Shield, AlertOctagon, Activity, MapPin, Truck, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';
import GisMapCanvas from '../ui/GisMapCanvas';

export default function CommandCenterDashboard({ onNavigate }) {
  const analyticsCards = [
    { title: 'Total Monitored Area', value: '14,850 sq km', change: '+12% Expansion', color: '#00e5ff', icon: Activity },
    { title: 'Active Alerts', value: '24 Incidents', change: '8 Critical / 11 High', color: '#ef4444', icon: AlertOctagon },
    { title: 'High Risk Zones', value: '12 River Basins', change: 'Bhavani / Cauvery Focus', color: '#f59e0b', icon: MapPin },
    { title: 'Pending Inspections', value: '9 Field Dispatches', change: '4 Units En Route', color: '#38bdf8', icon: Truck },
    { title: 'Environmental Damage Score', value: '78 / 100', change: 'HIGH RISK LEVEL', color: '#ef4444', icon: AlertTriangle }
  ];

  const recentAlerts = [
    {
      id: 'ALT-9942',
      title: 'Illegal Dredging Detected',
      location: 'Bhavani River Sector 4B',
      risk: 92,
      confidence: 95,
      time: '12m ago',
      evidence: 'Satellite surface change + 3 Excavators',
      critical: true
    },
    {
      id: 'ALT-9941',
      title: 'Night Tipper Convoy Anomaly',
      location: 'Cauvery River North Bank',
      risk: 84,
      confidence: 91,
      time: '45m ago',
      evidence: '15 Dump trucks scanned (ANPR Gate 03)',
      critical: false
    },
    {
      id: 'ALT-9939',
      title: 'Riverbank Vegetation Stripping',
      location: 'Palar River Basin Sector 1C',
      risk: 68,
      confidence: 88,
      time: '2h ago',
      evidence: 'Canopy cleared (3.4 Hectares)',
      critical: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top 5 Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono">
        {analyticsCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-card p-4 rounded-xl border border-[#00e5ff]/20 hover:border-[#00e5ff]/40 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-semibold">{c.title}</span>
                <Icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <div className="text-xl font-bold text-white mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[10px] text-gray-400">{c.change}</div>
            </div>
          );
        })}
      </div>

      {/* Main Section: GIS Map + Right Alert Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[520px]">
        {/* Left 3 Columns: Interactive GIS Map Canvas */}
        <div className="lg:col-span-3 h-[520px]">
          <GisMapCanvas height="h-full" onSelectHotspot={() => onNavigate && onNavigate('gis')} />
        </div>

        {/* Right Column: Real-Time Incident Stream */}
        <div className="glass-card p-5 rounded-xl border border-[#00e5ff]/20 flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-3 mb-4">
              <h3 className="text-xs font-bold text-[#00e5ff] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>LIVE INCIDENT STREAM</span>
              </h3>
              <span className="text-[10px] text-gray-400">24 ACTIVE</span>
            </div>

            {/* Featured Critical Incident Card */}
            <div className="space-y-3">
              {recentAlerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onNavigate && onNavigate('alerts')}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    a.critical
                      ? 'bg-red-950/30 border-red-500/50 hover:border-red-400 glow-red'
                      : 'bg-[#070d1e]/80 border-[#00e5ff]/20 hover:border-[#00e5ff]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{a.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.critical ? 'bg-red-500 text-black' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {a.risk}% RISK
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-300 mb-1">{a.location}</div>
                  <div className="text-[10px] text-gray-400 mb-2">Evidence: {a.evidence}</div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800">
                    <span>CONF: <strong className="text-[#00e5ff]">{a.confidence}%</strong></span>
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('alerts')}
            className="w-full mt-4 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff] font-bold py-2 rounded text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <span>VIEW ALL INCIDENTS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
