import React, { useState } from 'react';
import { Sliders, Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database, Shield, User, Key, Lock, Settings, Globe, Bell, Mail, Smartphone } from 'lucide-react';

const ParamConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: '常规设置', icon: Settings },
    { id: 'regional', label: '区域设置', icon: Globe },
    { id: 'notification', label: '通知设置', icon: Bell },
    { id: 'integration', label: '集成设置', icon: Activity },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">系统参数配置</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">重置</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">保存配置</button>
          </div>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-w-4xl">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">系统名称</label>
                  <input type="text" defaultValue="智慧环卫综合管理平台" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">系统版本</label>
                  <input type="text" defaultValue="v2.5.0" readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">默认语言</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800">
                    <option value="zh">简体中文</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">登录超时时间 (分钟)</label>
                  <input type="number" defaultValue="30" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">安全设置</label>
                <div className="space-y-4">
                  {[
                    { label: '强制密码复杂度校验', desc: '密码必须包含字母、数字和特殊字符', enabled: true },
                    { label: '多端登录限制', desc: '同一账号不允许在多个设备同时登录', enabled: false },
                    { label: '登录验证码', desc: '登录时需要输入图形验证码', enabled: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
                      </div>
                      <button className={`w-10 h-6 rounded-full relative transition-colors ${item.enabled ? 'bg-primary' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab !== 'general' && (
            <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-4 py-20">
              <Settings className="w-12 h-12 opacity-20" />
              <p className="font-bold">{tabs.find(t => t.id === activeTab)?.label} 模块正在建设中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParamConfig;
