import React, { useState } from 'react';
import { Layers, MapPin, ShieldAlert, FileText, UserPlus, History, ChevronRight, Eye } from 'lucide-react';
import GisMapCanvas from '../ui/GisMapCanvas';

export default function GisMonitoringScreen({ onNavigate }) {
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    drones: true,
    cameras: true,
    miningZones: true,
    riverBoundaries: true,
    heatmap: true
  });

  const [selectedHotspot, setSelectedHotspot] = useState({
    id: 'Delta-7',
    name: 'Bhavani River Sector 4B',
    lat: '11.3412° N',
    lng: '77.7172° E',
    risk: 93,
    satelliteChange: 85,
    droneDetect: 92,
    vehicleAnomaly: 88,
    vegLoss: 40,
    status: 'CRITICAL HIGH RISK'
  });

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] flex flex-col font-mono select-none">
      {/* Main Full-Screen GIS Map Viewport */}
      <div className="relative w-full h-full flex-1">
        <GisMapCanvas
          height="h-full"
          activeLayers={activeLayers}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
        />

        {/* Layer Control Floating Panel (Top-Left Widget) */}
        <div className="absolute top-16 left-6 z-30 bg-[#2d2418]/95 backdrop-blur-md border border-[#d9a441]/30 p-4 rounded-xl shadow-2xl w-64 text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#d9a441]/20 pb-2 text-[#d9a441] font-bold">
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>GIS MAP LAYERS</span>
            </span>
          </div>

          {[
            { key: 'satellite', label: 'Satellite Imagery (Sentinel-2)' },
            { key: 'drones', label: 'Drone Surveillance Feeds' },
            { key: 'cameras', label: 'ANPR Road Cameras' },
            { key: 'miningZones', label: 'Authorised Mining Zones' },
            { key: 'riverBoundaries', label: 'River Basin Boundaries' },
            { key: 'heatmap', label: 'Environmental Risk Heatmap' }
          ].map(l => (
            <label key={l.key} className="flex items-center space-x-2.5 text-gray-300 hover:text-white cursor-pointer py-1">
              <input
                type="checkbox"
                checked={activeLayers[l.key]}
                onChange={() => toggleLayer(l.key)}
                className="rounded accent-[#d9a441]"
              />
              <span>{l.label}</span>
            </label>
          ))}
        </div>

        {/* Intelligence Overlay Drawer (Right Sliding Panel) */}
        {selectedHotspot && (
          <div className="absolute top-16 right-6 bottom-16 z-30 bg-[#2d2418]/95 backdrop-blur-md border border-[#d9a441]/40 p-5 rounded-xl shadow-2xl w-80 text-xs flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#d9a441]/20 pb-3 mb-4">
                <div className="flex items-center space-x-2 text-red-400 font-bold">
                  <ShieldAlert className="w-5 h-5" />
                  <span>HOTSPOT DOSSIER</span>
                </div>
                <span className="text-gray-400 font-bold">{selectedHotspot.id}</span>
              </div>

              <div className="space-y-4">
                {/* Location Lat/Long */}
                <div className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/20">
                  <div className="text-gray-400 text-[10px] uppercase">TARGET GEOLOCATION</div>
                  <div className="text-white font-bold text-sm mt-0.5">{selectedHotspot.name}</div>
                  <div className="text-emerald-400 text-[11px] mt-1 font-mono">{selectedHotspot.lat}, {selectedHotspot.lng}</div>
                </div>

                {/* Multi-Modal Evidence Breakdown */}
                <div>
                  <div className="text-gray-400 text-[10px] uppercase mb-2">DETECTION EVIDENCE BREAKDOWN</div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>Satellite Change Index</span>
                        <span className="text-[#d9a441] font-bold">{selectedHotspot.satelliteChange || 85}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d9a441]" style={{ width: `${selectedHotspot.satelliteChange || 85}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>Drone Recon Detection</span>
                        <span className="text-[#d9a441] font-bold">{selectedHotspot.droneDetect || 92}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d9a441]" style={{ width: `${selectedHotspot.droneDetect || 92}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>ANPR Vehicle Anomaly</span>
                        <span className="text-amber-400 font-bold">{selectedHotspot.vehicleAnomaly || 88}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${selectedHotspot.vehicleAnomaly || 88}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>Vegetation Loss Index</span>
                        <span className="text-red-400 font-bold">{selectedHotspot.vegLoss || 40}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400" style={{ width: `${selectedHotspot.vegLoss || 40}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Composite AI Risk Badge */}
                <div className="bg-red-950/40 border border-red-500/60 p-4 rounded-xl text-center glow-red">
                  <div className="text-red-300 text-[10px] uppercase font-bold">COMPOSITE AI RISK ASSESSMENT</div>
                  <div className="text-3xl font-extrabold text-red-400 mt-1">{selectedHotspot.risk}% HIGH</div>
                  <div className="text-red-300 text-[10px] mt-1">CONFIDENCE: 95.4% MATCH</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <button
                onClick={() => onNavigate && onNavigate('reports')}
                className="w-full bg-[#d9a441] text-black font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#8aa48f] transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>GENERATE REPORT</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('alerts')}
                className="w-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-500/30 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>ASSIGN FIELD OFFICER</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('satellite')}
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
              >
                <History className="w-4 h-4" />
                <span>VIEW HISTORY TIMELINE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
