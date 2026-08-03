import React from 'react';
import { Radio, Battery, ShieldAlert, Cpu, Video, Camera, FileCheck } from 'lucide-react';
import DroneHudOverlay from '../ui/DroneHudOverlay';

export default function DroneVerificationScreen() {
  const detectedObjects = [
    { type: 'CAT 320 Excavator', count: '2 Units', conf: '96.8%', gps: '11.3415° N, 77.7170° E', time: '14:32:08 IST', status: 'CRITICAL' },
    { type: 'Ashok Leyland Tipper Truck', count: '4 Units', conf: '94.2%', gps: '11.3418° N, 77.7175° E', time: '14:32:10 IST', status: 'HIGH' },
    { type: 'Illegal Dredging Vessel', count: '1 Unit', conf: '98.1%', gps: '11.3410° N, 77.7168° E', time: '14:32:05 IST', status: 'CRITICAL' },
    { type: 'Commercial Sand Stockpiles', count: '3 Mounds', conf: '92.4%', gps: '11.3422° N, 77.7180° E', time: '14:32:12 IST', status: 'MEDIUM' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Drone Telemetry Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20">
          <div className="text-gray-400 text-[10px] mb-1">ACTIVE DRONE UNIT</div>
          <div className="text-sm font-bold text-[#d9a441]">UAV-ALPHA-04 (Skydio X2)</div>
          <div className="text-[10px] text-emerald-400 mt-1">STATUS: SURVEILLANCE ACTIVE</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20">
          <div className="text-gray-400 text-[10px] mb-1">BATTERY & ALTITUDE</div>
          <div className="text-sm font-bold text-white">78% | ALT: 120m</div>
          <div className="text-[10px] text-gray-400 mt-1">5G TACTICAL LINK: 98%</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20">
          <div className="text-gray-400 text-[10px] mb-1">PAYLOAD SENSOR</div>
          <div className="text-sm font-bold text-white">FLIR Thermal + 4K Optical</div>
          <div className="text-[10px] text-gray-400 mt-1">DUAL CAMERA FEED</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20">
          <div className="text-gray-400 text-[10px] mb-1">OBJECTS DETECTED</div>
          <div className="text-sm font-bold text-red-400">10 Flagged Items</div>
          <div className="text-[10px] text-red-300 mt-1">2 EXCAVATORS / 1 DREDGER</div>
        </div>
      </div>

      {/* Main Section: Drone FLIR HUD Overlay Component */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#d9a441] flex items-center space-x-2">
          <Video className="w-4 h-4" />
          <span>LIVE DRONE HD FLIR THERMAL STREAM & AI BOUNDING BOXES</span>
        </h3>
        <DroneHudOverlay />
      </div>

      {/* AI Telemetry & Object Detection Log Table */}
      <div className="glass-card p-5 rounded-xl border border-[#d9a441]/20">
        <div className="flex items-center justify-between border-b border-[#d9a441]/20 pb-3 mb-4">
          <h4 className="text-sm font-bold text-[#d9a441]">REAL-TIME AI OBJECT DETECTION SUMMARY</h4>
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded text-[10px] font-bold">
            ILLEGAL EQUIPMENT DETECTED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 text-[11px]">
                <th className="pb-2">OBJECT TYPE</th>
                <th className="pb-2">QUANTITY</th>
                <th className="pb-2">CONFIDENCE</th>
                <th className="pb-2">TARGET GPS COORDINATES</th>
                <th className="pb-2">TIMESTAMP</th>
                <th className="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {detectedObjects.map((o, i) => (
                <tr key={i} className="hover:bg-[#3d2f23]/50">
                  <td className="py-2.5 font-bold text-white">{o.type}</td>
                  <td className="py-2.5 text-[#d9a441]">{o.count}</td>
                  <td className="py-2.5 text-emerald-400">{o.conf}</td>
                  <td className="py-2.5">{o.gps}</td>
                  <td className="py-2.5 text-gray-400">{o.time}</td>
                  <td className="py-2.5 text-right">
                    <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-2.5 py-1 rounded text-[10px] font-bold">
                      FLAG EVIDENCE
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
