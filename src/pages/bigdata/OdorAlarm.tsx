import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wind, 
  MapPin, 
  Search,
  Filter,
  AlertTriangle,
  BarChart3,
  Clock,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// --- Mock Data ---

const ALARMS = [
  { id: 'ODR-001', station: '南山中心转运站', district: '南山区', value: 25, threshold: 20, unit: 'OU', time: '2023-10-27 14:30', status: 'unprocessed', description: '臭气浓度持续 15 分钟超过预警阈值。' },
  { id: 'ODR-002', station: '福田梅林转运站', district: '福田区', value: 22, threshold: 20, unit: 'OU', time: '2023-10-27 10:15', status: 'processing', description: '臭气浓度短暂超标，已自动开启增强除臭。' },
  { id: 'ODR-003', station: '宝安西乡转运站', district: '宝安区', value: 30, threshold: 20, unit: 'OU', time: '2023-10-26 16:45', status: 'processed', description: '设备故障导致除臭系统停机，臭气浓度严重超标。' },
  { id: 'ODR-004', station: '罗湖清水河转运站', district: '罗湖区', value: 21, threshold: 20, unit: 'OU', time: '2023-10-26 09:20', status: 'processed', description: '早高峰垃圾集中进站，臭气浓度轻微超标。' },
  { id: 'ODR-005', station: '龙华大浪转运站', district: '龙华区', value: 28, threshold: 20, unit: 'OU', time: '2023-10-25 11:10', status: 'unprocessed', description: '周边居民投诉异味，监测数据显示臭气浓度超标。' },
];

const CHART_DATA = [
  { time: '14:00', value: 12 },
  { time: '14:05', value: 15 },
  { time: '14:10', value: 18 },
  { time: '14:15', value: 19 },
  { time: '14:20', value: 22 },
  { time: '14:25', value: 24 },
  { time: '14:30', value: 25 }, // Current alarm
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    unprocessed: { label: '待处理', className: 'bg-red-100 text-red-700 border-red-200' },
    processing: { label: '处理中', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    processed: { label: '已恢复', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function OdorAlarm() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlarm, setSelectedAlarm] = useState<typeof ALARMS[0] | null>(ALARMS[0]);

  const filteredAlarms = ALARMS.filter(a => 
    a.station.includes(searchQuery) || a.district.includes(searchQuery)
  );

  return (
    <div className="h-full flex space-x-4">
      {/* Left Panel: List */}
      <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">臭气报警监控</h2>
            <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索转运站名称/区域..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredAlarms.map((alarm) => (
            <div
              key={alarm.id}
              onClick={() => setSelectedAlarm(alarm)}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-all border",
                selectedAlarm?.id === alarm.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium flex items-center">
                    <Wind className="w-3 h-3 mr-1" />
                    浓度超标
                  </span>
                  <span className="text-xs text-slate-500">{alarm.id}</span>
                </div>
                <StatusBadge status={alarm.status} />
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">{alarm.station}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    {alarm.time}
                  </div>
                  <div className="text-red-600 font-medium">
                    {alarm.value} {alarm.unit} <span className="text-slate-400 font-normal">(阈值 {alarm.threshold})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center & Right: Details and Map */}
      <div className="flex-1 flex flex-col space-y-4 min-w-0">
        {/* Top: Details */}
        {selectedAlarm ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">报警详情 - {selectedAlarm.id}</h3>
                  <div className="text-xs text-slate-500">报警时间: {selectedAlarm.time}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  远程启停除臭
                </button>
                <button 
                  onClick={() => navigate('/comprehensive/transfer')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  派发工单
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Analysis Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-slate-400" />
                  报警信息
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 space-y-3 border border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">系统分析</div>
                    <div className="text-sm text-slate-800">{selectedAlarm.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">当前浓度</div>
                      <div className="text-lg font-bold text-red-600">{selectedAlarm.value} <span className="text-xs font-normal text-slate-500">{selectedAlarm.unit}</span></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">预警阈值</div>
                      <div className="text-lg font-bold text-slate-700">{selectedAlarm.threshold} <span className="text-xs font-normal text-slate-500">{selectedAlarm.unit}</span></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                      <div className="text-[10px] text-slate-500 mb-0.5">除臭设备状态</div>
                      <div className="text-sm font-medium text-emerald-600">运行中 (高功率模式)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="col-span-2 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <Wind className="w-4 h-4 mr-2 text-slate-400" />
                  近1小时浓度趋势
                </h4>
                <div className="h-48 bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <ReferenceLine y={selectedAlarm.threshold} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '预警阈值', fill: '#ef4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} name="臭气浓度" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-64 shrink-0 text-slate-400">
            请选择左侧报警记录查看详情
          </div>
        )}

        {/* Bottom: Map */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">GIS 地图加载中...</p>
            <p className="text-sm text-slate-400 mt-1">将显示报警转运站位置及周边环境信息</p>
          </div>
        </div>
      </div>
    </div>
  );
}
