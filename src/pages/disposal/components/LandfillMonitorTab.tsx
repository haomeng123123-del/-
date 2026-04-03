import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Droplets, Wind, CheckCircle2, CheckCircle, Video } from 'lucide-react';
import { LandfillMonitorData } from '../../../types/disposal';
import { toast } from 'sonner';

interface LandfillMonitorTabProps {
  monitorData: LandfillMonitorData;
  onNavigateToVideo?: () => void;
}

const LandfillMonitorTab: React.FC<LandfillMonitorTabProps> = ({ monitorData, onNavigateToVideo }) => {
  const [alarms, setAlarms] = useState(monitorData.alarms);

  // Mock trend data
  const trendData = [
    { time: '08:00', leachate: 2.1, methane: 15 },
    { time: '10:00', leachate: 2.2, methane: 18 },
    { time: '12:00', leachate: 2.5, methane: 22 },
    { time: '14:00', leachate: 2.8, methane: 25 },
    { time: '16:00', leachate: 2.7, methane: 20 },
    { time: '18:00', leachate: 2.6, methane: 19 },
  ];

  const handleProcessAlarm = (index: number) => {
    toast.success('预警已标记为处理中');
    const newAlarms = [...alarms];
    newAlarms.splice(index, 1);
    setAlarms(newAlarms);
  };

  return (
    <div className="space-y-6">
      {/* 实时运行工况监控 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Activity className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">运行状态</p>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-2">
              正常运行
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Droplets className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">渗滤液液位</p>
            <p className="text-2xl font-black text-slate-900">{monitorData.leachateLevel} <span className="text-sm font-normal text-slate-500">m</span></p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">异常预警数</p>
            <p className="text-2xl font-black text-slate-900">{alarms.length} <span className="text-sm font-normal text-slate-500">条</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 气体监测指标记录 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-500" />
            气体监测指标记录
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">甲烷 (CH4) 浓度</span>
              <span className="font-black text-slate-900">{monitorData.gasConcentration.methane} <span className="text-xs font-normal text-slate-400">%LEL</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">硫化氢 (H2S) 浓度</span>
              <span className="font-black text-slate-900">{monitorData.gasConcentration.h2s} <span className="text-xs font-normal text-slate-400">ppm</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">氨气 (NH3) 浓度</span>
              <span className="font-black text-slate-900">{monitorData.gasConcentration.nh3} <span className="text-xs font-normal text-slate-400">ppm</span></span>
            </div>
          </div>
        </div>

        {/* 监测趋势分析 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">监测趋势分析</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="leachate" name="渗滤液液位 (m)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="methane" name="甲烷浓度 (%LEL)" stroke="#f59e0b" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 异常预警推送 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          异常预警推送
        </h3>
        <div className="space-y-4">
          {alarms.map((alarm, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{alarm.type}</h4>
                  <p className="text-xs text-slate-500 mt-1">{alarm.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">
                  {alarm.level}
                </span>
                {onNavigateToVideo && (
                  <button 
                    onClick={onNavigateToVideo}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="查看监控"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleProcessAlarm(index)}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                  title="标记为已处理"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {alarms.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              暂无异常预警
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandfillMonitorTab;
