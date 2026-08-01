import React from 'react';
import { Calendar, Globe, Layers, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import ImageCompareSlider from '../ui/ImageCompareSlider';

export default function SatelliteIntelligenceScreen() {
  const changeMetrics = [
    { name: 'River Morphology Shift', value: '+14.2m Bank Erosion', confidence: '94.8%', color: '#ef4444' },
    { name: 'Shoreline Displacement', value: '220m Channel Alteration', confidence: '96.1%', color: '#f59e0b' },
    { name: 'Water Turbidity Rise', value: '+185% NTU Sediment', confidence: '91.5%', color: '#38bdf8' },
    { name: 'Vegetation Loss Area', value: '3.4 Hectares Stripped', confidence: '97.2%', color: '#eab308' },
    { name: 'Sand Extraction Pit Volume', value: '18,500 m³ Excavated', confidence: '95.6%', color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Filter Controls Bar */}
      <div className="glass-card p-4 rounded-xl border border-[#00e5ff]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-[#00e5ff]" />
          <div>
            <div className="text-gray-400 text-[10px]">MONITORED TARGET LOCATION</div>
            <div className="text-white font-bold text-sm">Bhavani River Basin - Sector 4B (Site SAT-9921)</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-[#070d1e] px-3 py-1.5 rounded-lg border border-[#00e5ff]/20">
            <span className="text-gray-400">SENSOR: </span>
            <strong className="text-[#00e5ff]">Sentinel-2A + PlanetScope (10m / 3m)</strong>
          </div>
          <div className="bg-[#070d1e] px-3 py-1.5 rounded-lg border border-[#00e5ff]/20">
            <span className="text-gray-400">TIMELINE: </span>
            <strong className="text-emerald-400">15 Jan 2026 vs 28 Jul 2026</strong>
          </div>
        </div>
      </div>

      {/* Main Interactive Before & After Satellite Slider */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#00e5ff] flex items-center space-x-2">
          <Layers className="w-4 h-4" />
          <span>INTERACTIVE MULTISPECTRAL COMPARISON SLIDER</span>
        </h3>
        <ImageCompareSlider />
      </div>

      {/* AI Detected Surface Changes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {changeMetrics.map((m, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-[#00e5ff]/20">
            <div className="text-gray-400 text-[10px] mb-1">{m.name}</div>
            <div className="text-base font-bold mb-2" style={{ color: m.color }}>{m.value}</div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800">
              <span>AI CONFIDENCE:</span>
              <strong className="text-[#00e5ff]">{m.confidence}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Confidence Score Card */}
      <div className="glass-card p-5 rounded-xl border border-[#00e5ff]/30 flex items-center justify-between bg-[#070d1e]/80">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
            96.4%
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">OVERALL AI CHANGE DETECTION CONFIDENCE</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Validated against Sentinel-2 L2A & Planet Labs daily constellation imagery.</p>
          </div>
        </div>

        <button className="bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold px-4 py-2 rounded-lg transition-colors">
          EXPORT SATELLITE EVIDENCE DOSSIER
        </button>
      </div>
    </div>
  );
}
