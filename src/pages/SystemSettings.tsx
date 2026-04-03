import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Settings, Users, Shield, Sliders, FileText, Activity, Building2, Briefcase } from 'lucide-react';
import OrgManagement from './settings/OrgManagement';
import UserManagement from './settings/UserManagement';
import RoleManagement from './settings/RoleManagement';
import ParamConfig from './settings/ParamConfig';
import RuleConfig from './settings/RuleConfig';
import LogManagement from './settings/LogManagement';
import OpsMonitor from './settings/OpsMonitor';

const SystemSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'org', label: '组织机构管理', path: '/settings', icon: Building2 },
    { id: 'user', label: '用户管理', path: '/settings/users', icon: Users },
    { id: 'role', label: '角色权限管理', path: '/settings/roles', icon: Shield },
    { id: 'param', label: '系统参数配置', path: '/settings/params', icon: Sliders },
    { id: 'rule', label: '业务规则配置', path: '/settings/rules', icon: Briefcase },
    { id: 'log', label: '日志管理', path: '/settings/logs', icon: FileText },
    { id: 'monitor', label: '自动化运维监控', path: '/settings/monitor', icon: Activity },
  ];

  const getActiveTab = () => {
    if (location.pathname === '/settings/users') return 'user';
    if (location.pathname === '/settings/roles') return 'role';
    if (location.pathname === '/settings/params') return 'param';
    if (location.pathname === '/settings/rules') return 'rule';
    if (location.pathname === '/settings/logs') return 'log';
    if (location.pathname === '/settings/monitor') return 'monitor';
    return 'org';
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tight">系统管理与配置</h1>
          <p className="text-slate-500 font-sans mt-1">组织机构、用户权限、系统参数及运维监控</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>系统状态</span>
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>全局配置</span>
          </button>
        </div>
      </header>

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`pb-3 px-2 text-sm font-bold transition-colors relative flex items-center gap-2 whitespace-nowrap ${
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
          <Route path="/" element={<OrgManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/params" element={<ParamConfig />} />
          <Route path="/rules" element={<RuleConfig />} />
          <Route path="/logs" element={<LogManagement />} />
          <Route path="/monitor" element={<OpsMonitor />} />
          <Route path="*" element={<Navigate to="/settings" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default SystemSettings;
