import React, { useState } from 'react';
import { Shield, Navigation, Camera, Mic, CheckCircle, Wifi, Radio, AlertOctagon, UploadCloud, MapPin, Check } from 'lucide-react';

export default function MobileFieldOfficerApp() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-md mx-auto min-h-[640px] bg-[#1b1610] border-4 border-[#d9a441]/50 rounded-[36px] overflow-hidden shadow-2xl font-mono text-xs text-white select-none flex flex-col justify-between p-4 relative">
      {/* Mobile Top Status Notch & App Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#d9a441]/30 pb-3 mb-3 pt-2 px-1">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#d9a441]" />
            <div>
              <div className="font-bold text-white text-xs">SAND GUARD MOBILE</div>
              <div className="text-[10px] text-gray-400">Officer R. Sharma | Unit 04</div>
            </div>
          </div>

          <div className="text-right text-[10px]">
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                offlineMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {offlineMode ? 'OFFLINE SYNC' : 'LIVE 5G'}
            </button>
            <div className="text-gray-400 mt-0.5">GPS: 3m LOCK</div>
          </div>
        </div>

        {/* Active Assigned Alert Dispatch Card */}
        <div className="bg-red-950/40 border border-red-500/60 p-4 rounded-2xl space-y-2 mb-4 glow-red">
          <div className="flex justify-between items-center">
            <span className="bg-red-500 text-black font-bold px-2 py-0.5 rounded text-[10px]">
              93% CRITICAL DISPATCH
            </span>
            <span className="text-gray-400 text-[10px]">4.2 km away</span>
          </div>

          <h3 className="font-bold text-white text-sm">Illegal Dredging in Progress</h3>
          <div className="text-gray-300 text-[11px] flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>Bhavani River Basin Sector 4B</span>
          </div>

          <button className="w-full mt-2 bg-[#d9a441] hover:bg-[#8aa48f] text-black font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2 text-xs cursor-pointer shadow-lg">
            <Navigation className="w-4 h-4" />
            <span>START GPS NAVIGATION TO HOTSPOT</span>
          </button>
        </div>

        {/* Tactical Ground Inspection Module */}
        <div className="glass-card p-4 rounded-2xl border border-[#d9a441]/30 space-y-3">
          <div className="text-xs font-bold text-[#d9a441] uppercase border-b border-[#d9a441]/20 pb-2">
            FIELD EVIDENCE CAPTURE
          </div>

          {/* Evidence Photo Upload Mock */}
          <div className="space-y-2">
            <button
              onClick={() => setPhotoCaptured(true)}
              className="w-full bg-[#1b1610] border border-[#d9a441]/40 hover:border-[#d9a441] text-gray-200 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#d9a441]" />
              <span>{photoCaptured ? 'PHOTO CAPTURED (GEOTAGGED)' : 'CAPTURE GEOTAGGED EVIDENCE PHOTO'}</span>
            </button>

            {photoCaptured && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-emerald-300">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>CAT 320 Excavator Photo (GPS Embedded)</span>
                </div>
                <span className="text-[10px] text-gray-400">14:32 IST</span>
              </div>
            )}
          </div>

          {/* Machinery Inspection Checklist */}
          <div className="space-y-1.5 pt-1 text-gray-300 text-[11px]">
            <div className="text-gray-400 text-[10px]">MACHINERY DISCOVERY CHECKLIST:</div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#d9a441]" />
              <span>CAT Excavators (2 Units Found)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#d9a441]" />
              <span>Suction Dredging Vessel (1 Unit Found)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#d9a441]" />
              <span>Tipper Dump Trucks (4 Units Scanned)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Submit Inspection CTA */}
      <div className="pt-3">
        {submitted ? (
          <div className="bg-emerald-500 text-black font-bold py-3 rounded-xl text-center text-xs flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>INSPECTION REPORT SYNCED TO COMMAND CENTER</span>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-xs cursor-pointer shadow-lg"
          >
            <UploadCloud className="w-4 h-4" />
            <span>SUBMIT FIELD VERIFICATION REPORT</span>
          </button>
        )}
      </div>
    </div>
  );
}
