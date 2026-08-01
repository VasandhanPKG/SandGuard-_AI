import React from 'react';
import { HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ShapWaterfallChart() {
  const shapFeatures = [
    { name: 'Drone FLIR Heavy Excavator Match', value: '+0.28', pct: 28, color: '#ef4444', desc: 'Skydio UAV FLIR identified active CAT 320 excavator' },
    { name: 'ANPR Tollgate Convoy Anomaly (15 Trips)', value: '+0.24', pct: 24, color: '#f59e0b', desc: 'Truck TN52 AB4321 exceeded daily baseline by 650%' },
    { name: 'Riverbank Morphology Shift (+14.2m)', value: '+0.18', pct: 18, color: '#38bdf8', desc: 'Sentinel-2 multispectral surface erosion delta' },
    { name: 'Vegetation Canopy Loss (3.4 Ha)', value: '+0.12', pct: 12, color: '#eab308', desc: 'Unapproved clearing of river protection buffer' },
    { name: 'Location Historical Violation Recurrence', value: '+0.08', pct: 8, color: '#a855f7', desc: 'Site previously cited in 2024 enforcement order' },
    { name: 'Standard Daylight Operational Window', value: '-0.05', pct: 5, color: '#10b981', desc: 'Daytime baseline activity discount factor' }
  ];

  return (
    <div className="bg-[#0f172a]/90 backdrop-blur-md border border-[#00e5ff]/30 rounded-xl p-5 shadow-2xl text-xs font-mono text-gray-200">
      <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#00e5ff] flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
            <span>SHAP (SHAPLEY ADDITIVE EXPLANATIONS) WATERFALL PLOT</span>
          </h4>
          <p className="text-[11px] text-gray-400 mt-0.5">XAI Attribution Analysis for Incident #ALT-9942 (Bhavani River Sector 4B)</p>
        </div>
        <span className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-2.5 py-1 rounded text-[11px] font-bold">
          BASE RISK: 10% → FINAL: 93%
        </span>
      </div>

      {/* Feature Waterfall Rows */}
      <div className="space-y-3">
        {shapFeatures.map((f, i) => (
          <div key={i} className="group hover:bg-[#17213b]/60 p-2.5 rounded transition-colors border border-transparent hover:border-[#00e5ff]/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-gray-200">{f.name}</span>
              <span className="font-bold" style={{ color: f.color }}>{f.value}</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-[#070d1e] rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${f.pct * 3}%`, backgroundColor: f.color }}
              ></div>
            </div>

            <p className="text-[10px] text-gray-400 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#00e5ff]/20 text-[11px] text-gray-400 flex items-center justify-between">
        <span>XAI AUDIT ACCURACY: <strong className="text-emerald-400">99.2%</strong></span>
        <span>MODEL: <strong className="text-[#00e5ff]">SANDSHIELD-XAI-GNN-v4.2</strong></span>
      </div>
    </div>
  );
}
