import React, { useState } from 'react';
import { Card } from './ui/card';
import { Search, Filter, UserPlus, Eye, Edit, Trash2, Phone, Mail, Calendar, Activity, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  lastVisit: string;
  status: 'critical' | 'warning' | 'success';
  riskScore: number;
  reportsCount: number;
}

export function PatientManagementView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients: Patient[] = [
    {
      id: 'P001',
      name: 'John Anderson',
      age: 58,
      gender: 'Male',
      email: 'john.a@email.com',
      phone: '+1 234-567-8901',
      lastVisit: '2025-10-20',
      status: 'critical',
      riskScore: 94,
      reportsCount: 8
    },
    {
      id: 'P002',
      name: 'Sarah Mitchell',
      age: 45,
      gender: 'Female',
      email: 'sarah.m@email.com',
      phone: '+1 234-567-8902',
      lastVisit: '2025-10-19',
      status: 'warning',
      riskScore: 72,
      reportsCount: 5
    },
    {
      id: 'P003',
      name: 'Michael Chen',
      age: 35,
      gender: 'Male',
      email: 'michael.c@email.com',
      phone: '+1 234-567-8903',
      lastVisit: '2025-10-18',
      status: 'success',
      riskScore: 28,
      reportsCount: 3
    },
    {
      id: 'P004',
      name: 'Emily Davis',
      age: 52,
      gender: 'Female',
      email: 'emily.d@email.com',
      phone: '+1 234-567-8904',
      lastVisit: '2025-10-17',
      status: 'critical',
      riskScore: 89,
      reportsCount: 12
    },
    {
      id: 'P005',
      name: 'Robert Wilson',
      age: 41,
      gender: 'Male',
      email: 'robert.w@email.com',
      phone: '+1 234-567-8905',
      lastVisit: '2025-10-16',
      status: 'success',
      riskScore: 35,
      reportsCount: 4
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-cyan-400 neon-text-cyan">Patient Management</h2>
          <p className="text-sm text-gray-400 mt-2">Manage and monitor patient records</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all neon-glow-cyan flex items-center gap-2">
          <UserPlus size={18} />
          Add Patient
        </button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4 bg-black/60 backdrop-blur-xl neon-border-cyan">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-cyan-500/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-cyan-400" />
            {['all', 'critical', 'warning', 'success'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedFilter === filter
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 neon-glow-cyan'
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-cyan-500/30'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="p-6 bg-black/60 backdrop-blur-xl neon-border-cyan hover:neon-glow-cyan transition-all cursor-pointer"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-black neon-glow-cyan">
                  <span className="text-xl">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="text-white mb-1">{patient.name}</h3>
                  <p className="text-sm text-gray-400">{patient.id} • {patient.age}yrs • {patient.gender}</p>
                  <div className="mt-2">
                    <StatusBadge type={patient.status}>
                      {patient.status === 'critical' ? 'High Risk' : patient.status === 'warning' ? 'Moderate' : 'Low Risk'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all">
                  <Eye size={16} className="text-gray-400 hover:text-cyan-400" />
                </button>
                <button className="p-2 hover:bg-green-500/10 rounded-lg transition-all">
                  <Edit size={16} className="text-gray-400 hover:text-green-400" />
                </button>
                <button className="p-2 hover:bg-pink-500/10 rounded-lg transition-all">
                  <Trash2 size={16} className="text-gray-400 hover:text-pink-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-cyan-400" />
                <span className="text-gray-400 truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-cyan-400" />
                <span className="text-gray-400">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-cyan-400" />
                <span className="text-gray-400">{patient.lastVisit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText size={14} className="text-cyan-400" />
                <span className="text-gray-400">{patient.reportsCount} reports</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Risk Score</span>
                <span className={`text-sm ${
                  patient.riskScore >= 80 ? 'text-pink-400' : 
                  patient.riskScore >= 50 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>{patient.riskScore}%</span>
              </div>
              <div className="mt-2 h-2 bg-black/60 border border-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${patient.riskScore}%`,
                    background: patient.riskScore >= 80 
                      ? 'linear-gradient(90deg, #ff0099, #ff0099)' 
                      : patient.riskScore >= 50 
                      ? 'linear-gradient(90deg, #ffea00, #ffea00)' 
                      : 'linear-gradient(90deg, #00ff41, #00ff41)',
                    boxShadow: patient.riskScore >= 80 
                      ? '0 0 10px rgba(255, 0, 153, 0.5)' 
                      : patient.riskScore >= 50 
                      ? '0 0 10px rgba(255, 234, 0, 0.5)' 
                      : '0 0 10px rgba(0, 255, 65, 0.5)'
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-black/60 border border-cyan-500/30 backdrop-blur-xl neon-glow-cyan">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Total Patients</p>
              <p className="text-xl text-cyan-400">{patients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-black/60 border border-pink-500/30 backdrop-blur-xl neon-glow-pink">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-pink-400" />
            <div>
              <p className="text-sm text-gray-400">High Risk</p>
              <p className="text-xl text-pink-400">{patients.filter(p => p.status === 'critical').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-black/60 border border-yellow-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Moderate Risk</p>
              <p className="text-xl text-yellow-400">{patients.filter(p => p.status === 'warning').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-black/60 border border-green-500/30 backdrop-blur-xl neon-glow-green">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Low Risk</p>
              <p className="text-xl text-green-400">{patients.filter(p => p.status === 'success').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
