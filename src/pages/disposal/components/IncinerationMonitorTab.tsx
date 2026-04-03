import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Wind, AlertTriangle, CheckCircle2, CheckCircle, Video } from 'lucide-react';
import { IncinerationEnvData } from '../../../types/disposal';
import { toast } from 'sonner';

interface IncinerationMonitorTabProps {
  envData: IncinerationEnvData;
  onNavigateToVideo?: () => void;
}

const IncinerationMonitorTab: React.FC<IncinerationMonitorTabProps> = ({ envData, onNavigateToVideo }) => {
  const [alarms, setAlarms] = useState(envData.alarms);

  // Mock trend data
  const trendData = [
    { time: '08:00', so2: 15, nox: 120, co: 25 },
    { time: '10:00', so2: 18, nox: 135, co: 28 },
    { time: '12:00', so2: 22, nox: 150, co: 35 },
    { time: '14:00', so2: 20, nox: 140, co: 30 },
    { time: '16:00', so2: 16, nox: 125, co: 26 },
    { time: '18:00', so2: 14, nox: 115, co: 22 },
  ];

  const alarmStats = [
    { type: 'SO2超标', count: 2 },
    { type: 'NOx超标', count: 5 },
    { type: 'CO超标', count: 1 },
    { type: '粉尘超标', count: 3 },
  ];

  const handleProcessAlarm = (index: number) => {
    toast.success('预警已标记为处理中');
    const newAlarms = [...alarms];
    newAlarms.splice(index, 1);
    setAlarms(newAlarms);
  };

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Wind className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">环保设备状态</p>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-2">
              {envData.equipmentStatus === 'normal' ? '正常运行' : '异常'}
              {envData.equipmentStatus === 'normal' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">指标超标报警</p>
            <p className="text-2xl font-black text-slate-900">{alarms.length} <span className="text-sm font-normal text-slate-500">条</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 气体监测指标记录 */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">气体监测指标记录</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">二氧化硫 (SO2)</span>
              <span className="font-black text-slate-900">{envData.emissions.so2} <span className="text-xs font-normal text-slate-400">mg/m³</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">氮氧化物 (NOx)</span>
              <span className="font-black text-slate-900">{envData.emissions.nox} <span className="text-xs font-normal text-slate-400">mg/m³</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">一氧化碳 (CO)</span>
              <span className="font-black text-slate-900">{envData.emissions.co} <span className="text-xs font-normal text-slate-400">mg/m³</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">氯化氢 (HCl)</span>
              <span className="font-black text-slate-900">{envData.emissions.hcl} <span className="text-xs font-normal text-slate-400">mg/m³</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">粉尘 (Dust)</span>
              <span className="font-black text-slate-900">{envData.emissions.dust} <span className="text-xs font-normal text-slate-400">mg/m³</span></span>
            </div>
          </div>
        </div>

        {/* 环保监测指标趋势分析 */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">环保监测指标趋势分析</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="so2" name="SO2 (mg/m³)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="nox" name="NOx (mg/m³)" stroke="#f59e0b" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="co" name="CO (mg/m³)" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 报警类型统计分析 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">报警类型统计分析</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alarmStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="报警次数" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 指标超标报警记录 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            指标超标报警记录
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
                暂无超标报警
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncinerationMonitorTab;
