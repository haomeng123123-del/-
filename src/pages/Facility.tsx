import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Map, Activity, Users, ClipboardCheck, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

// Sub-components for the Facility module
import ToiletMap from './facility/ToiletMap';
import RealtimeMonitor from './facility/RealtimeMonitor';
import CleaningManagement from './facility/CleaningManagement';
import InspectionManagement from './facility/InspectionManagement';
import StatisticsSummary from './facility/StatisticsSummary';

const Facility: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: '', label: '公厕地图', icon: Map },
    { id: 'monitor', label: '实时监测', icon: Activity },
    { id: 'cleaning', label: '保洁管理', icon: Users },
    { id: 'inspection', label: '巡检管理', icon: ClipboardCheck },
    { id: 'statistics', label: '统计分析', icon: BarChart3 },
  ] as const;

  // Helper to determine if a tab is active based on the current path
  const isActiveTab = (tabId: string) => {
    const currentPath = location.pathname.replace('/facility', '').replace(/^\//, '');
    return currentPath === tabId;
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">智慧公厕监管</h1>
        <p className="text-slate-500 mt-1">公厕地图、实时监测、保洁与巡检管理</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(`/facility${tab.id ? `/${tab.id}` : ''}`)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[600px]"
      >
        <Routes>
          <Route index element={<ToiletMap />} />
          <Route path="monitor" element={<RealtimeMonitor />} />
          <Route path="cleaning" element={<CleaningManagement />} />
          <Route path="inspection" element={<InspectionManagement />} />
          <Route path="statistics" element={<StatisticsSummary />} />
          <Route path="*" element={<Navigate to="/facility" replace />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default Facility;
