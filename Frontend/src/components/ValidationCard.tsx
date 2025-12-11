import React from 'react';
import { Card } from './ui/card';
import { StatusBadge } from './StatusBadge';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Issue {
  type: 'critical' | 'success' | 'warning';
  label: string;
  field: string;
  action: string;
}

interface ValidationCardProps {
  issues: Issue[];
  validPercentage: number;
  invalidPercentage: number;
}

export function ValidationCard({ issues, validPercentage, invalidPercentage }: ValidationCardProps) {
  // Calculate donut chart values
  const total = validPercentage + invalidPercentage;
  const validAngle = (validPercentage / total) * 360;
  
  return (
    <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-green hover:neon-glow-green transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 neon-text-green">Data Validation</h3>
        <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs rounded-full neon-glow-green">
          {validPercentage}% Valid
        </div>
      </div>
      
      {/* Data Integrity Chart */}
      <div className="flex justify-center mb-8">
        <div className="relative w-52 h-52">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
          <svg className="w-52 h-52 transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="validGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff41" />
                <stop offset="100%" stopColor="#00ff41" />
              </linearGradient>
              <linearGradient id="invalidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0099" />
                <stop offset="100%" stopColor="#ff0099" />
              </linearGradient>
              <filter id="neonGlowValid">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Valid data (green) */}
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="url(#validGradient)"
              strokeWidth="26"
              fill="none"
              strokeDasharray={`${(validPercentage / 100) * 534} 534`}
              filter="url(#neonGlowValid)"
            />
            {/* Invalid data (pink) */}
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="url(#invalidGradient)"
              strokeWidth="26"
              fill="none"
              strokeDasharray={`${(invalidPercentage / 100) * 534} 534`}
              strokeDashoffset={-((validPercentage / 100) * 534)}
              filter="url(#neonGlowValid)"
            />
          </svg>
          {/* Center legend */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl text-green-400 neon-text-green">{validPercentage}%</div>
            <div className="text-sm text-gray-400 mt-2">Valid</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-green-500/30 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-green-400 neon-glow-green" />
          <span className="text-sm text-gray-300">Valid ({validPercentage}%)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-pink-500/30 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-pink-500 neon-glow-pink" />
          <span className="text-sm text-gray-300">Invalid ({invalidPercentage}%)</span>
        </div>
      </div>

      {/* Inconsistency Table */}
      <div className="space-y-3">
        <h4 className="text-sm text-gray-300 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-500 rounded-full neon-glow-green" />
          Validation Issues
        </h4>
        <div className="border border-green-500/20 rounded-xl overflow-hidden bg-black/30">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 bg-black/60 border-b border-green-500/20 px-4 py-3">
            <div className="text-xs text-gray-400">Issue</div>
            <div className="text-xs text-gray-400">Field</div>
            <div className="text-xs text-gray-400">Action</div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-gray-800/50">
            {issues.map((issue, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 px-4 py-3 hover:bg-green-500/5 transition-all group">
                <div className="flex items-center">
                  <StatusBadge type={issue.type}>{issue.label}</StatusBadge>
                </div>
                <div className="text-sm text-gray-400 flex items-center group-hover:text-gray-300">{issue.field}</div>
                <div className="text-sm text-cyan-400 flex items-center hover:text-cyan-300 cursor-pointer">
                  {issue.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all neon-glow-green hover:scale-[1.02] transform">
        Validate All Records
      </button>
    </Card>
  );
}
