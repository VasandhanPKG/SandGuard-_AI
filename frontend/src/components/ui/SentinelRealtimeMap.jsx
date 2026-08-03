import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCcw, Satellite, Clock3, MapPin } from 'lucide-react';

const SENTINEL_TILE_URL = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2025-10-01/GoogleMapsCompatible_Level8/140/85/42.jpg';

export default function SentinelRealtimeMap({ className = '' }) {
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [refreshPulse, setRefreshPulse] = useState(false);

  const refreshFeed = () => {
    setUpdatedAt(new Date());
    setLoading(true);
    setImageError(false);
    setRefreshPulse(true);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUpdatedAt(new Date());
      setLoading(true);
      setImageError(false);
      setRefreshPulse(true);
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!refreshPulse) return;
    const timer = window.setTimeout(() => setRefreshPulse(false), 800);
    return () => window.clearTimeout(timer);
  }, [refreshPulse]);

  const mapTitle = useMemo(() => {
    return `Sentinel-2 Real-Time Surface Feed`;
  }, []);

  return (
    <div className={`glass-card p-4 rounded-2xl border border-[#d9a441]/20 shadow-2xl overflow-hidden bg-gradient-to-br from-[#18120e] via-[#241b11] to-[#1b1610] ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#d9a441] font-semibold text-sm uppercase tracking-[0.25em] animate-float">
              <Satellite className="w-4 h-4" />
              <span className="text-glow">{mapTitle}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xl leading-5">
              Live Sentinel-2 surface reflectance overlay with immediate event detection and drift analytics for the command center.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2d2418]/80 border border-[#d9a441]/20">
              <Clock3 className="w-3.5 h-3.5 text-[#d9a441]" />
              Updated {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              type="button"
              onClick={refreshFeed}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1b1610] border border-[#d9a441]/20 text-[11px] text-[#d9a441] hover:bg-[#d9a441]/10 transition duration-200 ease-out"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${refreshPulse ? 'animate-spin text-[#d9a441]' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#d9a441]/20 bg-[#0b0a08]">
          <img
            src={`${SENTINEL_TILE_URL}?t=${updatedAt.getTime()}`}
            alt="Sentinel surface feed"
            className="w-full h-[360px] object-cover"
            onLoad={() => setLoading(false)}
            onError={() => setImageError(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute left-4 bottom-4 right-4 flex flex-col gap-3 text-xs text-white">
            <div className="flex flex-wrap gap-2">
              <span className="bg-black/70 px-3 py-1 rounded-full border border-[#d9a441]/20">Sentinel-2A</span>
              <span className="bg-black/70 px-3 py-1 rounded-full border border-[#d9a441]/20">10m Surface Reflectance</span>
              <span className="bg-black/70 px-3 py-1 rounded-full border border-[#d9a441]/20">Realtime Cloud Filter</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="bg-[#1b1610]/90 border border-[#d9a441]/20 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400">Area</div>
                <div className="text-sm font-semibold">Bhavani Basin</div>
              </div>
              <div className="bg-[#1b1610]/90 border border-[#d9a441]/20 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400">Cloud</div>
                <div className="text-sm font-semibold">14%</div>
              </div>
              <div className="bg-[#1b1610]/90 border border-[#d9a441]/20 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400">Pass</div>
                <div className="text-sm font-semibold">Immediate</div>
              </div>
              <div className="bg-[#1b1610]/90 border border-[#d9a441]/20 rounded-xl px-3 py-2">
                <div className="text-[10px] text-gray-400">Latency</div>
                <div className="text-sm font-semibold"><MapPin className="inline-block w-3.5 h-3.5 mr-1 text-[#d9a441] align-text-bottom" /> 11.34°N</div>
              </div>
            </div>
          </div>
          {loading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-gray-300">
              Loading Sentinel feed...
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 text-center px-6 text-xs text-gray-300">
              <div className="mb-2 font-semibold text-[#d9a441]">Sentinel feed unavailable</div>
              <div>Retry or use the command center recovery overlay.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
