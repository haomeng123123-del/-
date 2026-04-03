import React, { useState } from 'react';
import { Video, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

import TreatmentMonitorTab from './components/TreatmentMonitorTab';
import TreatmentInboundTab from './components/TreatmentInboundTab';
import TreatmentProcessTab from './components/TreatmentProcessTab';
import TreatmentStatsTab from './components/TreatmentStatsTab';

const TreatmentSupervision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitor');

  const tabs = [
    { id: 'monitor', label: '实时监测', icon: Video },
    { id: 'inbound', label: '进场计量', icon: CheckCircle },
    { id: 'process', label: '处理工艺', icon: Settings },
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
        {activeTab === 'monitor' && <TreatmentMonitorTab />}
        {activeTab === 'inbound' && <TreatmentInboundTab />}
        {activeTab === 'process' && <TreatmentProcessTab />}
        {activeTab === 'stats' && <TreatmentStatsTab />}
      </motion.div>
    </div>
  );
};

export default TreatmentSupervision;
