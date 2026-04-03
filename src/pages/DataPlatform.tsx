import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Database, Server, Activity, ChevronRight, Folder, FileText, Settings, AlertCircle, CheckCircle2, Clock, Users, Shield, Briefcase, Map } from 'lucide-react';
import FacilityManagement from './data/FacilityManagement';
import ResourceManagement from './data/ResourceManagement';
import WorkReporting from './data/WorkReporting';

const DataPlatform: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'facility', label: '环卫设施数据管理', path: '/data', icon: Database },
    { id: 'resource', label: '作业资源数据管理', path: '/data/resources', icon: Briefcase },
    { id: 'report', label: '工作信息报送管理', path: '/data/reports', icon: FileText },
  ];

  const getActiveTab = () => {
    if (location.pathname === '/data/resources') return 'resource';
    if (location.pathname === '/data/reports') return 'report';
    return 'facility';
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tight">数据资源管理系统</h1>
          <p className="text-slate-500 font-sans mt-1">环卫设施、作业资源与工作信息全方位管理</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>系统设置</span>
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>数据同步</span>
          </button>
        </div>
      </header>

      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`pb-3 px-2 text-sm font-bold transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<FacilityManagement />} />
          <Route path="/resources" element={<ResourceManagement />} />
          <Route path="/reports" element={<WorkReporting />} />
          <Route path="*" element={<Navigate to="/data" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default DataPlatform;
