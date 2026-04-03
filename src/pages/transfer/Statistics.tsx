import React, { useEffect, useState } from 'react';
import { 
  BarChart2, TrendingUp, PieChart as PieIcon, Activity, 
  Calendar, Download, Filter, ChevronRight, Building2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { queryTransferStatistics } from '../../api/services/transfer';
import { TransferStatistics } from '../../types/transfer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<TransferStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await queryTransferStatistics();
      if (res.code === 0) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch transfer statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading || !stats) {
    return <div className="p-8 text-center text-slate-400">加载统计数据中...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6 pr-2">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">设施统计分析</h1>
          <p className="text-slate-500 mt-1">转运设施运行效率、垃圾量趋势与区域对比分析</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>2026年3月</span>
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>导出分析报告</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/transfer/measurement')}
        >
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm font-bold">累计转运总量</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900 font-headline">{(stats.totalWeight / 10000).toFixed(1)}</span>
            <span className="text-slate-400 font-bold mb-1">万吨</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-emerald-500 font-bold">+12.5%</span>
            <span className="text-slate-400">较去年同期</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/transfer/measurement')}
        >
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-bold">本月转运量</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900 font-headline">{stats.monthlyWeight.toLocaleString()}</span>
            <span className="text-slate-400 font-bold mb-1">吨</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-emerald-500 font-bold">+5.2%</span>
            <span className="text-slate-400">较上月同期</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/transfer/measurement')}
        >
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-bold">日均转运量</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900 font-headline">{stats.dailyAverage.toFixed(1)}</span>
            <span className="text-slate-400 font-bold mb-1">吨/日</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span>运行平稳</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/transfer/stations')}
        >
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-bold">在管转运站</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900 font-headline">{stats.stationCount}</span>
            <span className="text-slate-400 font-bold mb-1">座</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-blue-500 font-bold">全部在线</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">月度垃圾转运量趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">各区域垃圾量占比</h3>
          <div className="flex h-72">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.regionalStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="weight"
                    nameKey="region"
                  >
                    {stats.regionalStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-48 flex flex-col justify-center gap-4">
              {stats.regionalStats.map((item, index) => (
                <div key={item.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-slate-600">{item.region}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/transfer/operation')}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">关键设备利用率分析</h3>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.equipmentUtilization} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.equipmentUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">数据洞察</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-1">转运高峰预警</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                预计下周受节假日影响，普陀区转运站负荷将增加15%，建议提前调配收运车辆。
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 text-sm mb-1">设备效能提升</h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                本月压缩机平均利用率提升了3.2%，主要得益于收运路线的优化减少了等待时间。
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="font-bold text-orange-900 text-sm mb-1">维护建议</h4>
              <p className="text-xs text-orange-700 leading-relaxed">
                徐汇区2号地磅近期校准偏差略大，建议在下周三前安排专业人员进行维护。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
