import React from 'react';
import { Card } from './ui/card';

interface FeatureImportance {
  name: string;
  value: number;
  color: string;
}

interface PredictionCardProps {
  riskPercentage: number;
  features: FeatureImportance[];
  onRun: () => void; // <-- NEW
}

export function PredictionCard({ riskPercentage, features, onRun }: PredictionCardProps) {
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (riskPercentage / 100) * circumference;

  return (
    <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-pink hover:neon-glow-pink transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-pink-400 neon-text-pink">Disease Risk Prediction</h3>
        <div className="px-3 py-1 bg-pink-500/20 border border-pink-500/50 text-pink-400 text-xs rounded-full neon-glow-pink">
          {riskPercentage >= 70 ? "High Risk" : "Moderate"}
        </div>
      </div>

      {/* Risk Gauge */}
      <div className="flex justify-center mb-8">
        <div className="relative w-52 h-52">
          <svg className="w-52 h-52 transform -rotate-90 relative z-10">
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="20"
              fill="none"
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0099" />
                <stop offset="50%" stopColor="#ff9500" />
                <stop offset="100%" stopColor="#ffea00" />
              </linearGradient>
            </defs>
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="url(#gaugeGradient)"
              strokeWidth="20"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl text-pink-400 neon-text-pink">
              {riskPercentage}%
            </div>
            <div className="text-sm text-gray-400 mt-2">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="space-y-4">
        <h4 className="text-sm text-gray-300 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
          Feature Importance
        </h4>

        {features.map((feature, index) => (
          <div key={index} className="space-y-2 group">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">{feature.name}</span>
              <span className="text-sm text-gray-300">{feature.value}%</span>
            </div>

            <div className="w-full bg-black/40 border border-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${feature.value}%`,
                  background: feature.color,
                  boxShadow: `0 0 10px ${feature.color}80`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Button triggers API call */}
      <button
        onClick={onRun}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all neon-glow-pink hover:scale-[1.02]"
      >
        Run Disease Prediction Analysis
      </button>
    </Card>
  );
}
