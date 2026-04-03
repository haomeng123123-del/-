import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Map, 
  Search,
  Filter,
  AlertCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Camera,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data ---

const KPIS = [
  { title: '当前薄弱区域', value: '12', unit: '个', icon: Map, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: '平均洁净度得分', value: '76.5', unit: '分', icon: AlertCircle, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '本月已改善区域', value: '5', unit: '个', icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
];

const WEAK_AREAS = [
  { id: 'WA-001', name: '科技园南区背街小巷', district: '南山区', score: 65, status: 'critical', issues: 15, lastInspection: '2023-10-27 09:00' },
  { id: 'WA-002', name: '华强北商业街周边', district: '福田区', score: 72, status: 'warning', issues: 8, lastInspection: '2023-10-27 10:30' },
  { id: 'WA-003', name: '东门老街步行街', district: '罗湖区', score: 68, status: 'critical', issues: 12, lastInspection: '2023-10-26 15:20' },
  { id: 'WA-004', name: '宝安中心区施工路段', district: '宝安区', score: 75, status: 'warning', issues: 5, lastInspection: '2023-10-27 08:15' },
  { id: 'WA-005', name: '龙华汽车站周边', district: '龙华区', score: 82, status: 'improving', issues: 2, lastInspection: '2023-10-25 14:00' },
];

const CHART_DATA = [
  { date: '10-21', score: 60 },
  { date: '10-22', score: 62 },
  { date: '10-23', score: 58 },
  { date: '10-24', score: 65 },
  { date: '10-25', score: 64 },
  { date: '10-26', score: 68 },
  { date: '10-27', score: 65 },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    critical: { label: '严重薄弱', className: 'bg-red-100 text-red-700 border-red-200' },
    warning: { label: '一般薄弱', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    improving: { label: '正在改善', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function WeakAreaAnalysis() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<typeof WEAK_AREAS[0] | null>(WEAK_AREAS[0]);

  const filteredAreas = WEAK_AREAS.filter(a => 
    a.name.includes(searchQuery) || a.district.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
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
              <h2 className="text-lg font-bold text-slate-800">薄弱区域列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索区域名称/行政区..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredAreas.map((area) => (
              <div
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedArea?.id === area.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">{area.name}</span>
                  </div>
                  <StatusBadge status={area.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">洁净度得分</div>
                    <div className={cn(
                      "text-sm font-bold",
                      area.score >= 80 ? "text-emerald-600" : area.score >= 70 ? "text-orange-600" : "text-red-600"
                    )}>{area.score}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">遗留问题数</div>
                    <div className="text-sm font-bold text-slate-700">{area.issues}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">所属行政区</div>
                    <div className="text-xs font-medium text-slate-700 mt-0.5">{area.district}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedArea ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedArea.name}</h2>
                    <div className="text-sm text-slate-500 mt-1">区域编号: {selectedArea.id} | 最后巡查: {selectedArea.lastInspection}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => navigate('/comprehensive/inspection')}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    查看巡查轨迹
                  </button>
                  <button 
                    onClick={() => navigate('/comprehensive/inspection')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    下发督办单
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Trend Chart */}
                  <div className="col-span-2 bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">近7天洁净度得分趋势</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Area Details */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">区域画像</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <span className="text-sm text-slate-500">主要问题类型</span>
                        <span className="text-sm font-medium text-slate-800">暴露垃圾、路面油污</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <span className="text-sm text-slate-500">高发时段</span>
                        <span className="text-sm font-medium text-slate-800">18:00 - 22:00</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                        <span className="text-sm text-slate-500">责任标段</span>
                        <span className="text-sm font-medium text-slate-800">南山一标段</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">责任企业</span>
                        <span className="text-sm font-medium text-blue-600">南山环卫一公司</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Issues */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800">近期未整改问题</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        查看全部 <ChevronRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { time: '10-27 09:15', type: '暴露垃圾', location: '科技南路与白石路交汇处', img: true },
                        { time: '10-26 18:30', type: '垃圾桶满溢', location: '科技园南区公交站旁', img: true },
                        { time: '10-26 14:20', type: '路面油污', location: '科技南十二路餐饮街', img: false },
                      ].map((issue, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-xs text-slate-500 w-20">{issue.time}</div>
                            <div className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs font-medium">{issue.type}</div>
                            <div className="text-sm text-slate-800 truncate max-w-[120px]">{issue.location}</div>
                          </div>
                          {issue.img && (
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                              <Camera className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧薄弱区域查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
