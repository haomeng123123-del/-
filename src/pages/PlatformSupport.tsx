import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Video, Cpu, Server, Settings, Activity, Database, Shield, AlertCircle } from 'lucide-react';
import VideoAnalysis from './platform/VideoAnalysis';
import IoTPlatform from './platform/IoTPlatform';
import VideoUnified from './platform/VideoUnified';

const PlatformSupport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'video', label: '视频智能分析平台', path: '/platform', icon: Video },
    { id: 'iot', label: '物联网数据采集平台', path: '/platform/iot', icon: Cpu },
    { id: 'unified', label: '视频统一接入管理平台', path: '/platform/video', icon: Server },
  ];

  const getActiveTab = () => {
    if (location.pathname === '/platform/iot') return 'iot';
    if (location.pathname === '/platform/video') return 'unified';
    return 'video';
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tight">基础支撑平台</h1>
          <p className="text-slate-500 font-sans mt-1">视频分析、物联网采集与视频统一接入管理</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>运行状态</span>
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>平台配置</span>
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
          <Route path="/" element={<VideoAnalysis />} />
          <Route path="/iot" element={<IoTPlatform />} />
          <Route path="/video" element={<VideoUnified />} />
          <Route path="*" element={<Navigate to="/platform" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default PlatformSupport;
