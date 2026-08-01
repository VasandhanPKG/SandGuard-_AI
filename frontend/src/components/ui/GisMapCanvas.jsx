import React, { useState } from 'react';
import { Shield, AlertTriangle, Video, Navigation, Layers, Compass, Zap } from 'lucide-react';

export default function GisMapCanvas({
  selectedHotspot,
  onSelectHotspot,
  activeLayers = {
    satellite: true,
    drones: true,
    cameras: true,
    miningZones: true,
    riverBoundaries: true,
    heatmap: true
  },
  height = "h-full"
}) {
  const [zoom, setZoom] = useState(14);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Sample map points around Bhavani & Cauvery River Basins
  const hotspots = [
    {
      id: 'Delta-7',
      name: 'Bhavani River Sector 4B',
      lat: '11.3412° N',
      lng: '77.7172° E',
      x: 520,
      y: 280,
      risk: 93,
      type: 'CRITICAL',
      status: 'Illegal Dredging Active',
      confidence: '95%',
      color: '#EF4444'
    },
    {
      id: 'Alpha-3',
      name: 'Cauvery River North Bank',
      lat: '11.3850° N',
      lng: '77.8100° E',
      x: 740,
      y: 190,
      risk: 84,
      type: 'HIGH',
      status: 'Night Truck Convoy',
      confidence: '91%',
      color: '#F59E0B'
    },
    {
      id: 'Palar-1',
      name: 'Palar River Buffer Zone C',
      lat: '11.2900° N',
      lng: '77.6500° E',
      x: 310,
      y: 420,
      risk: 68,
      type: 'MEDIUM',
      status: 'Canopy Stripping',
      confidence: '88%',
      color: '#EAB308'
    },
    {
      id: 'Safe-01',
      name: 'Registered Lease Sector A',
      lat: '11.3200° N',
      lng: '77.7800° E',
      x: 620,
      y: 380,
      risk: 12,
      type: 'SAFE',
      status: 'Authorized Operation',
      confidence: '99%',
      color: '#10B981'
    }
  ];

  const dronePaths = [
    { id: 'UAV-ALPHA-04', path: "M 150,150 L 520,280 L 600,220", status: 'Active Surveillance' }
  ];

  const cameraNodes = [
    { id: 'CAM-ANPR-03', name: 'Tollgate Access Gate 03', x: 440, y: 320, plate: 'TN52 AB4321' },
    { id: 'CAM-ANPR-07', name: 'River Bridge Gate 07', x: 710, y: 220, plate: 'TN38 X9920' }
  ];

  return (
    <div className={`relative w-full ${height} bg-[#070d1e] overflow-hidden rounded-xl border border-[#00e5ff]/20 shadow-2xl flex flex-col select-none`}>
      {/* Top Map Header Telemetry */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3 bg-[#0f172a]/90 backdrop-blur-md border border-[#00e5ff]/30 px-4 py-2 rounded-lg text-xs font-mono text-[#00e5ff]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
        </span>
        <span>ISRO SENTINEL-2 FUSION STREAM</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-300">GRID: IN-TN-BHV-09</span>
        <span className="text-gray-500">|</span>
        <span className="text-emerald-400">LAT: 11.3412° N LNG: 77.7172° E</span>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col bg-[#0f172a]/90 backdrop-blur-md border border-[#00e5ff]/30 rounded-lg overflow-hidden text-xs font-mono text-gray-200">
        <button onClick={() => setZoom(z => Math.min(z + 1, 18))} className="p-2.5 hover:bg-[#00e5ff]/20 border-b border-[#00e5ff]/20 transition-colors">+</button>
        <button onClick={() => setZoom(z => Math.max(z - 1, 10))} className="p-2.5 hover:bg-[#00e5ff]/20 transition-colors">-</button>
      </div>

      {/* Interactive Canvas SVG Overlay */}
      <svg className="w-full h-full min-h-[480px] bg-[#091126] cursor-crosshair" viewBox="0 0 1000 600">
        <defs>
          {/* Heatmap Gradients */}
          <radialGradient id="heat-critical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 229, 255, 0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Base Grid Layer */}
        <rect width="1000" height="600" fill="url(#grid)" />

        {/* Topographic Elevation Curves & Contour Lines */}
        <path d="M 0,100 Q 300,80 500,160 T 1000,120" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4,4" />
        <path d="M 0,250 Q 250,220 520,280 T 1000,240" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1.5" strokeDasharray="6,4" />
        <path d="M 0,450 Q 400,400 700,480 T 1000,420" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4,4" />

        {/* River Network Path Layer */}
        {activeLayers.riverBoundaries && (
          <>
            {/* Main Bhavani River Basin */}
            <path
              d="M 50,50 C 180,120 320,180 520,280 C 650,340 800,240 950,200"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="14"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
            <path
              d="M 50,50 C 180,120 320,180 520,280 C 650,340 800,240 950,200"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            {/* Cauvery River Tributary Branch */}
            <path
              d="M 400,0 C 480,100 520,280 740,190 C 850,140 920,80 1000,50"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeOpacity="0.6"
            />
          </>
        )}

        {/* AI Risk Heatmap Clusters */}
        {activeLayers.heatmap && (
          <>
            <circle cx="520" cy="280" r="110" fill="url(#heat-critical)" className="animate-pulse-slow" />
            <circle cx="740" cy="190" r="85" fill="url(#heat-high)" />
          </>
        )}

        {/* Mining Lease Zones */}
        {activeLayers.miningZones && (
          <polygon
            points="580,340 680,340 660,420 560,410"
            fill="rgba(16, 185, 129, 0.15)"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
        )}

        {/* Drone Surveillance Flight Path Trajectory */}
        {activeLayers.drones && dronePaths.map(d => (
          <g key={d.id}>
            <path d={d.path} fill="none" stroke="#00e5ff" strokeWidth="2" strokeDasharray="6,6" className="animate-pulse" />
            <circle cx="520" cy="280" r="6" fill="#00e5ff">
              <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ANPR Road Camera Nodes */}
        {activeLayers.cameras && cameraNodes.map(c => (
          <g key={c.id} transform={`translate(${c.x}, ${c.y})`}>
            <circle cx="0" cy="0" r="10" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="14" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">{c.name}</text>
          </g>
        ))}

        {/* Hotspot Target Markers */}
        {hotspots.map(h => {
          const isSelected = selectedHotspot?.id === h.id;

          return (
            <g
              key={h.id}
              transform={`translate(${h.x}, ${h.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectHotspot && onSelectHotspot(h)}
              onMouseEnter={() => setHoveredPoint(h)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Outer Pulsing Reticle */}
              {h.type === 'CRITICAL' && (
                <circle cx="0" cy="0" r="28" fill="none" stroke={h.color} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
              )}

              {/* Target Reticle ring */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? "18" : "14"}
                fill="rgba(15, 23, 42, 0.95)"
                stroke={h.color}
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all"
              />

              {/* Target Center Dot */}
              <circle cx="0" cy="0" r="5" fill={h.color} />

              {/* Crosshair ticks */}
              <line x1="-22" y1="0" x2="-14" y2="0" stroke={h.color} strokeWidth="1.5" />
              <line x1="14" y1="0" x2="22" y2="0" stroke={h.color} strokeWidth="1.5" />
              <line x1="0" y1="-22" x2="0" y2="-14" stroke={h.color} strokeWidth="1.5" />
              <line x1="0" y1="14" x2="0" y2="22" stroke={h.color} strokeWidth="1.5" />

              {/* Target Callout Pin Label */}
              <rect x="-40" y="-38" width="80" height="18" rx="4" fill="rgba(7, 13, 30, 0.9)" stroke={h.color} strokeWidth="1" />
              <text x="0" y="-25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {h.id}: {h.risk}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Info Tooltip Popup */}
      {hoveredPoint && (
        <div
          className="absolute z-30 bg-[#0f172a]/95 backdrop-blur-md border border-[#00e5ff]/40 p-3 rounded-lg shadow-2xl text-xs font-mono w-64 pointer-events-none"
          style={{ left: Math.min(hoveredPoint.x + 20, 680), top: Math.max(hoveredPoint.y - 60, 40) }}
        >
          <div className="flex items-center justify-between border-b border-[#00e5ff]/20 pb-1 mb-2">
            <span className="font-bold text-[#00e5ff]">{hoveredPoint.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              hoveredPoint.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {hoveredPoint.risk}% RISK
            </span>
          </div>
          <div className="space-y-1 text-gray-300 text-[11px]">
            <div><span className="text-gray-500">Status:</span> {hoveredPoint.status}</div>
            <div><span className="text-gray-500">GPS:</span> {hoveredPoint.lat}, {hoveredPoint.lng}</div>
            <div><span className="text-gray-500">AI Confidence:</span> {hoveredPoint.confidence}</div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Legend Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between bg-[#0f172a]/90 backdrop-blur-md border border-[#00e5ff]/20 px-4 py-2 rounded-lg text-xs font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping"></span>
            <span className="text-gray-300">Critical Mining (90%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-gray-300">Suspicious Activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-gray-300">Monitored Safe Zone</span>
          </div>
        </div>

        <div className="text-gray-400">
          MAP SCALE: <span className="text-[#00e5ff]">1:25,000</span> | MODE: <span className="text-emerald-400">TACTICAL GIS</span>
        </div>
      </div>
    </div>
  );
}
