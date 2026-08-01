import React, { useState } from 'react';
import { FileText, Download, Printer, CheckSquare, Shield, CheckCircle } from 'lucide-react';

export default function ReportGenerationScreen() {
  const [selectedModules, setSelectedModules] = useState({
    gpsMaps: true,
    satellite: true,
    drone: true,
    anpr: true,
    environmental: true,
    xai: true,
    legal: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const toggleModule = (key) => {
    setSelectedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsDownloaded(true);
      window.print();
    }, 1000);
  };

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Column: Report Configurator */}
        <div className="glass-card p-5 rounded-xl border border-[#00e5ff]/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#00e5ff]/20 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#00e5ff] flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>INTELLIGENCE DOSSIER BUILDER</span>
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Generate court-admissible government enforcement PDF reports</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">TARGET INCIDENT</label>
                <select className="w-full bg-[#070d1e] border border-[#00e5ff]/30 text-white p-2 rounded outline-none">
                  <option>Incident #ALT-9942 - Bhavani River Sector 4B</option>
                  <option>Incident #ALT-9941 - Cauvery North Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">REPORT CLASSIFICATION</label>
                <select className="w-full bg-[#070d1e] border border-[#00e5ff]/30 text-white p-2 rounded outline-none">
                  <option>Court-Admissible Enforcement Dossier</option>
                  <option>Executive Briefing Summary</option>
                  <option>Environmental Impact Assessment</option>
                </select>
              </div>

              {/* Module Checklist */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2">INCLUDED DOSSIER MODULES</label>
                <div className="space-y-2 text-gray-300">
                  {[
                    { key: 'gpsMaps', label: 'Location GPS & Map Boundaries' },
                    { key: 'satellite', label: 'Satellite Surface Change Imagery' },
                    { key: 'drone', label: 'Drone FLIR Bounding Box Evidence' },
                    { key: 'anpr', label: 'ANPR Vehicle Transit Logs' },
                    { key: 'environmental', label: 'Environmental Impact Index' },
                    { key: 'xai', label: 'AI Confidence & XAI Certificate' },
                    { key: 'legal', label: 'Recommended Legal Actions' }
                  ].map(m => (
                    <label key={m.key} className="flex items-center space-x-2 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedModules[m.key]}
                        onChange={() => toggleModule(m.key)}
                        className="rounded accent-[#00e5ff]"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all glow-cyan cursor-pointer"
          >
            {isGenerating ? (
              <span>COMPILING PDF ENFORCEMENT DOSSIER...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>GENERATE & DOWNLOAD OFFICIAL PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Right 2 Columns: Live Interactive A4 PDF Document Preview */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-[#00e5ff]/30 space-y-4">
          <div className="flex justify-between items-center border-b border-[#00e5ff]/20 pb-3">
            <span className="text-xs font-bold text-gray-300">LIVE A4 DOCUMENT PRINT PREVIEW</span>
            <span className="text-emerald-400 font-bold text-[11px]">CLASSIFICATION: CONFIDENTIAL</span>
          </div>

          {/* Printable A4 Formatted Document Container */}
          <div className="bg-[#050b18] text-gray-200 border border-[#00e5ff]/20 p-8 rounded-lg space-y-5 shadow-2xl font-serif">
            {/* Document Government Header */}
            <div className="border-b-2 border-[#00e5ff] pb-4 flex justify-between items-center font-sans">
              <div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-[#00e5ff]" />
                  <h2 className="text-lg font-bold text-white tracking-wide">SANDSHIELD AI ENFORCEMENT CELL</h2>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">STATE ENVIRONMENT TASK FORCE | GOVERNMENT OF INDIA</p>
              </div>

              <div className="text-right font-mono text-[11px] text-gray-400">
                <div>DOSSIER ID: DOS-2026-BHV-9942</div>
                <div>DATE: 2026-07-31</div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-1 font-sans">
              <h4 className="font-bold text-[#00e5ff] uppercase text-xs">SECTION 1: TARGET INCIDENT SUMMARY</h4>
              <div className="text-xs text-gray-300 bg-[#0c162d] p-3 rounded border border-gray-800 space-y-1">
                <div><strong>Location:</strong> Bhavani River Basin - Sector 4B (11.3412° N, 77.7172° E)</div>
                <div><strong>Composite Risk Assessment:</strong> <span className="text-red-400 font-bold">93% CRITICAL HIGH</span></div>
                <div><strong>AI Confidence Rating:</strong> 96.4% Multispectral Fusion</div>
              </div>
            </div>

            {/* Section 2: Visual Evidence Matrix */}
            <div className="space-y-2 font-sans">
              <h4 className="font-bold text-[#00e5ff] uppercase text-xs">SECTION 2: MULTI-SENSOR VISUAL EVIDENCE</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-[#0c162d] p-2.5 rounded border border-gray-800">
                  <div className="font-bold text-[#00e5ff] mb-1">SATELLITE CHANGE</div>
                  <div className="text-gray-400">85% Surface Shift Delta</div>
                </div>
                <div className="bg-[#0c162d] p-2.5 rounded border border-gray-800">
                  <div className="font-bold text-red-400 mb-1">DRONE FLIR RECON</div>
                  <div className="text-gray-400">CAT 320 Excavator Match</div>
                </div>
                <div className="bg-[#0c162d] p-2.5 rounded border border-gray-800">
                  <div className="font-bold text-amber-400 mb-1">ANPR TOLLGATE LOG</div>
                  <div className="text-gray-400">Plate TN52 AB4321 (15 Trips)</div>
                </div>
              </div>
            </div>

            {/* Section 3: Recommended Action & Signature Block */}
            <div className="pt-4 border-t border-gray-800 flex justify-between items-end font-sans">
              <div className="space-y-1">
                <h4 className="font-bold text-[#00e5ff] uppercase text-xs">SECTION 3: RECOMMENDED LEGAL ACTION</h4>
                <p className="text-xs text-gray-300 max-w-md">
                  Immediate impoundment of machinery under Section 21 of Mines & Minerals Act.
                </p>
              </div>

              <div className="text-right font-mono text-[10px] space-y-1">
                <div className="text-[#00e5ff] font-bold">INSPECTOR GENERAL R. SHARMA</div>
                <div className="text-gray-400">[DIGITALLY SIGNED & STAMPED]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
