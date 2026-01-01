import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardHome = ({ onViewChange }) => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests');
        const requests = response.data;
        
        const total = requests.length;
        const inProgress = requests.filter(r => r.stage === 'In Progress').length;
        const completed = requests.filter(r => r.stage === 'Repaired').length;
        const overdue = requests.filter(r => {
            return new Date(r.scheduledDate) < new Date() && r.stage !== 'Repaired' && r.stage !== 'Scrap';
        }).length;

        setStats({ total, inProgress, completed, overdue });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Requests" 
          value={stats.total} 
          color="bg-blue-500" 
          icon="📋" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          color="bg-yellow-500" 
          icon="⚙️" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          color="bg-green-500" 
          icon="✅" 
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          color="bg-red-500" 
          icon="⚠️" 
        />
      </div>

      {/* Quick Actions & Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onViewChange('requests')}
              className="w-full p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors flex items-center space-x-3"
            >
              <span className="bg-blue-100 text-blue-600 p-2 rounded">➕</span>
              <span className="font-medium text-gray-700">Create New Maintenance Request</span>
            </button>
            <button 
              onClick={() => onViewChange('calendar')}
              className="w-full p-3 text-left bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors flex items-center space-x-3"
            >
              <span className="bg-purple-100 text-purple-600 p-2 rounded">📅</span>
              <span className="font-medium text-gray-700">View Schedule</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Technicians Online</span>
              <span className="font-bold text-gray-900">4 / 12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">2 Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
