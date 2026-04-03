import React, { useState } from 'react';
import { Briefcase, Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database, Shield, User, Key, Lock, Settings, Globe, Bell, Mail, Smartphone } from 'lucide-react';

const RuleConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attendance');

  const tabs = [
    { id: 'attendance', label: '考勤规则', icon: Clock },
    { id: 'operation', label: '作业规则', icon: Activity },
    { id: 'alarm', label: '报警规则', icon: AlertCircle },
    { id: 'audit', label: '审核规则', icon: CheckCircle2 },
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
          <h3 className="font-bold text-slate-800">业务规则配置</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">重置</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">保存规则</button>
          </div>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-w-4xl">
          {activeTab === 'attendance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">上班打卡时间</label>
                  <input type="time" defaultValue="08:00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">下班打卡时间</label>
                  <input type="time" defaultValue="17:30" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">打卡范围限制 (米)</label>
                  <input type="number" defaultValue="200" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">迟到判定时间 (分钟)</label>
                  <input type="number" defaultValue="15" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">考勤逻辑设置</label>
                <div className="space-y-4">
                  {[
                    { label: '允许补卡', desc: '员工在漏打卡时可以申请补卡', enabled: true },
                    { label: '自动打卡', desc: '进入围栏后自动完成打卡', enabled: false },
                    { label: '人脸识别校验', desc: '打卡时需要进行人脸识别', enabled: true },
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
          {activeTab !== 'attendance' && (
            <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-4 py-20">
              <Briefcase className="w-12 h-12 opacity-20" />
              <p className="font-bold">{tabs.find(t => t.id === activeTab)?.label} 模块正在建设中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleConfig;
