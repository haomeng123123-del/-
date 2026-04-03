import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Map, 
  Search,
  Filter,
  Cpu,
  Star,
  Activity,
  MapPin,
  Video,
  Trash2,
  Wind,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- Mock Data ---

const KPIS = [
  { title: '示范街总数', value: '5', unit: '条', icon: Map, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '平均综合得分', value: '96.5', unit: '分', icon: Star, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { title: '智能设备在线率', value: '98.2', unit: '%', icon: Cpu, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { title: '今日感知事件', value: '24', unit: '起', icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' },
];

const STREETS = [
  { id: 'ST-001', name: '深南大道科技园段', district: '南山区', score: 98, devices: 120, events: 5, status: 'excellent' },
  { id: 'ST-002', name: '福田CBD中心区', district: '福田区', score: 95, devices: 150, events: 8, status: 'excellent' },
  { id: 'ST-003', name: '宝安海滨广场周边', district: '宝安区', score: 92, devices: 80, events: 12, status: 'good' },
  { id: 'ST-004', name: '罗湖万象城商圈', district: '罗湖区', score: 94, devices: 110, events: 6, status: 'excellent' },
  { id: 'ST-005', name: '龙华北站商务区', district: '龙华区', score: 89, devices: 95, events: 15, status: 'good' },
];

const DEVICE_DATA = [
  { name: '智能垃圾桶', value: 45, color: '#3b82f6' },
  { name: 'AI摄像头', value: 30, color: '#10b981' },
  { name: '环境监测站', value: 15, color: '#8b5cf6' },
  { name: '智能公厕', value: 10, color: '#f59e0b' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    excellent: { label: '优秀', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    good: { label: '良好', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function DemoStreet() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStreet, setSelectedStreet] = useState<typeof STREETS[0] | null>(STREETS[0]);

  const filteredStreets = STREETS.filter(s => 
    s.name.includes(searchQuery) || s.district.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {KPIS.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center space-x-4"
          >
            <div className={cn("p-3 rounded-xl", kpi.bgColor, kpi.color)}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">{kpi.title}</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Left Panel: List */}
        <div className="w-[380px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">示范街列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索街道名称/行政区..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredStreets.map((street) => (
              <div
                key={street.id}
                onClick={() => setSelectedStreet(street)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedStreet?.id === street.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">{street.name}</span>
                  </div>
                  <StatusBadge status={street.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">综合得分</div>
                    <div className={cn(
                      "text-sm font-bold",
                      street.score >= 95 ? "text-emerald-600" : "text-blue-600"
                    )}>{street.score}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">智能设备</div>
                    <div className="text-sm font-bold text-slate-700">{street.devices}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">今日事件</div>
                    <div className="text-sm font-bold text-orange-600">{street.events}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedStreet ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedStreet.name}</h2>
                    <div className="text-sm text-slate-500 mt-1">所属区域: {selectedStreet.district} | 编号: {selectedStreet.id}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => navigate('/comprehensive/video')}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    查看3D实景
                  </button>
                  <button 
                    onClick={() => navigate('/sorting/online-report')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    生成运行报告
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Device Distribution */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">智能设备分布</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={DEVICE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {DEVICE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="middle" align="right" layout="vertical" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Real-time Status */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">实时运行状态</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <div className="flex items-center space-x-2">
                          <Trash2 className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">垃圾桶满溢率</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">2.5% (正常)</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">空气质量 (AQI)</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">35 (优)</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">AI 识别事件处理率</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">95.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">设备在线率</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">99.1%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Events */}
                  <div className="col-span-2 bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800">最新感知事件</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        查看全部 <ChevronRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { time: '10:15:22', type: '垃圾桶满溢', location: '科技南路01号智能桶', status: '已派单' },
                        { time: '09:30:10', type: '暴露垃圾', location: '白石路人行道', status: '处理中' },
                        { time: '08:45:05', type: '违规停车', location: '科技园南区公交站', status: '已处理' },
                      ].map((event, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-500 w-20">{event.time}</div>
                            <div className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs font-medium w-24 text-center">{event.type}</div>
                            <div className="text-sm text-slate-800">{event.location}</div>
                          </div>
                          <div className={cn(
                            "text-sm font-medium",
                            event.status === '已处理' ? 'text-emerald-600' : 'text-blue-600'
                          )}>{event.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧示范街查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
