import React from 'react';
import { Card } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, FileText, AlertTriangle } from 'lucide-react';

export function AnalyticsView() {
  // Monthly trends data
  const monthlyData = [
    { month: 'May', reports: 45, highRisk: 12, avgAccuracy: 89 },
    { month: 'Jun', reports: 52, highRisk: 15, avgAccuracy: 91 },
    { month: 'Jul', reports: 48, highRisk: 11, avgAccuracy: 90 },
    { month: 'Aug', reports: 61, highRisk: 18, avgAccuracy: 92 },
    { month: 'Sep', reports: 58, highRisk: 14, avgAccuracy: 94 },
    { month: 'Oct', reports: 67, highRisk: 19, avgAccuracy: 93 }
  ];

  // Disease distribution data
  const diseaseData = [
    { name: 'Diabetes', value: 35, color: '#b400ff' },
    { name: 'Hypertension', value: 28, color: '#ff0099' },
    { name: 'Cardiovascular', value: 22, color: '#ff9500' },
    { name: 'Kidney Disease', value: 15, color: '#00ff41' }
  ];

  // Risk distribution
  const riskData = [
    { name: 'Low Risk', value: 78, color: '#00ff41' },
    { name: 'Moderate Risk', value: 26, color: '#ffea00' },
    { name: 'High Risk', value: 23, color: '#ff0099' }
  ];

  // Feature importance across all analyses
  const featureData = [
    { feature: 'Blood Pressure', importance: 92 },
    { feature: 'Glucose Level', importance: 88 },
    { feature: 'BMI', importance: 76 },
    { feature: 'Age', importance: 71 },
    { feature: 'Cholesterol', importance: 68 },
    { feature: 'Family History', importance: 64 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-cyan-400 neon-text-cyan">Analytics Dashboard</h2>
        <p className="text-sm text-gray-400 mt-2">Comprehensive insights and trends from medical AI analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-black/60 border border-purple-500/30 backdrop-blur-xl neon-glow-purple hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Analyses</p>
              <h3 className="text-purple-400 mb-2">331</h3>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow-purple">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-cyan-500/30 backdrop-blur-xl neon-glow-cyan hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Unique Patients</p>
              <h3 className="text-cyan-400 mb-2">284</h3>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp size={14} />
                <span>+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow-cyan">
              <Users size={24} className="text-black" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-green-500/30 backdrop-blur-xl neon-glow-green hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg. Accuracy</p>
              <h3 className="text-green-400 mb-2">92.8%</h3>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp size={14} />
                <span>+2.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center neon-glow-green">
              <Activity size={24} className="text-black" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-pink-500/30 backdrop-blur-xl neon-glow-pink hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">High Risk Cases</p>
              <h3 className="text-pink-400 mb-2">89</h3>
              <div className="flex items-center gap-1 text-pink-400 text-sm">
                <TrendingDown size={14} />
                <span>-3.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center neon-glow-pink">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-cyan">
          <h3 className="text-cyan-400 neon-text-cyan mb-6">Monthly Analysis Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="#00f0ff" 
                strokeWidth={3}
                dot={{ fill: '#00f0ff', r: 4 }}
                name="Total Reports"
              />
              <Line 
                type="monotone" 
                dataKey="highRisk" 
                stroke="#ff0099" 
                strokeWidth={3}
                dot={{ fill: '#ff0099', r: 4 }}
                name="High Risk"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Disease Distribution */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-pink">
          <h3 className="text-pink-400 neon-text-pink mb-6">Disease Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 0, 153, 0.3)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple">
          <h3 className="text-purple-400 mb-6">Top Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="feature" type="category" width={120} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(180, 0, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="importance" fill="url(#colorGradient)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b400ff" />
                  <stop offset="100%" stopColor="#ff0099" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Level Distribution */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-green">
          <h3 className="text-green-400 neon-text-green mb-6">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Accuracy Trend */}
      <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-green">
        <h3 className="text-green-400 neon-text-green mb-6">Model Accuracy Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[85, 95]} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 65, 0.3)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="avgAccuracy" fill="url(#accuracyGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff41" />
                <stop offset="100%" stopColor="#00ff41" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
