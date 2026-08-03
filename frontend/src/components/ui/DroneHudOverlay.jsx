import React, { useState } from 'react';
import { Crosshair, Video, Radio, Compass, AlertCircle, Eye } from 'lucide-react';

export default function DroneHudOverlay() {
  const [thermalMode, setThermalMode] = useState(true);

  return (
    <div className="relative w-full h-[480px] bg-[#140f08] rounded-xl overflow-hidden border border-[#d9a441]/40 shadow-2xl select-none font-mono">
      {/* Top HUD Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between bg-[#2d2418]/90 backdrop-blur-md border border-[#d9a441]/30 px-4 py-2 rounded-lg text-xs text-[#d9a441]">
        <div className="flex items-center space-x-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold text-red-400">REC [LIVE 4K FLIR HD]</span>
          <span className="text-gray-500">|</span>
          <span>UAV-ALPHA-04 (Skydio X2)</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
              thermalMode ? 'bg-[#d9a441]/20 text-[#d9a441] border-[#d9a441]' : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
          >
            {thermalMode ? 'FLIR THERMAL IR' : 'OPTICAL RGB'}
          </button>
          <span>ALT: <strong className="text-white">120m</strong></span>
          <span>SPEED: <strong className="text-white">18 km/h</strong></span>
          <span>5G LINK: <strong className="text-emerald-400">98%</strong></span>
        </div>
      </div>

      {/* Main Drone Camera Feed SVG Viewport */}
      <svg className="w-full h-full" viewBox="0 0 800 480">
        {/* Background Video Stream Representation */}
        <rect width="800" height="480" fill={thermalMode ? "#041527" : "#091a24"} />

        {/* Muddy Riverbank Site & Water */}
        <path d="M 0,200 Q 400,280 800,220 L 800,480 L 0,480 Z" fill={thermalMode ? "#1a2c42" : "#17281f"} />
        <path d="M 0,280 Q 400,340 800,300 L 800,480 L 0,480 Z" fill={thermalMode ? "#0d436e" : "#093344"} />

        {/* Crosshair Tactical Reticle Overlay */}
        <line x1="400" y1="40" x2="400" y2="440" stroke="rgba(217, 164, 65, 0.25)" strokeWidth="1" strokeDasharray="6,6" />
        <line x1="40" y1="240" x2="760" y2="240" stroke="rgba(217, 164, 65, 0.25)" strokeWidth="1" strokeDasharray="6,6" />

        {/* Central HUD Target Pitch / Roll Rings */}
        <circle cx="400" cy="240" r="80" fill="none" stroke="rgba(217, 164, 65, 0.3)" strokeWidth="1.5" />
        <circle cx="400" cy="240" r="160" fill="none" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" />
        <circle cx="400" cy="240" r="4" fill="#d9a441" />

        {/* AI Object Detection Bounding Boxes */}
        {/* 1. EXCAVATOR (Critical Red Box) */}
        <g transform="translate(240, 180)">
          <rect width="130" height="90" fill="rgba(239, 68, 68, 0.2)" stroke="#c94c2b" strokeWidth="2.5" className="animate-pulse" />
          <rect x="0" y="-22" width="160" height="20" fill="rgba(239, 68, 68, 0.9)" rx="2" />
          <text x="6" y="-8" fill="#ffffff" fontSize="10" fontWeight="bold">CAT 320 EXCAVATOR | 96.8%</text>
        </g>

        {/* 2. DUMP TRUCK (Orange Box) */}
        <g transform="translate(480, 220)">
          <rect width="140" height="75" fill="rgba(245, 158, 11, 0.2)" stroke="#d68a2c" strokeWidth="2" />
          <rect x="0" y="-22" width="170" height="20" fill="rgba(245, 158, 11, 0.9)" rx="2" />
          <text x="6" y="-8" fill="#ffffff" fontSize="10" fontWeight="bold">TRUCK: TN52 AB4321 | 94.2%</text>
        </g>

        {/* 3. DREDGING VESSEL (Red Box in Water) */}
        <g transform="translate(140, 320)">
          <rect width="160" height="80" fill="rgba(239, 68, 68, 0.25)" stroke="#c94c2b" strokeWidth="2" />
          <rect x="0" y="-22" width="180" height="20" fill="rgba(239, 68, 68, 0.9)" rx="2" />
          <text x="6" y="-8" fill="#ffffff" fontSize="10" fontWeight="bold">ILLEGAL DREDGER BARGE | 98.1%</text>
        </g>

        {/* 4. COMMERCIAL SAND STOCKPILE (Yellow Box) */}
        <g transform="translate(620, 140)">
          <polygon points="0,60 50,0 100,60" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="2" />
          <rect x="0" y="-22" width="160" height="20" fill="rgba(234, 179, 8, 0.9)" rx="2" />
          <text x="6" y="-8" fill="#000000" fontSize="10" fontWeight="bold">SAND PILE (~450T) | 92.4%</text>
        </g>
      </svg>

      {/* Bottom Telemetry GPS Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-[#2d2418]/90 backdrop-blur-md border border-[#d9a441]/30 px-4 py-2 rounded-lg text-xs text-gray-300">
        <div>TARGET GPS: <strong className="text-emerald-400">11.3412° N, 77.7172° E</strong> (Bhavani River Sector 4B)</div>
        <div>PAYLOAD: <strong className="text-[#d9a441]">OPTICAL 4K + FLIR IR DUAL SENSOR</strong></div>
      </div>
    </div>
  );
}
