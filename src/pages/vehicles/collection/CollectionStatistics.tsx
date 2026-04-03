import React, { useEffect, useState } from 'react';
import { queryCollectionStatistics } from '../../../api/services/collection';
import { CollectionStatistic } from '../../../types/collection';
import { TrendingUp, BarChart as BarIcon, PieChart as PieIcon, Calendar, Download, Trash2, Truck, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'motion/react';

const CollectionStatistics: React.FC = () => {
  const [stats, setStats] = useState<CollectionStatistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryCollectionStatistics().then(res => {
      if (res.code === 0) setStats(res.data);
      setLoading(false);
    });
  }, []);

  const COLORS = ['#004275', '#005a9c', '#4b607b', '#727781'];
  const breakdownData = stats.length > 0 ? [
    { name: '干垃圾', value: stats[stats.length - 1].categoryBreakdown.dry },
    { name: '湿垃圾', value: stats[stats.length - 1].categoryBreakdown.wet },
    { name: '可回收物', value: stats[stats.length - 1].categoryBreakdown.recyclable },
    { name: '有害垃圾', value: stats[stats.length - 1].categoryBreakdown.hazardous },
  ] : [];

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运数据统计</h1>
          <p className="text-slate-500 mt-1">全区生活垃圾收运总量与趋势分析</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>导出报表</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-primary rounded-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-500 font-bold">今日收运总量</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-headline">145.8<span className="text-sm ml-1">吨</span></p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+5.2% 较昨日</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-500 font-bold">活跃收运车辆</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-headline">42<span className="text-sm ml-1">辆</span></p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>95.4% 出车率</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-500 font-bold">平均收运效率</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-headline">92.5<span className="text-sm ml-1">%</span></p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+1.2% 较上周</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-500 font-bold">累计覆盖点位</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-headline">1,245<span className="text-sm ml-1">个</span></p>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-bold">
            <span>全区 100% 覆盖</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            收运量趋势 (近7日)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004275" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#004275" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="totalWeight" stroke="#004275" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-primary" />
            垃圾分类占比
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {breakdownData.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm text-slate-600 font-bold">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value.toFixed(1)} 吨</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionStatistics;
