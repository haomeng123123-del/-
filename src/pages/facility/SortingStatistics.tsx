import React, { useEffect, useState } from 'react';
import { querySortingStats } from '../../api/services/facility';
import { SortingStats } from '../../types/facility';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Award, MapPin, Scale } from 'lucide-react';
import { motion } from 'motion/react';

const SortingStatistics: React.FC = () => {
  const [stats, setStats] = useState<SortingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await querySortingStats();
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch sorting stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <BarChart3 className="w-8 h-8 animate-pulse mb-2" />
        <p>加载统计数据中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 核心指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: '本月总投放量', value: '35.8', unit: 't', icon: Scale, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '平均分类准确率', value: '92.5', unit: '%', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: '活跃分类点位', value: '156', unit: '个', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: '分类参与率', value: '88.2', unit: '%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900">{item.value}<span className="text-xs ml-1 font-normal text-slate-400">{item.unit}</span></p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 分类构成分析 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            垃圾分类构成分析
          </h3>
          <div className="h-80 flex items-center">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.byCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-48 space-y-4">
              {stats.byCategory.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-bold">{item.name}</p>
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      <span className="text-[10px] text-slate-400">{(item.value / stats.byCategory.reduce((acc, curr) => acc + curr.value, 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 投放趋势分析 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            近7日投放量与准确率趋势
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Area yAxisId="left" type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" name="投放量 (kg)" />
                <Area yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} fill="none" name="准确率 (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 准确率分布 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            点位分类准确率分布
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byAccuracy}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 优秀点位排行 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            分类标杆点位排行
          </h3>
          <div className="space-y-4">
            {stats.topPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-amber-100 text-amber-600' : 
                  idx === 1 ? 'bg-slate-200 text-slate-600' : 
                  idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-white text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{point.name}</p>
                  <p className="text-[10px] text-slate-400">累计投放: {point.weight} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">{point.accuracy}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">准确率</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingStatistics;
