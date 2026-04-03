import React, { useState } from 'react';
import { Settings, Activity, AlertTriangle, CheckCircle2, Thermometer, Droplets, Wind, Zap } from 'lucide-react';

const TreatmentProcessTab: React.FC = () => {
  const [activeFacility, setActiveFacility] = useState('f1');

  const facilities = [
    { id: 'f1', name: '浦东新区厨余垃圾处理厂', type: '厨余垃圾' },
    { id: 'f2', name: '老港废弃物处置基地', type: '焚烧发电' },
    { id: 'f3', name: '嘉定区可回收物集散中心', type: '可回收物' },
  ];

  const processData = {
    f1: {
      status: 'running',
      temperature: 65.5,
      pressure: 1.2,
      moisture: 45,
      ph: 6.8,
      dailyProcessed: 1250,
      dailyCapacity: 1500,
      alerts: [
        { id: 1, time: '10:23', type: 'warning', message: '2号发酵仓温度偏高' }
      ]
    },
    f2: {
      status: 'running',
      temperature: 850,
      pressure: 2.5,
      moisture: 20,
      ph: 7.2,
      dailyProcessed: 3000,
      dailyCapacity: 3000,
      alerts: []
    },
    f3: {
      status: 'maintenance',
      temperature: 25,
      pressure: 1.0,
      moisture: 10,
      ph: 7.0,
      dailyProcessed: 450,
      dailyCapacity: 800,
      alerts: [
        { id: 2, time: '08:00', type: 'info', message: '分拣线B计划维护中' }
      ]
    }
  };

  const data = processData[activeFacility as keyof typeof processData];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-16rem)]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto shrink-0 p-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">处理设施</h3>
        <div className="space-y-2">
          {facilities.map((fac) => (
            <button
              key={fac.id}
              onClick={() => setActiveFacility(fac.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                activeFacility === fac.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className={`text-sm font-bold ${activeFacility === fac.id ? 'text-primary' : 'text-slate-700'}`}>
                {fac.name}
              </div>
              <div className="text-xs text-slate-500 mt-1">{fac.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto">
        {/* Status Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{facilities.find(f => f.id === activeFacility)?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">实时工艺参数监控</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">今日处理量 / 产能</p>
              <p className="text-lg font-mono font-bold text-slate-700">
                <span className="text-primary">{data.dailyProcessed}</span> / {data.dailyCapacity} t
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm ${
              data.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {data.status === 'running' ? <CheckCircle2 className="w-5 h-5" /> : <Settings className="w-5 h-5 animate-spin-slow" />}
              {data.status === 'running' ? '正常运行' : '设备维护'}
            </div>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">核心温度</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">{data.temperature}</span>
              <span className="text-sm font-bold text-slate-500 mb-1">°C</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">系统压力</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">{data.pressure}</span>
              <span className="text-sm font-bold text-slate-500 mb-1">MPa</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">含水率</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">{data.moisture}</span>
              <span className="text-sm font-bold text-slate-500 mb-1">%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">pH值</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">{data.ph}</span>
            </div>
          </div>
        </div>

        {/* Process Flow & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-6">工艺流程图</h3>
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/process/800/400')] bg-cover bg-center opacity-10 grayscale" />
              <div className="text-slate-400 flex flex-col items-center gap-2 relative z-10">
                <Settings className="w-12 h-12 opacity-20 animate-spin-slow" />
                <span className="text-sm font-medium">工艺流程图加载中...</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              实时告警
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {data.alerts.length > 0 ? (
                data.alerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${
                    alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        alert.type === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.type === 'warning' ? '警告' : '提示'}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-200 mb-2" />
                  <p className="text-sm">当前无告警信息</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentProcessTab;
