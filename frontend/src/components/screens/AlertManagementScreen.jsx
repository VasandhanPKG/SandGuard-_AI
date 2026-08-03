import React, { useState } from 'react';
import { AlertOctagon, Filter, CheckCircle2, UserCheck, XCircle, MapPin, Eye, FileText } from 'lucide-react';

export default function AlertManagementScreen({ onNavigate }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState({
    id: 'ALT-9942',
    title: 'Unauthorised Suction Dredging & Heavy Extraction',
    location: 'Bhavani River Basin - Sector 4B',
    lat: '11.3412° N',
    lng: '77.7172° E',
    risk: 93,
    severity: 'CRITICAL',
    time: '14:22 IST (12 Mins Ago)',
    assigned: 'Unassigned',
    evidence: [
      { name: 'Satellite Surface Change Delta', detail: '85% alteration vs baseline' },
      { name: 'Drone FLIR Thermal Video', detail: 'CAT 320 Excavator + Dredging Barge' },
      { name: 'ANPR Tollgate OCR Log', detail: 'Plate TN52 AB4321 (15 trips)' }
    ],
    timeline: [
      { time: '14:10 IST', text: 'Sentinel-2A satellite pass flagged 85% surface anomaly' },
      { time: '14:15 IST', text: 'ANPR Tollgate Gate 03 detected 15 tipper truck passes' },
      { time: '14:20 IST', text: 'Skydio UAV-ALPHA-04 dispatched automatically' },
      { time: '14:22 IST', text: 'AI Risk Engine assigned 93% Critical Risk score' }
    ]
  });

  const alertList = [
    {
      id: 'ALT-9942',
      title: 'Unauthorised Suction Dredging & Heavy Extraction',
      location: 'Bhavani River Sector 4B',
      risk: 93,
      severity: 'CRITICAL',
      time: '12m ago'
    },
    {
      id: 'ALT-9941',
      title: 'Night Tipper Convoy Anomaly (15 Trips)',
      location: 'Cauvery River North Bank',
      risk: 84,
      severity: 'HIGH',
      time: '45m ago'
    },
    {
      id: 'ALT-9939',
      title: 'Riverbank Vegetation Buffer Clearing',
      location: 'Palar River Basin Sector 1C',
      risk: 68,
      severity: 'MEDIUM',
      time: '2h ago'
    },
    {
      id: 'ALT-9934',
      title: 'Unregistered Machinery Stockpile',
      location: 'Cauvery River South Buffer',
      risk: 42,
      severity: 'LOW',
      time: '5h ago'
    }
  ];

  const filteredAlerts = alertList.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      {/* Alert Severity Filter Tabs Header */}
      <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#d9a441]" />
          <span className="text-gray-300 font-bold">INCIDENT SEVERITY TRIAGE:</span>
        </div>

        <div className="flex space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filter === f
                  ? 'bg-[#d9a441] text-black border-[#d9a441]'
                  : 'bg-[#1b1610] text-gray-400 border-gray-800 hover:border-[#d9a441]/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section: Alert Master Queue + Selected Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Master Alert Queue */}
        <div className="glass-card p-4 rounded-xl border border-[#d9a441]/20 space-y-3">
          <div className="border-b border-[#d9a441]/20 pb-2 flex justify-between items-center text-gray-400">
            <span className="font-bold text-[#d9a441]">ALERT QUEUE ({filteredAlerts.length})</span>
            <span>SORT: SEVERITY</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredAlerts.map(a => (
              <div
                key={a.id}
                onClick={() => setSelectedAlert(a)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedAlert?.id === a.id
                    ? 'bg-[#3d2f23] border-[#d9a441] glow-cyan'
                    : 'bg-[#1b1610] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white text-xs">{a.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    a.severity === 'CRITICAL' ? 'bg-red-500 text-black' :
                    a.severity === 'HIGH' ? 'bg-amber-500 text-black' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {a.risk}% {a.severity}
                  </span>
                </div>
                <div className="text-gray-400 text-[11px] mb-1">{a.location}</div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                  <span>ID: {a.id}</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Selected Incident Workspace */}
        {selectedAlert && (
          <div className="lg:col-span-2 glass-card p-5 rounded-xl border border-[#d9a441]/30 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-[#d9a441]/20 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    <span>INCIDENT DOSSIER: {selectedAlert.id}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{selectedAlert.title}</p>
                </div>

                <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded font-bold text-xs">
                  {selectedAlert.risk}% {selectedAlert.severity}
                </span>
              </div>

              {/* Location & Coordinates */}
              <div className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/20 mb-4 flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-[10px]">LOCATION</div>
                  <div className="text-white font-bold">{selectedAlert.location}</div>
                </div>
                <div className="text-emerald-400 font-mono text-xs">{selectedAlert.lat || '11.3412° N'}, {selectedAlert.lng || '77.7172° E'}</div>
              </div>

              {/* Multi-Sensor Evidence Matrix */}
              <div className="space-y-3 mb-5">
                <div className="text-gray-400 text-[10px] uppercase">MULTI-SENSOR EVIDENCE GALLERY</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/20 text-center">
                    <div className="text-gray-500 text-[10px]">SATELLITE CHANGE</div>
                    <div className="text-[#d9a441] font-bold text-xs mt-1">85% Surface Shift</div>
                  </div>
                  <div className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/20 text-center">
                    <div className="text-gray-500 text-[10px]">DRONE FLIR RECON</div>
                    <div className="text-red-400 font-bold text-xs mt-1">CAT 320 Excavator</div>
                  </div>
                  <div className="bg-[#1b1610] p-3 rounded-lg border border-[#d9a441]/20 text-center">
                    <div className="text-gray-500 text-[10px]">ANPR CAMERA SCAN</div>
                    <div className="text-amber-400 font-bold text-xs mt-1">TN52 AB4321 (15 Trips)</div>
                  </div>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-2 mb-4">
                <div className="text-gray-400 text-[10px] uppercase">INCIDENT AUDIT TIMELINE</div>
                <div className="space-y-1.5 border-l-2 border-[#d9a441]/40 pl-3">
                  {selectedAlert.timeline?.map((t, i) => (
                    <div key={i} className="text-[11px] text-gray-300">
                      <strong className="text-[#d9a441]">{t.time}:</strong> {t.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enforcement Action Dispatch Toolbar */}
            <div className="pt-4 border-t border-[#d9a441]/20 flex flex-wrap gap-3">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                <span>APPROVE INSPECTION</span>
              </button>

              <button className="flex-1 bg-[#d9a441] hover:bg-[#8aa48f] text-black font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <UserCheck className="w-4 h-4" />
                <span>ASSIGN FIELD OFFICER</span>
              </button>

              <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors">
                <XCircle className="w-4 h-4" />
                <span>CLOSE ALERT</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
