import React from 'react';

interface StatusBadgeProps {
  type: 'success' | 'critical' | 'warning';
  children: React.ReactNode;
}

export function StatusBadge({ type, children }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-500/20 border border-green-500/50 text-green-400 neon-glow-green',
    critical: 'bg-pink-500/20 border border-pink-500/50 text-pink-400 neon-glow-pink',
    warning: 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${variants[type]} transition-all hover:scale-105`}>
      <span className="text-xs">{children}</span>
    </span>
  );
}
