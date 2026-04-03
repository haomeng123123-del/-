import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  MapPin, 
  Search,
  Filter,
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data ---

const ANOMALIES = [
  { id: 'VOL-001', location: '南山区科技园中区收集点', type: '骤增', current: 4.5, average: 2.1, unit: '吨', time: '2023-10-27', status: 'unprocessed', description: '该收集点今日垃圾量较历史平均值骤增 114%。' },
  { id: 'VOL-002', location: '福田区华强北商业街', type: '骤减', current: 1.2, average: 3.5, unit: '吨', time: '2023-10-26', status: 'processing', description: '该区域垃圾量异常减少，可能存在收运遗漏或数据未上传。' },
  { id: 'VOL-003', location: '宝安区西乡步行街', type: '骤增', current: 5.8, average: 3.0, unit: '吨', time: '2023-10-26', status: 'processed', description: '周末人流量大导致垃圾量激增，已临时增加收运频次。' },
  { id: 'VOL-004', location: '罗湖区东门老街', type: '骤增', current: 6.2, average: 4.5, unit: '吨', time: '2023-10-25', status: 'unprocessed', description: '节假日效应明显，垃圾量超出预警阈值。' },
  { id: 'VOL-005', location: '龙华区富士康周边', type: '骤减', current: 2.0, average: 4.2, unit: '吨', time: '2023-10-24', status: 'processed', description: '工厂放假导致周边生活垃圾量大幅下降。' },
];

// --- Chart Data ---

const CHART_DATA = [
  { time: '10-21', current: 2.0, average: 2.1 },
  { time: '10-22', current: 2.2, average: 2.1 },
  { time: '10-23', current: 2.1, average: 2.1 },
  { time: '10-24', current: 2.3, average: 2.1 },
  { time: '10-25', current: 2.0, average: 2.1 },
  { time: '10-26', current: 2.4, average: 2.1 },
  { time: '10-27', current: 4.5, average: 2.1 }, // Anomaly spike
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    unprocessed: { label: '待核实', className: 'bg-red-100 text-red-700 border-red-200' },
    processing: { label: '核实中', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    processed: { label: '已处理', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function VolumeAnomaly() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<typeof ANOMALIES[0] | null>(ANOMALIES[0]);

  const filteredAnomalies = ANOMALIES.filter(a => 
    a.location.includes(searchQuery) || a.type.includes(searchQuery)
  );

  return (
    <div className="h-full flex space-x-4">
      {/* Left Panel: List */}
      <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">垃圾量异常识别</h2>
            <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索地点/异常类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              onClick={() => setSelectedAnomaly(anomaly)}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-all border",
                selectedAnomaly?.id === anomaly.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium flex items-center",
                    anomaly.type === '骤增' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {anomaly.type === '骤增' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {anomaly.type}
                  </span>
                  <span className="text-xs text-slate-500">{anomaly.id}</span>
                </div>
                <StatusBadge status={anomaly.status} />
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">{anomaly.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    {anomaly.time}
                  </div>
                  <div className="text-slate-700 font-medium">
                    {anomaly.current} {anomaly.unit} <span className="text-slate-400 font-normal">(均值 {anomaly.average})</span>
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
        {selectedAnomaly ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedAnomaly.type === '骤增' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                )}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">异常分析 - {selectedAnomaly.id}</h3>
                  <div className="text-xs text-slate-500">发生日期: {selectedAnomaly.time}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  派发核查
                </button>
                <button 
                  onClick={() => navigate('/comprehensive/collection')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  调整收运计划
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Analysis Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-slate-400" />
                  异常详情
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 space-y-3 border border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">AI 研判描述</div>
                    <div className="text-sm text-slate-800">{selectedAnomaly.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">当日垃圾量</div>
                      <div className={cn(
                        "text-lg font-bold",
                        selectedAnomaly.type === '骤增' ? "text-red-600" : "text-orange-600"
                      )}>{selectedAnomaly.current} <span className="text-xs font-normal text-slate-500">{selectedAnomaly.unit}</span></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">历史日均值</div>
                      <div className="text-lg font-bold text-slate-700">{selectedAnomaly.average} <span className="text-xs font-normal text-slate-500">{selectedAnomaly.unit}</span></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                      <div className="text-[10px] text-slate-500 mb-0.5">偏差比例</div>
                      <div className={cn(
                        "text-sm font-bold",
                        selectedAnomaly.type === '骤增' ? "text-red-600" : "text-orange-600"
                      )}>
                        {selectedAnomaly.type === '骤增' ? '+' : '-'}{Math.abs(Math.round(((selectedAnomaly.current - selectedAnomaly.average) / selectedAnomaly.average) * 100))}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="col-span-2 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-slate-400" />
                  近7日垃圾量趋势
                </h4>
                <div className="h-48 bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="average" stroke="#94a3b8" strokeDasharray="5 5" fill="none" name="历史均值" />
                      <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" name="实际垃圾量" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-64 shrink-0 text-slate-400">
            请选择左侧记录查看异常详情
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
            <p className="text-sm text-slate-400 mt-1">将显示异常收集点位置及周边收运路线</p>
          </div>
        </div>
      </div>
    </div>
  );
}
