import React from "react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Activity,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "#00f0ff",
      glowClass: "neon-glow-cyan",
    },
    {
      id: "patients",
      label: "Patients",
      icon: Activity,
      color: "#00ff41",
      glowClass: "neon-glow-green",
    },
    {
      id: "upload",
      label: "Upload Report",
      icon: Upload,
      color: "#b400ff",
      glowClass: "neon-glow-purple",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      color: "#ffea00",
      glowClass: "neon-glow-cyan",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "#ff9500",
      glowClass: "neon-glow-pink",
    },
    {
      id: "compare",
      label: "Compare",
      icon: ArrowLeftRight,
      color: "#b400ff",
      glowClass: "neon-glow-purple",
    },
    {
      id: "activity",
      label: "Activity",
      icon: Sparkles,
      color: "#ff0099",
      glowClass: "neon-glow-pink",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "#ffffff",
      glowClass: "neon-glow-cyan",
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      color: "#00f0ff",
      glowClass: "neon-glow-cyan",
    },
  ];

  return (
    <div className="w-64 bg-black/80 backdrop-blur-xl border-r neon-border-cyan h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow-cyan animate-neon-pulse">
            <Activity size={24} className="text-black" />
          </div>
          <div>
            <h2 className="text-cyan-400 neon-text-cyan">
              Medical AI
            </h2>
            <div className="flex items-center gap-1">
              <Sparkles size={10} className="text-pink-400" />
              <span className="text-xs text-gray-400">
                Insights
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                isActive
                  ? `bg-black/60 border ${item.glowClass} transform scale-105`
                  : "text-gray-400 hover:bg-black/40 hover:text-white border border-transparent hover:border-gray-700"
              }`}
              style={isActive ? { borderColor: item.color + '80' } : {}}
            >
              {isActive && (
                <div className="absolute inset-0 opacity-20 animate-pulse" style={{ backgroundColor: item.color }} />
              )}
              <Icon size={20} className="relative z-10" style={isActive ? { color: item.color } : {}} />
              <span className="text-sm relative z-10" style={isActive ? { color: item.color } : {}}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-cyan-500/30 hover:neon-glow-cyan transition-all cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-black neon-glow-cyan">
            <span className="text-sm">DR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">
              Dr. Gavarkar
            </p>
            <p className="text-xs text-gray-400 truncate">
              doctor@hospital.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}