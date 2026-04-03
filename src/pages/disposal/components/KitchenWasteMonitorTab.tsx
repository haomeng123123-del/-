import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Settings, AlertTriangle, CheckCircle2, Droplets, Flame, CheckCircle, Video } from 'lucide-react';
import { KitchenProcessData } from '../../../types/disposal';
import { toast } from 'sonner';

interface KitchenWasteMonitorTabProps {
  processData: KitchenProcessData;
  onNavigateToVideo?: () => void;
}

const KitchenWasteMonitorTab: React.FC<KitchenWasteMonitorTabProps> = ({ processData, onNavigateToVideo }) => {
  const [alarms, setAlarms] = useState(processData.alarms);

  // Mock trend data
  const trendData = [
    { time: '08:00', temp: 55, pressure: 1.2, ph: 6.8 },
    { time: '10:00', temp: 58, pressure: 1.3, ph: 6.9 },
    { time: '12:00', temp: 62, pressure: 1.5, ph: 7.1 },
    { time: '14:00', temp: 60, pressure: 1.4, ph: 7.0 },
    { time: '16:00', temp: 59, pressure: 1.3, ph: 6.9 },
    { time: '18:00', temp: 56, pressure: 1.2, ph: 6.8 },
  ];

  const alarmStats = [
    { type: '温度异常', count: 4 },
    { type: '压力超标', count: 1 },
    { type: 'pH值异常', count: 2 },
    { type: '设备故障', count: 1 },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Settings className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">处理设备状态</p>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-2">
              {processData.equipmentStatus === 'normal' ? '正常运行' : '异常'}
              {processData.equipmentStatus === 'normal' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Droplets className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">今日产油量</p>
            <p className="text-2xl font-black text-slate-900">{processData.products.oil} <span className="text-sm font-normal text-slate-500">吨</span></p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Flame className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">今日产气量</p>
            <p className="text-2xl font-black text-slate-900">{processData.products.gas} <span className="text-sm font-normal text-slate-500">m³</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 关键工艺参数 */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">关键工艺参数</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">发酵温度</span>
              <span className="font-black text-slate-900">{processData.parameters.temperature} <span className="text-xs font-normal text-slate-400">°C</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">反应釜压力</span>
              <span className="font-black text-slate-900">{processData.parameters.pressure} <span className="text-xs font-normal text-slate-400">MPa</span></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">pH值</span>
              <span className="font-black text-slate-900">{processData.parameters.ph}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">含水率</span>
              <span className="font-black text-slate-900">{processData.parameters.moisture}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-600">产渣量</span>
              <span className="font-black text-slate-900">{processData.products.solidWaste} <span className="text-xs font-normal text-slate-400">吨</span></span>
            </div>
          </div>
        </div>

        {/* 工艺参数趋势分析 */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">工艺参数趋势分析</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="temp" name="温度 (°C)" stroke="#ef4444" strokeWidth={3} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="pressure" name="压力 (MPa)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="ph" name="pH值" stroke="#10b981" strokeWidth={3} dot={false} />
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
                <Bar dataKey="count" name="报警次数" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 运行异常报警记录 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            运行异常报警记录
          </h3>
          <div className="space-y-4">
            {alarms.map((alarm, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{alarm.type}</h4>
                    <p className="text-xs text-slate-500 mt-1">{alarm.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">
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
                暂无异常报警
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenWasteMonitorTab;
