import React, { useState } from 'react';
import { Sliders, Layers, Eye, Calendar, Sparkles } from 'lucide-react';

export default function ImageCompareSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPosition(pos);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="relative w-full h-[460px] bg-[#1b1610] rounded-xl overflow-hidden border border-[#d9a441]/30 shadow-2xl select-none">
      {/* Top Header Labels */}
      <div className="absolute top-4 left-4 z-20 bg-[#2d2418]/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded text-xs font-mono text-emerald-400 flex items-center space-x-2">
        <Calendar className="w-3.5 h-3.5" />
        <span>HISTORICAL BASELINE: 15 JAN 2026</span>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-[#2d2418]/90 backdrop-blur-md border border-red-500/40 px-3 py-1.5 rounded text-xs font-mono text-red-400 flex items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>CURRENT TARGET: 28 JUL 2026 (AI DETECTED)</span>
      </div>

      {/* Main Container Viewport for Dragging */}
      <div
        className="relative w-full h-full cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Underneath Layer: CURRENT ALTERED SATELLITE IMAGE (Right/Full) */}
        <div className="absolute inset-0 bg-[#0c1836] flex items-center justify-center p-6">
          <svg className="w-full h-full" viewBox="0 0 800 400">
            {/* Dark Damaged Terrain Background */}
            <rect width="800" height="400" fill="#081026" />
            {/* Stripped Brown Muddy Riverbank Areas */}
            <path d="M 100,0 C 250,150 450,220 700,400 L 800,400 L 800,0 Z" fill="#2d1b0f" opacity="0.8" />
            {/* Turbid Muddy River Flow */}
            <path d="M 0,100 Q 300,180 520,280 T 800,260" fill="none" stroke="#785938" strokeWidth="60" opacity="0.9" />
            <path d="M 0,100 Q 300,180 520,280 T 800,260" fill="none" stroke="#d97706" strokeWidth="12" strokeDasharray="10,6" opacity="0.6" />

            {/* AI Highlight Pits & Excavations (Red / Cyan outlines) */}
            <rect x="420" y="220" width="80" height="50" fill="rgba(239, 68, 68, 0.25)" stroke="#c94c2b" strokeWidth="2" strokeDasharray="4,4" />
            <text x="460" y="250" textAnchor="middle" fill="#c94c2b" fontSize="10" fontWeight="bold" fontFamily="monospace">PIT #1: 18,500m²</text>

            <circle cx="580" cy="300" r="45" fill="rgba(239, 68, 68, 0.2)" stroke="#d9a441" strokeWidth="2" strokeDasharray="4,4" />
            <text x="580" y="305" textAnchor="middle" fill="#d9a441" fontSize="10" fontWeight="bold" fontFamily="monospace">DREDGE ZONE</text>

            {/* Vegetation Loss Highlight Overlay (Striped Red) */}
            <path d="M 300,120 L 400,100 L 450,180 L 350,190 Z" fill="rgba(239, 68, 68, 0.3)" stroke="#c94c2b" strokeWidth="1.5" />
            <text x="375" y="145" textAnchor="middle" fill="#f8fafc" fontSize="9" fontFamily="monospace">CANOPY LOSS: -3.4 Ha</text>
          </svg>
        </div>

        {/* Overlay Layer: HISTORICAL BASELINE SATELLITE IMAGE (Left, Clipped by Slider) */}
        <div
          className="absolute inset-0 bg-[#14100a] overflow-hidden border-r-2 border-[#d9a441]"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="w-full h-full min-w-[800px] flex items-center justify-center p-6">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Lush Pristine Environment Background */}
              <rect width="800" height="400" fill="#051c14" />
              {/* Dense Green Forest Canopy */}
              <path d="M 100,0 C 250,150 450,220 700,400 L 800,400 L 800,0 Z" fill="#0d402b" opacity="0.9" />
              {/* Clean Blue Natural River Flow */}
              <path d="M 0,100 Q 300,180 520,280 T 800,260" fill="none" stroke="#0284c7" strokeWidth="50" opacity="0.9" />
              <path d="M 0,100 Q 300,180 520,280 T 800,260" fill="none" stroke="#8aa48f" strokeWidth="8" opacity="0.8" />

              <text x="350" y="200" textAnchor="middle" fill="#8aa48f" fontSize="12" fontWeight="bold" fontFamily="monospace">
                NATURAL RIVERBANK CANOPY (INTACT)
              </text>
            </svg>
          </div>
        </div>

        {/* Split Divider Line & Drag Handle Button */}
        <div
          className="absolute top-0 bottom-0 z-30 w-1 bg-[#d9a441] cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-[#2d2418] border-2 border-[#d9a441] shadow-lg flex items-center justify-center text-[#d9a441]">
            <Sliders className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      {/* Bottom Slider Helper Telemetry */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between bg-[#2d2418]/90 backdrop-blur-md border border-[#d9a441]/20 px-4 py-2 rounded-lg text-xs font-mono text-gray-300">
        <span>DRAG SLIDER TO COMPARE SATELLITE PASSES</span>
        <span className="text-[#d9a441]">SENTINEL-2 MULTISPECTRAL FUSION (10m RESOLUTION)</span>
      </div>
    </div>
  );
}
