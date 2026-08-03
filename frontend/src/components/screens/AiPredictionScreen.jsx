import React from 'react';
import { Cpu, TrendingUp, Calendar, MapPin, Zap, AlertTriangle } from 'lucide-react';
import GisMapCanvas from '../ui/GisMapCanvas';

export default function AiPredictionScreen() {
  const contributingFactors = [
    { factor: 'Heavy Tipper Truck ANPR Movement Frequency', weight: 35, color: '#c94c2b' },
    { factor: 'Riverbank Structural Erosion & Morphology Change', weight: 25, color: '#d68a2c' },
    { factor: 'Historical Location Repeat Offender Index', weight: 20, color: '#8aa48f' },
    { factor: 'Vegetation Canopy Clearing & Road Access', weight: 12, color: '#eab308' },
    { factor: 'River Water Level & Weather Accessibility Index', weight: 8, color: '#8aa48f' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Predictive Controls Header */}
      <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-[#d9a441]" />
          <div>
            <div className="text-gray-400 text-[10px]">AI PREDICTIVE FORECAST HORIZON</div>
            <div className="text-white font-bold text-sm">30-Day Predictive Mining Probability Model (August 2026)</div>
          </div>
        </div>

        <div className="bg-[#1b1610] px-3 py-1.5 rounded-lg border border-[#d9a441]/20">
          <span className="text-gray-400">MODEL ARCHITECTURE: </span>
          <strong className="text-emerald-400">LSTM-GNN Fusion Engine v4.2 (93.4% Accuracy)</strong>
        </div>
      </div>

      {/* Main Section: 30-Day Probability GIS Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[460px] space-y-2">
          <h3 className="text-sm font-bold text-[#d9a441] flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>PROJECTED ILLEGAL MINING PROBABILITY MAP (30-DAY FORECAST)</span>
          </h3>
          <GisMapCanvas height="h-[420px]" />
        </div>

        {/* Right Section: Top AI Contributing Factor Drivers */}
        <div className="glass-card p-5 rounded-xl border border-[#d9a441]/20 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#d9a441]/20 pb-3 mb-4">
              <h4 className="text-sm font-bold text-[#d9a441]">AI MODEL CONTRIBUTING FACTOR WEIGHTS</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Key parameters driving future risk predictions</p>
            </div>

            <div className="space-y-4">
              {contributingFactors.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-gray-300 mb-1 text-[11px]">
                    <span className="truncate max-w-[200px]">{f.factor}</span>
                    <strong style={{ color: f.color }}>{f.weight}% Weight</strong>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f.weight}%`, backgroundColor: f.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-300">
            <div className="font-bold mb-1 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>HIGH RISK PREDICTED HOTSPOT</span>
            </div>
            <p className="text-[10px]">
              Bhavani River Sector 4B has a <strong className="text-red-400 font-bold">92% Probability</strong> of violation within the next 7 days during night-shift windows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
