import React from 'react';
import { Card } from './ui/card';
import { Activity, FileText, Upload, CheckCircle, AlertCircle, Users, TrendingUp, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'report' | 'upload' | 'analysis' | 'alert' | 'user';
  title: string;
  description: string;
  time: string;
  user: string;
}

export function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'alert',
      title: 'High Risk Alert',
      description: 'Patient John Anderson flagged with 94% diabetes risk',
      time: '5 mins ago',
      user: 'AI System'
    },
    {
      id: '2',
      type: 'analysis',
      title: 'Analysis Completed',
      description: 'Cardiovascular analysis for Sarah Mitchell',
      time: '15 mins ago',
      user: 'Dr. Gavarkar'
    },
    {
      id: '3',
      type: 'upload',
      title: 'Report Uploaded',
      description: 'New patient report uploaded: patient_report_2025.pdf',
      time: '32 mins ago',
      user: 'Dr. Gavarkar'
    },
    {
      id: '4',
      type: 'report',
      title: 'Report Generated',
      description: 'Monthly analytics report generated successfully',
      time: '1 hour ago',
      user: 'System'
    },
    {
      id: '5',
      type: 'user',
      title: 'New Patient Added',
      description: 'Patient record created for Michael Chen',
      time: '2 hours ago',
      user: 'Dr. Gavarkar'
    },
    {
      id: '6',
      type: 'analysis',
      title: 'Model Updated',
      description: 'AI model accuracy improved to 94.2%',
      time: '3 hours ago',
      user: 'AI System'
    },
    {
      id: '7',
      type: 'upload',
      title: 'Batch Upload',
      description: '12 new patient reports uploaded',
      time: '4 hours ago',
      user: 'Dr. Gavarkar'
    },
    {
      id: '8',
      type: 'report',
      title: 'Data Validation',
      description: 'Validation complete: 98% accuracy',
      time: '5 hours ago',
      user: 'System'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText size={18} className="text-cyan-400" />;
      case 'upload':
        return <Upload size={18} className="text-purple-400" />;
      case 'analysis':
        return <TrendingUp size={18} className="text-green-400" />;
      case 'alert':
        return <AlertCircle size={18} className="text-pink-400" />;
      case 'user':
        return <Users size={18} className="text-yellow-400" />;
      default:
        return <Activity size={18} className="text-gray-400" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'report':
        return 'border-cyan-500/30 bg-cyan-500/5';
      case 'upload':
        return 'border-purple-500/30 bg-purple-500/5';
      case 'analysis':
        return 'border-green-500/30 bg-green-500/5';
      case 'alert':
        return 'border-pink-500/30 bg-pink-500/5';
      case 'user':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-gray-700 bg-black/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-cyan-400 neon-text-cyan">Activity Feed</h2>
        <p className="text-sm text-gray-400 mt-2">Recent activities and system events</p>
      </div>

      {/* Timeline */}
      <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-cyan">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-20" />

          {/* Activity Items */}
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-14">
                {/* Icon */}
                <div className={`absolute left-0 w-12 h-12 rounded-xl border flex items-center justify-center ${getColorClass(activity.type)}`}>
                  {getIcon(activity.type)}
                </div>

                {/* Content */}
                <div className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${getColorClass(activity.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white">{activity.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {activity.time}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xs text-black">
                      {activity.user.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">{activity.user}</span>
                  </div>
                </div>

                {/* Connector dot */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 -bottom-3 w-2 h-2 bg-cyan-400 rounded-full neon-glow-cyan" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all">
            Load More Activities
          </button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-black/60 border border-cyan-500/30 backdrop-blur-xl text-center">
          <Activity size={24} className="text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl text-cyan-400 mb-1">127</p>
          <p className="text-xs text-gray-400">Total Activities</p>
        </Card>
        <Card className="p-4 bg-black/60 border border-green-500/30 backdrop-blur-xl text-center">
          <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
          <p className="text-2xl text-green-400 mb-1">94</p>
          <p className="text-xs text-gray-400">Completed</p>
        </Card>
        <Card className="p-4 bg-black/60 border border-pink-500/30 backdrop-blur-xl text-center">
          <AlertCircle size={24} className="text-pink-400 mx-auto mb-2" />
          <p className="text-2xl text-pink-400 mb-1">8</p>
          <p className="text-xs text-gray-400">Alerts</p>
        </Card>
        <Card className="p-4 bg-black/60 border border-purple-500/30 backdrop-blur-xl text-center">
          <Users size={24} className="text-purple-400 mx-auto mb-2" />
          <p className="text-2xl text-purple-400 mb-1">15</p>
          <p className="text-xs text-gray-400">Active Users</p>
        </Card>
      </div>
    </div>
  );
}
