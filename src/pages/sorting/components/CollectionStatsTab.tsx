import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Download, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#10b981', '#64748b', '#3b82f6', '#f43f5e'];

const CollectionStatsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState('today'); // today, week, month, year

  const barData = [
    { name: '浦东新区', 厨余垃圾: 4000, 其他垃圾: 2400, 可回收物: 2400, 有害垃圾: 400 },
    { name: '黄浦区', 厨余垃圾: 3000, 其他垃圾: 1398, 可回收物: 2210, 有害垃圾: 200 },
    { name: '徐汇区', 厨余垃圾: 2000, 其他垃圾: 9800, 可回收物: 2290, 有害垃圾: 100 },
    { name: '长宁区', 厨余垃圾: 2780, 其他垃圾: 3908, 可回收物: 2000, 有害垃圾: 300 },
    { name: '静安区', 厨余垃圾: 1890, 其他垃圾: 4800, 可回收物: 2181, 有害垃圾: 150 },
    { name: '普陀区', 厨余垃圾: 2390, 其他垃圾: 3800, 可回收物: 2500, 有害垃圾: 250 },
    { name: '虹口区', 厨余垃圾: 3490, 其他垃圾: 4300, 可回收物: 2100, 有害垃圾: 350 },
  ];

  const pieData = [
    { name: '厨余垃圾', value: 400 },
    { name: '其他垃圾', value: 300 },
    { name: '可回收物', value: 300 },
    { name: '有害垃圾', value: 200 },
  ];

  const handleExport = () => {
    toast.success('统计报表导出任务已提交');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  dateRange === range
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range === 'today' ? '今日' : range === 'week' ? '本周' : range === 'month' ? '本月' : '全年'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
            查询
          </button>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          <Download className="w-4 h-4" /> 导出报表
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: '总收运量 (t)', value: '12,450.5', trend: '+5.2%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: '收运车次', value: '3,240', trend: '+2.1%', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: '任务完成率', value: '98.5%', trend: '+0.5%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { title: '异常事件', value: '12', trend: '-15.4%', icon: PieChart, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{kpi.title}</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{kpi.value}</span>
                <span className={`text-xs font-bold mb-1 ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">区域分类垃圾计量统计</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="厨余垃圾" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={40} />
                <Bar dataKey="其他垃圾" stackId="a" fill="#64748b" maxBarSize={40} />
                <Bar dataKey="可回收物" stackId="a" fill="#3b82f6" maxBarSize={40} />
                <Bar dataKey="有害垃圾" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">全市分类收集量占比</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionStatsTab;
