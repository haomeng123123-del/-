import React, { useState } from 'react';
import { MapPin, Calendar, FileText, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

import CollectionMonitorTab from './components/CollectionMonitorTab';
import CollectionPlanTab from './components/CollectionPlanTab';
import CollectionRecordsTab from './components/CollectionRecordsTab';
import CollectionStatsTab from './components/CollectionStatsTab';

const CollectionSupervision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitor');

  const tabs = [
    { id: 'monitor', label: '实时监测', icon: MapPin },
    { id: 'plan', label: '收运计划', icon: Calendar },
    { id: 'records', label: '收运记录', icon: FileText },
    { id: 'stats', label: '汇总统计', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'monitor' && <CollectionMonitorTab />}
        {activeTab === 'plan' && <CollectionPlanTab />}
        {activeTab === 'records' && <CollectionRecordsTab />}
        {activeTab === 'stats' && <CollectionStatsTab />}
      </motion.div>
    </div>
  );
};

export default CollectionSupervision;
