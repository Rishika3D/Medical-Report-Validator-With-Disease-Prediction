import React, { useState } from 'react';
import { Card } from './ui/card';
import { ArrowLeftRight, Plus, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Report {
  id: string;
  patientName: string;
  date: string;
  riskScore: number;
  status: 'critical' | 'warning' | 'success';
  metrics: {
    bloodPressure: string;
    glucose: number;
    bmi: number;
    cholesterol: number;
    heartRate: number;
  };
}

export function ComparisonView() {
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
  
  const availableReports: Report[] = [
    {
      id: 'RPT-001',
      patientName: 'John Anderson',
      date: '2025-10-20',
      riskScore: 94,
      status: 'critical',
      metrics: {
        bloodPressure: '145/95',
        glucose: 185,
        bmi: 32.4,
        cholesterol: 245,
        heartRate: 88
      }
    },
    {
      id: 'RPT-002',
      patientName: 'Sarah Mitchell',
      date: '2025-10-19',
      riskScore: 72,
      status: 'warning',
      metrics: {
        bloodPressure: '135/85',
        glucose: 145,
        bmi: 28.5,
        cholesterol: 215,
        heartRate: 78
      }
    },
    {
      id: 'RPT-003',
      patientName: 'Michael Chen',
      date: '2025-10-18',
      riskScore: 28,
      status: 'success',
      metrics: {
        bloodPressure: '118/75',
        glucose: 95,
        bmi: 23.8,
        cholesterol: 175,
        heartRate: 68
      }
    }
  ];

  const addReport = (report: Report) => {
    if (selectedReports.length < 3 && !selectedReports.find(r => r.id === report.id)) {
      setSelectedReports([...selectedReports, report]);
    }
  };

  const removeReport = (id: string) => {
    setSelectedReports(selectedReports.filter(r => r.id !== id));
  };

  const getMetricComparison = (current: number, others: number[]) => {
    if (others.length === 0) return null;
    const avg = others.reduce((a, b) => a + b, 0) / others.length;
    const diff = ((current - avg) / avg) * 100;
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-purple-400 neon-text-purple">Report Comparison</h2>
        <p className="text-sm text-gray-400 mt-2">Compare multiple patient reports side-by-side</p>
      </div>

      {/* Report Selection */}
      {selectedReports.length < 3 && (
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Plus size={20} className="text-purple-400" />
            Add Report to Compare ({selectedReports.length}/3)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableReports
              .filter(r => !selectedReports.find(sr => sr.id === r.id))
              .map((report) => (
                <button
                  key={report.id}
                  onClick={() => addReport(report)}
                  className="p-4 bg-black/40 border border-purple-500/30 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-400">{report.id}</span>
                    <StatusBadge type={report.status}>
                      {report.status === 'critical' ? 'High' : report.status === 'warning' ? 'Moderate' : 'Low'}
                    </StatusBadge>
                  </div>
                  <h4 className="text-white mb-1">{report.patientName}</h4>
                  <p className="text-xs text-gray-400">{report.date}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Risk Score</span>
                    <span className={`text-sm ${
                      report.riskScore >= 80 ? 'text-pink-400' : 
                      report.riskScore >= 50 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>{report.riskScore}%</span>
                  </div>
                </button>
              ))}
          </div>
        </Card>
      )}

      {/* Comparison Grid */}
      {selectedReports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {selectedReports.map((report, index) => {
            const otherScores = selectedReports
              .filter((_, i) => i !== index)
              .map(r => r.riskScore);
            const scoreComparison = getMetricComparison(report.riskScore, otherScores);

            return (
              <Card key={report.id} className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple hover:neon-glow-purple transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-purple-400">{report.id}</span>
                    <h3 className="text-white mt-1">{report.patientName}</h3>
                    <p className="text-xs text-gray-400 mt-1">{report.date}</p>
                  </div>
                  <button
                    onClick={() => removeReport(report.id)}
                    className="p-2 hover:bg-pink-500/10 rounded-lg transition-all"
                  >
                    <X size={16} className="text-gray-400 hover:text-pink-400" />
                  </button>
                </div>

                {/* Risk Score */}
                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Risk Score</span>
                    {scoreComparison !== null && (
                      <div className={`flex items-center gap-1 text-xs ${
                        scoreComparison > 10 ? 'text-pink-400' : 
                        scoreComparison < -10 ? 'text-green-400' : 
                        'text-yellow-400'
                      }`}>
                        {scoreComparison > 10 ? <TrendingUp size={12} /> : 
                         scoreComparison < -10 ? <TrendingDown size={12} /> : 
                         <Minus size={12} />}
                        {Math.abs(scoreComparison).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="text-3xl text-white">{report.riskScore}%</div>
                  <StatusBadge type={report.status}>
                    {report.status === 'critical' ? 'High Risk' : 
                     report.status === 'warning' ? 'Moderate Risk' : 
                     'Low Risk'}
                  </StatusBadge>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Blood Pressure</span>
                    <span className="text-white">{report.metrics.bloodPressure}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Glucose</span>
                    <span className="text-white">{report.metrics.glucose} mg/dL</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">BMI</span>
                    <span className="text-white">{report.metrics.bmi}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Cholesterol</span>
                    <span className="text-white">{report.metrics.cholesterol} mg/dL</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Heart Rate</span>
                    <span className="text-white">{report.metrics.heartRate} bpm</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Comparison Insights */}
      {selectedReports.length >= 2 && (
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-cyan">
          <h3 className="text-cyan-400 neon-text-cyan mb-4 flex items-center gap-2">
            <ArrowLeftRight size={20} />
            Comparison Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">Highest Risk</p>
              <p className="text-xl text-cyan-400">
                {selectedReports.reduce((max, r) => r.riskScore > max.riskScore ? r : max).patientName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedReports.reduce((max, r) => r.riskScore > max.riskScore ? r : max).riskScore}% risk score
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">Lowest Risk</p>
              <p className="text-xl text-green-400">
                {selectedReports.reduce((min, r) => r.riskScore < min.riskScore ? r : min).patientName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedReports.reduce((min, r) => r.riskScore < min.riskScore ? r : min).riskScore}% risk score
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">Average Risk</p>
              <p className="text-xl text-purple-400">
                {(selectedReports.reduce((sum, r) => sum + r.riskScore, 0) / selectedReports.length).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Across {selectedReports.length} reports</p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {selectedReports.length === 0 && (
        <Card className="p-12 bg-black/40 backdrop-blur-xl neon-border-purple rounded-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-purple">
            <ArrowLeftRight size={40} className="text-white" />
          </div>
          <h3 className="text-white mb-2">No Reports Selected</h3>
          <p className="text-sm text-gray-400">Select reports above to compare patient data side-by-side</p>
        </Card>
      )}
    </div>
  );
}
