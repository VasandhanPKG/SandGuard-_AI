import React from 'react';
import { Truck, Video, Eye, MapPin, AlertOctagon, Navigation, ArrowRight } from 'lucide-react';

export default function VehicleAnalyticsScreen() {
  const flaggedVehicles = [
    { plate: 'TN52 AB4321', type: '10-Wheeler Tipper Truck', trips: 15, zone: 'Bhavani River Sector 4B', risk: 89, status: 'HIGH' },
    { plate: 'TN52 C8841', type: 'Heavy Commercial Tipper', trips: 18, zone: 'Bhavani River Sector 4B', risk: 94, status: 'CRITICAL' },
    { plate: 'TN38 X9920', type: 'Dump Truck', trips: 11, zone: 'Bhavani River Sector 2A', risk: 84, status: 'HIGH' },
    { plate: 'TN45 K1002', type: 'Tractor Tipper', trips: 8, zone: 'Cauvery North Bank', risk: 68, status: 'MEDIUM' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top ANPR Controls */}
      <div className="glass-card p-4 rounded-xl border border-[#00e5ff]/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="w-5 h-5 text-[#00e5ff]" />
          <div>
            <div className="text-gray-400 text-[10px]">ANPR CAMERA NODE</div>
            <div className="text-white font-bold text-sm">Bhavani River Access Gate #03 (Tollgate Camera Node #44)</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-400">24H TRANSIT FILTER: </span>
          <strong className="text-emerald-400">LAST 24 HOURS (ACTIVE)</strong>
        </div>
      </div>

      {/* Main Grid: ANPR Scanner Feed + Target Vehicle Intelligence Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Container: Live ANPR Camera OCR Scanning Viewport */}
        <div className="glass-card p-5 rounded-xl border border-[#00e5ff]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-3 mb-4">
              <h4 className="text-sm font-bold text-[#00e5ff] flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>ANPR CAMERA FEED & LICENSE PLATE SCANNER</span>
              </h4>
              <span className="text-emerald-400 font-bold">OCR: 99.1% MATCH</span>
            </div>

            {/* Camera Viewport Placeholder */}
            <div className="relative w-full h-[260px] bg-[#050b18] rounded-lg overflow-hidden border border-[#00e5ff]/30 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 260">
                <rect width="500" height="260" fill="#081427" />
                {/* Truck Silhouette */}
                <rect x="150" y="80" width="200" height="110" fill="#17283c" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="110" y="110" width="40" height="80" fill="#1e344f" />

                {/* License Plate Scanning Box */}
                <g transform="translate(190, 140)">
                  <rect width="120" height="35" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-pulse" />
                  <rect x="0" y="-18" width="100" height="16" fill="#ef4444" rx="2" />
                  <text x="5" y="-6" fill="#ffffff" fontSize="9" fontWeight="bold">ANPR SCANNING</text>
                  <rect x="10" y="5" width="100" height="25" fill="#ffffff" rx="2" />
                  <text x="60" y="22" textAnchor="middle" fill="#000000" fontSize="12" fontWeight="bold">TN52 AB4321</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#00e5ff]/20 flex items-center justify-between text-gray-300">
            <span>LAST CAPTURED PLATE: <strong className="text-white">TN52 AB4321</strong></span>
            <span className="text-emerald-400">TIMESTAMP: 14:31:02 IST</span>
          </div>
        </div>

        {/* Right Container: Vehicle Transit Intelligence & Route Loop */}
        <div className="glass-card p-5 rounded-xl border border-amber-500/40 flex flex-col justify-between bg-amber-950/10">
          <div>
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
              <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4" />
                <span>TARGET VEHICLE TRANSIT DOSSIER</span>
              </h4>
              <span className="bg-amber-500 text-black px-2 py-0.5 rounded font-bold text-[10px]">
                89% ANOMALY RISK
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#070d1e] p-3 rounded-lg border border-[#00e5ff]/20">
                <span className="text-gray-400">LICENSE PLATE:</span>
                <span className="text-lg font-bold text-[#00e5ff] font-mono">TN52 AB4321</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-gray-300">
                <div className="bg-[#070d1e] p-2.5 rounded border border-gray-800">
                  <div className="text-gray-500 text-[10px]">VEHICLE TYPE</div>
                  <div className="font-bold text-white mt-0.5">10-Wheeler Tipper</div>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded border border-gray-800">
                  <div className="text-gray-500 text-[10px]">24H TRIP COUNT</div>
                  <div className="font-bold text-amber-400 mt-0.5">15 Trips (Baseline: 2)</div>
                </div>
              </div>

              {/* Transit Route Trace Preview */}
              <div className="bg-[#070d1e] p-3 rounded-lg border border-[#00e5ff]/20 space-y-2">
                <div className="text-gray-400 text-[10px] uppercase">DETECTED TRANSIT ROUTE LOOP</div>
                <div className="flex items-center space-x-2 text-[11px] text-gray-300">
                  <span className="text-red-400">Riverbank Sector 4B</span>
                  <ArrowRight className="w-3 h-3 text-[#00e5ff]" />
                  <span className="text-amber-400">Tollgate Gate 03</span>
                  <ArrowRight className="w-3 h-3 text-[#00e5ff]" />
                  <span className="text-[#00e5ff]">Private Stockpile Yard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex space-x-3">
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-black font-bold py-2 rounded text-xs transition-colors">
              ISSUE SEIZURE WARRANT
            </button>
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-2 rounded text-xs transition-colors border border-gray-700">
              TRACK TRANSIT LOOP
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Suspicious Vehicle Fleet Table */}
      <div className="glass-card p-5 rounded-xl border border-[#00e5ff]/20">
        <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-3 mb-4">
          <h4 className="text-sm font-bold text-[#00e5ff]">SUSPICIOUS COMMERCIAL VEHICLE MONITORING QUEUE</h4>
          <span className="text-gray-400">4 HIGH-RISK VEHICLES FLAGGED TODAY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 text-[11px]">
                <th className="pb-2">LICENSE PLATE</th>
                <th className="pb-2">VEHICLE TYPE</th>
                <th className="pb-2">TRIPS (24H)</th>
                <th className="pb-2">LINKED RIVER SECTOR</th>
                <th className="pb-2">RISK SCORE</th>
                <th className="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {flaggedVehicles.map((v, i) => (
                <tr key={i} className="hover:bg-[#17213b]/50">
                  <td className="py-2.5 font-bold text-[#00e5ff]">{v.plate}</td>
                  <td className="py-2.5">{v.type}</td>
                  <td className="py-2.5 text-amber-400 font-bold">{v.trips} Trips</td>
                  <td className="py-2.5 text-gray-400">{v.zone}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'CRITICAL' ? 'bg-red-500 text-black' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {v.risk}% {v.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 px-2.5 py-1 rounded text-[10px] font-bold">
                      FLAG VEHICLE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
