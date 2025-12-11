import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PredictionCard } from './PredictionCard';
import { ValidationCard } from './ValidationCard';
import { ReportsView } from './ReportsView';
import { UploadView } from './UploadView';
import { AnalyticsView } from './AnalyticsView';
import { PatientManagementView } from './PatientManagementView';
import { ActivityFeed } from './ActivityFeed';
import { SettingsView } from './SettingsView';
import { ComparisonView } from './ComparisonView';
import { NotificationsPanel } from './NotificationsPanel';
import { AIChatAssistant } from './AIChatAssistant';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Search, Bell, User, Upload, Sparkles } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock data for prediction
  const features = [
    { name: 'Blood Pressure', value: 85, color: '#DC3545' },
    { name: 'Glucose Level', value: 72, color: '#FFC107' },
    { name: 'BMI', value: 58, color: '#28A745' },
    { name: 'Age Factor', value: 45, color: '#0047AB' },
    { name: 'Cholesterol', value: 38, color: '#6C757D' }
  ];

  // Mock data for validation
  const issues = [
    { type: 'critical' as const, label: 'Missing Data', field: 'Patient ID #4521', action: 'Review' },
    { type: 'critical' as const, label: 'Out of Range', field: 'Blood Pressure', action: 'Correct' },
    { type: 'warning' as const, label: 'Inconsistent', field: 'Date of Birth', action: 'Verify' },
    { type: 'success' as const, label: 'Validated', field: 'Diagnosis Code', action: 'None' },
    { type: 'critical' as const, label: 'Duplicate', field: 'Record #8834', action: 'Merge' }
  ];

  return (
    <div className="flex h-screen bg-black relative overflow-hidden">
      {/* Animated Neon Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ boxShadow: '0 0 100px 50px rgba(0, 240, 255, 0.3)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000" style={{ boxShadow: '0 0 100px 50px rgba(255, 0, 153, 0.3)' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000" style={{ boxShadow: '0 0 100px 50px rgba(180, 0, 255, 0.3)' }} />
      </div>
      
      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-black/60 backdrop-blur-xl border-b neon-border-cyan px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-cyan-400 neon-text-cyan">Medical AI Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow-green" />
                Real-time analysis and validation
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl w-64 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all"
                />
              </div>
              <button 
                onClick={() => setNotificationsOpen(true)}
                className="p-2 hover:bg-cyan-500/10 rounded-xl transition-all relative group"
              >
                <Bell size={20} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse neon-glow-pink" />
              </button>
              <button className="p-2 hover:bg-cyan-500/10 rounded-xl transition-all group">
                <User size={20} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
                {/* Column 1: Prediction Analysis */}
                <PredictionCard 
                  riskPercentage={73}
                  features={features}
                />

                {/* Column 2: Validation Details */}
                <ValidationCard 
                  issues={issues}
                  validPercentage={82}
                  invalidPercentage={18}
                />
              </div>

              {/* Additional Info Section */}
              <div className="mt-6 max-w-7xl">
                <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 neon-border-cyan rounded-2xl p-6 relative overflow-hidden group hover:neon-glow-cyan transition-all backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="flex-shrink-0 w-14 h-14 bg-black/40 border border-cyan-500/30 rounded-2xl flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
                      <Upload size={26} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-cyan-400 mb-1 flex items-center gap-2">
                        Quick Actions
                        <Sparkles size={16} className="animate-pulse text-pink-400" />
                      </h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Upload a new medical report to run AI-powered analysis and validation checks
                      </p>
                      <button 
                        onClick={() => setActiveTab('upload')}
                        className="px-5 py-2.5 text-sm bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all neon-glow-cyan hover:scale-105 transform"
                      >
                        Upload Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reports View */}
          {activeTab === 'reports' && <ReportsView />}

          {/* Upload View */}
          {activeTab === 'upload' && <UploadView />}

          {/* Analytics View */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* Patients View */}
          {activeTab === 'patients' && <PatientManagementView />}

          {/* Activity View */}
          {activeTab === 'activity' && <ActivityFeed />}

          {/* Comparison View */}
          {activeTab === 'compare' && <ComparisonView />}

          {/* Settings View */}
          {activeTab === 'settings' && <SettingsView />}

          {/* Help View */}
          {activeTab === 'help' && (
            <div className="max-w-4xl">
              <div>
                <h2 className="text-pink-400 neon-text-pink">Help & Support</h2>
                <p className="text-sm text-gray-400 mt-2">Get assistance and learn how to use the Medical AI Dashboard</p>
              </div>
              <div className="mt-6 p-12 bg-black/40 backdrop-blur-xl neon-border-pink rounded-2xl text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 border border-pink-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-pink">
                  <Sparkles size={32} className="text-white" />
                </div>
                <h3 className="text-white mb-2">Help Center Coming Soon</h3>
                <p className="text-sm text-gray-400">Access documentation, tutorials, and support resources</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />

      {/* AI Chat Assistant */}
      <AIChatAssistant />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onNavigate={setActiveTab} />
    </div>
  );
}