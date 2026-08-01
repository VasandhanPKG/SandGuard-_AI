import React, { useState } from 'react';
import { Shield, Lock, User, Key, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('officer.rsharma@env.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [department, setDepartment] = useState('State Sand Mining Enforcement Cell');
  const [use2FA, setUse2FA] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070d1e] bg-radar-grid flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Top Security Classification Banner */}
      <div className="w-full max-w-4xl mx-auto bg-red-950/40 border border-red-500/50 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono text-red-300 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-bold">RESTRICTED ACCESS - OFFICIAL USE ONLY</span>
        </div>
        <span>MINISTRY OF ENVIRONMENT & FORESTS | GOVT OF INDIA</span>
      </div>

      {/* Main Centered Login Box */}
      <div className="w-full max-w-md mx-auto my-auto glass-card border border-[#00e5ff]/40 p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f172a] border-2 border-[#00e5ff] text-[#00e5ff] mb-4 glow-cyan">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">SANDSHIELD AI</h1>
          <p className="text-xs font-mono text-[#00e5ff] mt-1">Government Command & Control Environmental Intelligence</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">OFFICIAL EMAIL / BADGE ID</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070d1e] border border-[#00e5ff]/30 focus:border-[#00e5ff] text-white pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">SECURITY PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070d1e] border border-[#00e5ff]/30 focus:border-[#00e5ff] text-white pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">DEPARTMENT JURISDICTION</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#070d1e] border border-[#00e5ff]/30 focus:border-[#00e5ff] text-white pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all appearance-none cursor-pointer"
              >
                <option>State Sand Mining Enforcement Cell</option>
                <option>River Basin Management Authority</option>
                <option>National Green Tribunal Taskforce</option>
                <option>State Pollution Control Board</option>
              </select>
            </div>
          </div>

          {/* 2FA Option Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#070d1e]/80 border border-[#00e5ff]/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#00e5ff]" />
              <span className="text-gray-300 text-[11px]">Hardware 2FA / OTP Security</span>
            </div>
            <button
              type="button"
              onClick={() => setUse2FA(!use2FA)}
              className={`w-10 h-5 rounded-full transition-colors relative ${use2FA ? 'bg-[#00e5ff]' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${use2FA ? 'left-5' : 'left-0.5'}`}></span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 text-sm glow-cyan cursor-pointer mt-6"
          >
            <span>AUTHENTICATE & ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl mx-auto text-center text-[11px] font-mono text-gray-500 space-x-4">
        <span>ENCRYPTION: AES-256-GCM</span>
        <span>|</span>
        <span>SYSTEM STATUS: <strong className="text-emerald-400">ONLINE</strong></span>
        <span>|</span>
        <span>NODE: ISRO-SAT-09</span>
      </div>
    </div>
  );
}
