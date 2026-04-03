import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queryDisposalFacilities, queryDisposalMonitor } from '../../api/services/facility';
import { DisposalFacility, DisposalMonitorData } from '../../types/facility';
import { 
  Activity, Thermometer, Gauge, Zap, Droplets, Wind, AlertTriangle, 
  CheckCircle, Clock, Search, ChevronRight, Beaker, Flame, Trash2, 
  Waves, Recycle, Biohazard, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const DisposalMonitor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const facilityIdFromUrl = searchParams.get('id');

  const [facilities, setFacilities] = useState<DisposalFacility[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [monitorData, setMonitorData] = useState<DisposalMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await queryDisposalFacilities();
        setFacilities(res.data);
        if (facilityIdFromUrl) {
          setSelectedId(facilityIdFromUrl);
        } else if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      }
    };
    fetchFacilities();
  }, [facilityIdFromUrl]);

  useEffect(() => {
    if (!selectedId) return;
    const fetchMonitor = async () => {
      setLoading(true);
      try {
        const res = await queryDisposalMonitor(selectedId);
        setMonitorData(res.data);
      } catch (error) {
        console.error('Failed to fetch monitor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 30000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const selectedFacility = facilities.find(f => f.id === selectedId);

  const filteredFacilities = facilities.filter(f => 
    filterType === 'all' || f.type === filterType
  );

  // 焚烧厂排放数据
  const incinerationEmissions = [
    { name: 'CO', value: monitorData?.metrics.emissions?.co || 0, limit: 50 },
    { name: 'SO2', value: monitorData?.metrics.emissions?.so2 || 0, limit: 80 },
    { name: 'NOx', value: monitorData?.metrics.emissions?.nox || 0, limit: 200 },
    { name: '粉尘', value: monitorData?.metrics.emissions?.dust || 0, limit: 20 },
    { name: 'HCl', value: monitorData?.metrics.emissions?.hcl || 0, limit: 50 },
    { name: 'HF', value: monitorData?.metrics.emissions?.hf || 0, limit: 1 },
  ];

  // 餐厨资源化产品数据
  const kitchenProducts = [
    { name: '有机肥', value: monitorData?.metrics.resourceProducts?.fertilizer || 0, fill: '#10b981' },
    { name: '沼气', value: monitorData?.metrics.resourceProducts?.biogas || 0, fill: '#f59e0b' },
    { name: '油脂', value: monitorData?.metrics.wasteOil || 0, fill: '#3b82f6' },
    { name: '污泥', value: monitorData?.metrics.resourceProducts?.sludge || 0, fill: '#64748b' },
  ];

  const renderDashboard = () => {
    if (!selectedFacility || !monitorData) return null;

    switch (selectedFacility.type) {
      case 'incineration':
        return (
          <div className="space-y-6">
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: '炉膛温度', value: monitorData.metrics.temperature || 850, unit: '℃', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: '系统压力', value: monitorData.metrics.pressure || 1.2, unit: 'MPa', icon: Gauge, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '实时功率', value: monitorData.metrics.powerUsage, unit: 'kW', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '每小时用水', value: monitorData.metrics.waterUsage, unit: 'm³/h', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}<span className="text-xs ml-1 font-normal text-slate-400">{metric.unit}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 排放监测 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-500" />
                  环保指标实时监测 (mg/m³)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incinerationEmissions} layout="vertical" margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                        {incinerationEmissions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value > entry.limit ? '#ef4444' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  运行工况趋势
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 12 }).map((_, i) => ({ time: `${i*2}:00`, temp: 800 + Math.random() * 100, emissions: 40 + Math.random() * 20 }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Area type="monotone" dataKey="temp" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="emissions" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'landfill':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: '渗滤液水位', value: monitorData.metrics.leachateLevel || 0, unit: 'm', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '甲烷浓度', value: ((monitorData.metrics.methaneConcentration || 0) * 100).toFixed(2), unit: '%', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '用电量', value: monitorData.metrics.powerUsage, unit: 'kW', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '用水量', value: monitorData.metrics.waterUsage, unit: 'm³/h', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}<span className="text-xs ml-1 font-normal text-slate-400">{metric.unit}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-blue-500" />
                  渗滤液监测指标
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'COD', value: 450, limit: 500, unit: 'mg/L' },
                    { name: '氨氮', value: 22, limit: 25, unit: 'mg/L' },
                    { name: '总磷', value: 0.8, limit: 1.0, unit: 'mg/L' },
                    { name: '悬浮物', value: 120, limit: 150, unit: 'mg/L' },
                  ].map(item => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-600">{item.name}</span>
                        <span className="text-slate-400">{item.value} / {item.limit} {item.unit}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${item.value > item.limit * 0.9 ? 'bg-orange-500' : 'bg-blue-500'}`}
                          style={{ width: `${(item.value / item.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-500" />
                  填埋气监测趋势
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 12 }).map((_, i) => ({ time: `${i*2}:00`, ch4: 0.01 + Math.random() * 0.02, co2: 0.05 + Math.random() * 0.05 }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Area type="monotone" dataKey="ch4" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="co2" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'kitchen':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: '污水处理量', value: monitorData.metrics.sewageTreatment || 0, unit: 'm³', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '生活废渣量', value: monitorData.metrics.solidResidue || 0, unit: 't', icon: Trash2, color: 'text-slate-500', bg: 'bg-slate-50' },
                { label: '废油脂量', value: monitorData.metrics.wasteOil || 0, unit: 't', icon: Beaker, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '资源产出', value: (monitorData.metrics.resourceProducts?.fertilizer || 0) + (monitorData.metrics.resourceProducts?.sludge || 0), unit: 't', icon: Recycle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}<span className="text-xs ml-1 font-normal text-slate-400">{metric.unit}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-500" />
                  资源化产品产出构成
                </h3>
                <div className="h-80 flex items-center">
                  <div className="flex-1 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={kitchenProducts}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {kitchenProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-40 space-y-4">
                    {kitchenProducts.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-bold">{item.name}</p>
                          <p className="text-sm font-bold text-slate-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  处理量趋势分析
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Array.from({ length: 7 }).map((_, i) => ({ day: `3-${20+i}`, value: 400 + Math.random() * 100 }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hazardous':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: '危废库存量', value: monitorData.metrics.solidResidue || 0, unit: 't', icon: Biohazard, color: 'text-red-500', bg: 'bg-red-50' },
                { label: '今日处置量', value: monitorData.metrics.powerUsage / 10, unit: 't', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '废气处理率', value: 99.9, unit: '%', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '系统负荷', value: 75, unit: '%', icon: Gauge, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}<span className="text-xs ml-1 font-normal text-slate-400">{metric.unit}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-red-500" />
                  危废分类库存 (t)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '废酸', value: 45 },
                      { name: '废碱', value: 32 },
                      { name: '有机溶剂', value: 68 },
                      { name: '重金属污泥', value: 120 },
                      { name: '废矿物油', value: 85 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Bar dataKey="value" fill="#ef4444" radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  处置过程参数监控
                </h3>
                <div className="space-y-6">
                  {[
                    { name: '焚烧炉温', value: 1150, limit: 1100, unit: '℃', color: 'bg-orange-500' },
                    { name: '反应釜压力', value: 0.8, limit: 1.0, unit: 'MPa', color: 'bg-blue-500' },
                    { name: '废气含氧量', value: 8.5, limit: 10, unit: '%', color: 'bg-emerald-500' },
                    { name: '洗涤塔pH值', value: 7.2, limit: 9, unit: 'pH', color: 'bg-indigo-500' },
                  ].map(item => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-600">{item.name}</span>
                        <span className="text-slate-400 font-mono">{item.value} / {item.limit} {item.unit}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${item.color}`}
                          style={{ width: `${Math.min((item.value / item.limit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
            <Biohazard className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">暂无该类型设施的详细监控视图</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      {/* 左侧设施选择 */}
      <div className="w-80 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Activity className="w-4 h-4 text-primary" />
            设施监控列表
          </h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="搜索设施..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs" />
            </div>
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">全部</option>
                <option value="incineration">焚烧厂</option>
                <option value="landfill">填埋场</option>
                <option value="kitchen">餐厨厂</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredFacilities.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all group ${
                selectedId === f.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{f.name}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === f.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  selectedId === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {f.type === 'incineration' ? '焚烧' : f.type === 'landfill' ? '填埋' : f.type === 'kitchen' ? '餐厨' : '危废'}
                </span>
                <span className={`text-[10px] font-bold ${selectedId === f.id ? 'text-white/70' : 'text-slate-400'}`}>
                  {f.status === 'normal' ? '运行中' : '维护中'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧监控面板 */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <AnimatePresence mode="wait">
          {selectedFacility && monitorData ? (
            <motion.div
              key={selectedFacility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* 状态概览 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedFacility.name}</h2>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 最后更新: {monitorData.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">系统状态</p>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                      <CheckCircle className="w-4 h-4" /> 运行正常
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">告警级别</p>
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <AlertTriangle className="w-4 h-4" /> 无告警
                    </div>
                  </div>
                </div>
              </div>

              {/* 根据类型渲染不同的仪表盘 */}
              {renderDashboard()}

            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-slate-100">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-400 font-bold">正在加载监控数据...</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DisposalMonitor;
