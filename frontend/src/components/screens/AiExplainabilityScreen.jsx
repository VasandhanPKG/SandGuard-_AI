import React from 'react';
import { ShieldCheck, Cpu, FileText, Download, CheckCircle, Info } from 'lucide-react';
import ShapWaterfallChart from '../ui/ShapWaterfallChart';

export default function AiExplainabilityScreen() {
  const scoreBreakdown = [
    { category: 'Satellite Surface Evidence', pct: 30, desc: 'Sentinel-2 multispectral surface change delta' },
    { category: 'Drone Reconnaissance Detection', pct: 25, desc: 'Skydio UAV FLIR thermal camera machinery match' },
    { category: 'ANPR Vehicle Movement Anomaly', pct: 20, desc: 'Tollgate Gate 03 heavy tipper truck trip spike' },
    { category: 'Environmental & Canopy Impact', pct: 15, desc: 'Riverbank buffer vegetation stripping index' },
    { category: 'Location Violation History', pct: 10, desc: 'Past repeat offender citations at coordinates' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Target Incident Header Bar */}
      <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-[#d9a441]" />
          <div>
            <div className="text-gray-400 text-[10px]">EXPLAINABLE AI (XAI) AUDIT DOSSIER</div>
            <div className="text-white font-bold text-sm">Target Incident #ALT-9942 - Bhavani River Sector 4B</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded text-xs font-bold">
            COMPOSITE RISK: 93% CRITICAL
          </span>
          <span className="bg-[#d9a441]/10 text-[#d9a441] border border-[#d9a441]/30 px-3 py-1 rounded text-xs font-bold">
            SHAP AUDITED (99.2% ACCURACY)
          </span>
        </div>
      </div>

      {/* Main Grid: Multi-Sensor Weight Breakdown + SHAP Waterfall Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Risk Score Percentage Breakdown Cards */}
        <div className="glass-card p-5 rounded-xl border border-[#d9a441]/20 space-y-4">
          <div className="border-b border-[#d9a441]/20 pb-3">
            <h4 className="text-sm font-bold text-[#d9a441]">AI RISK SCORE MULTI-SENSOR WEIGHT DISTRIBUTION</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Contribution percentages forming the final 93% risk score</p>
          </div>

          <div className="space-y-3">
            {scoreBreakdown.map((s, i) => (
              <div key={i} className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/15">
                <div className="flex justify-between items-center mb-1 font-bold text-white">
                  <span>{s.category}</span>
                  <span className="text-[#d9a441]">{s.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-[#d9a441]" style={{ width: `${s.pct * 3}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SHAP Waterfall Plot Component */}
        <ShapWaterfallChart />
      </div>

      {/* Natural Language AI Explanation Summary Card */}
      <div className="glass-card p-5 rounded-xl border border-[#d9a441]/40 bg-[#1b1610]/90 space-y-3">
        <h4 className="text-sm font-bold text-[#d9a441] flex items-center space-x-2">
          <Cpu className="w-4 h-4" />
          <span>NATURAL LANGUAGE AI REASONING SYNTHESIS</span>
        </h4>

        <blockquote className="p-4 bg-[#0a142c] border-l-4 border-[#d9a441] rounded-r-lg text-gray-200 text-xs italic leading-relaxed">
          "High risk score (93%) is driven primarily by active excavation patterns identified via drone FLIR sensors (+0.28 SHAP weight), combined with abnormal 15-trip heavy truck movements through Tollgate Gate 03 (+0.24 SHAP weight), and verified 14.2m river morphology shifting between January and July 2026 satellite passes."
        </blockquote>

        <div className="flex justify-end space-x-3 pt-2">
          <button className="bg-[#d9a441] hover:bg-[#8aa48f] text-black font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>EXPORT XAI COMPLIANCE CERTIFICATE (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
