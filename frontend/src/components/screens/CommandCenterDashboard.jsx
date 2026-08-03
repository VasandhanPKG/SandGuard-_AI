import React, { useEffect, useState } from 'react';
import { Shield, AlertOctagon, Activity, MapPin, Truck, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';
import GisMapCanvas from '../ui/GisMapCanvas';
import SentinelRealtimeMap from '../ui/SentinelRealtimeMap';
import api from '../../services/api';

export default function CommandCenterDashboard({ onNavigate }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getDashboardSummary()
      .then(data => {
        if (isMounted) {
          setSummaryData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.warn('Dashboard summary fetch failed, using fallback:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const analyticsCards = [
    { title: 'Total Monitored Area', value: summaryData ? `${summaryData.monitored_area_sq_km || 14850} sq km` : '14,850 sq km', change: '+12% Expansion', color: '#d9a441', icon: Activity },
    { title: 'Active Alerts', value: summaryData ? `${summaryData.active_critical_alerts || 24} Incidents` : '24 Incidents', change: '8 Critical / 11 High', color: '#c94c2b', icon: AlertOctagon },
    { title: 'High Risk Zones', value: summaryData ? `${summaryData.unauthorized_sites_count || 12} River Basins` : '12 River Basins', change: 'Bhavani / Cauvery Focus', color: '#d68a2c', icon: MapPin },
    { title: 'Pending Inspections', value: '9 Field Dispatches', change: '4 Units En Route', color: '#8aa48f', icon: Truck },
    { title: 'Environmental Damage Score', value: summaryData ? `${summaryData.average_system_risk_score || 78} / 100` : '78 / 100', change: 'HIGH RISK LEVEL', color: '#c94c2b', icon: AlertTriangle }
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
            <div
              key={i}
              className="glass-card p-4 rounded-xl border border-[#d9a441]/20 hover:border-[#d9a441]/40 transition-all duration-300 ease-out transform-gpu hover:-translate-y-1 hover:scale-105"
            >
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
          <div className="h-full flex flex-col gap-4">
            <GisMapCanvas height="h-[calc(100%-260px)]" onSelectHotspot={() => onNavigate && onNavigate('gis')} />
            <SentinelRealtimeMap className="h-[260px]" />
          </div>
        </div>

        {/* Right Column: Real-Time Incident Stream */}
        <div className="glass-card p-5 rounded-xl border border-[#d9a441]/20 flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-[#d9a441]/20 pb-3 mb-4">
              <h3 className="text-xs font-bold text-[#d9a441] flex items-center space-x-2 shimmer-tag px-2 py-1 rounded-full bg-[#1b1610]/80 border border-[#d9a441]/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
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
                  className={`p-3.5 rounded-lg border transition-all duration-300 transform-gpu cursor-pointer ${
                    a.critical
                      ? 'bg-red-950/30 border-red-500/50 hover:border-red-400 glow-red hover:-translate-y-1 hover:shadow-lg'
                      : 'bg-[#1b1610]/80 border-[#d9a441]/20 hover:border-[#d9a441]/40 hover:-translate-y-1 hover:shadow-lg'
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
                    <span>CONF: <strong className="text-[#d9a441]">{a.confidence}%</strong></span>
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('alerts')}
            className="w-full mt-4 bg-[#d9a441]/10 hover:bg-[#d9a441]/20 border border-[#d9a441]/40 text-[#d9a441] font-bold py-2 rounded text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <span>VIEW ALL INCIDENTS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
