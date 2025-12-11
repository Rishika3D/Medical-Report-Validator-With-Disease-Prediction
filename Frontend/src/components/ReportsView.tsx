import React, { useState } from 'react';
import { Card } from './ui/card';
import { FileText, Download, Eye, Filter, Calendar, User, TrendingUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Report {
  id: string;
  patientName: string;
  reportType: string;
  date: string;
  riskLevel: 'critical' | 'warning' | 'success';
  status: string;
  accuracy: number;
}

export function ReportsView() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reports: Report[] = [
    {
      id: 'RPT-001',
      patientName: 'John Anderson',
      reportType: 'Diabetes Risk Assessment',
      date: '2025-10-20',
      riskLevel: 'critical',
      status: 'High Risk',
      accuracy: 94
    },
    {
      id: 'RPT-002',
      patientName: 'Sarah Mitchell',
      reportType: 'Cardiovascular Analysis',
      date: '2025-10-19',
      riskLevel: 'warning',
      status: 'Moderate Risk',
      accuracy: 87
    },
    {
      id: 'RPT-003',
      patientName: 'Michael Chen',
      reportType: 'General Health Screening',
      date: '2025-10-18',
      riskLevel: 'success',
      status: 'Low Risk',
      accuracy: 96
    },
    {
      id: 'RPT-004',
      patientName: 'Emily Davis',
      reportType: 'Hypertension Risk',
      date: '2025-10-17',
      riskLevel: 'critical',
      status: 'High Risk',
      accuracy: 91
    },
    {
      id: 'RPT-005',
      patientName: 'Robert Wilson',
      reportType: 'Kidney Function Analysis',
      date: '2025-10-16',
      riskLevel: 'success',
      status: 'Normal',
      accuracy: 98
    },
    {
      id: 'RPT-006',
      patientName: 'Lisa Thompson',
      reportType: 'Diabetes Risk Assessment',
      date: '2025-10-15',
      riskLevel: 'warning',
      status: 'Moderate Risk',
      accuracy: 89
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-black/60 border border-purple-500/30 backdrop-blur-xl neon-glow-purple hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Reports</p>
              <h3 className="text-purple-400 mb-0">127</h3>
            </div>
            <div className="w-12 h-12 bg-black/40 border border-purple-500/30 rounded-xl flex items-center justify-center neon-glow-purple">
              <FileText size={24} className="text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-green-500/30 backdrop-blur-xl neon-glow-green hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Low Risk</p>
              <h3 className="text-green-400 mb-0">78</h3>
            </div>
            <div className="w-12 h-12 bg-black/40 border border-green-500/30 rounded-xl flex items-center justify-center neon-glow-green">
              <TrendingUp size={24} className="text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-pink-500/30 backdrop-blur-xl neon-glow-pink hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">High Risk</p>
              <h3 className="text-pink-400 mb-0">23</h3>
            </div>
            <div className="w-12 h-12 bg-black/40 border border-pink-500/30 rounded-xl flex items-center justify-center neon-glow-pink">
              <FileText size={24} className="text-pink-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-cyan-500/30 backdrop-blur-xl neon-glow-cyan hover:scale-[1.02] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg. Accuracy</p>
              <h3 className="text-cyan-400 mb-0">92%</h3>
            </div>
            <div className="w-12 h-12 bg-black/40 border border-cyan-500/30 rounded-xl flex items-center justify-center neon-glow-cyan">
              <TrendingUp size={24} className="text-cyan-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-black/60 backdrop-blur-xl neon-border-cyan">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-300">
            <Filter size={18} className="text-cyan-400" />
            <span className="text-sm">Filter by:</span>
          </div>
          {['all', 'high-risk', 'moderate', 'low-risk'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 neon-glow-cyan'
                  : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-cyan-500/30'
              }`}
            >
              {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-cyan">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-cyan-400 neon-text-cyan">Medical Reports</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.hash = '#compare'}
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30 transition-all neon-glow-purple"
            >
              Compare Reports
            </button>
            <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm rounded-lg hover:bg-cyan-500/30 transition-all neon-glow-cyan">
              Export All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20">
                <th className="text-left py-4 px-4 text-sm text-gray-400">Report ID</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Patient</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Type</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Date</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Accuracy</th>
                <th className="text-left py-4 px-4 text-sm text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-cyan-500/5 transition-all group">
                  <td className="py-4 px-4">
                    <span className="text-sm text-cyan-400">{report.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-black text-xs neon-glow-cyan">
                        {report.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-300">{report.patientName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-300">{report.reportType}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} className="text-cyan-400" />
                      {report.date}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge type={report.riskLevel}>{report.status}</StatusBadge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-black/40 border border-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full neon-glow-green"
                          style={{ width: `${report.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300 w-12">{report.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all group/btn">
                        <Eye size={16} className="text-gray-400 group-hover/btn:text-cyan-400" />
                      </button>
                      <button className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all group/btn">
                        <Download size={16} className="text-gray-400 group-hover/btn:text-cyan-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
