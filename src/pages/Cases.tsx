import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import CollaborativeHandling from './cases/CollaborativeHandling';
import DailyWork from './cases/DailyWork';
import SupervisionTasks from './cases/SupervisionTasks';

const Cases: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'collaborative', label: '案件协同处置', path: '/cases' },
    { id: 'daily', label: '日常工作管理', path: '/cases/daily' },
    { id: 'tasks', label: '监督任务管理', path: '/cases/tasks' },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tight">日常监督检查系统</h1>
          <p className="text-slate-500 font-sans mt-1">案件流转与现场监控指挥</p>
        </div>
      </header>

      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`pb-3 px-2 text-sm font-bold transition-colors relative ${
              (location.pathname === tab.path || (tab.path === '/cases' && location.pathname === '/cases'))
                ? 'text-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {location.pathname === tab.path && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<CollaborativeHandling />} />
          <Route path="/daily" element={<DailyWork />} />
          <Route path="/tasks" element={<SupervisionTasks />} />
          <Route path="*" element={<Navigate to="/cases" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Cases;
