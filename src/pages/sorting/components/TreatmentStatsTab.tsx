import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Download, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#10b981', '#64748b', '#3b82f6', '#f43f5e'];

const TreatmentStatsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState('today');

  const barData = [
    { name: '浦东处理厂', 厨余垃圾: 4000, 其他垃圾: 2400, 可回收物: 2400, 有害垃圾: 400 },
    { name: '老港基地', 厨余垃圾: 3000, 其他垃圾: 1398, 可回收物: 2210, 有害垃圾: 200 },
    { name: '嘉定中心', 厨余垃圾: 2000, 其他垃圾: 9800, 可回收物: 2290, 有害垃圾: 100 },
    { name: '闵行处理厂', 厨余垃圾: 2780, 其他垃圾: 3908, 可回收物: 2000, 有害垃圾: 300 },
  ];

  const pieData = [
    { name: '厨余垃圾', value: 400 },
    { name: '其他垃圾', value: 300 },
    { name: '可回收物', value: 300 },
    { name: '有害垃圾', value: 200 },
  ];

  const lineData = [
    { time: '00:00', value: 120 },
    { time: '04:00', value: 80 },
    { time: '08:00', value: 450 },
    { time: '12:00', value: 600 },
    { time: '16:00', value: 550 },
    { time: '20:00', value: 300 },
    { time: '24:00', value: 150 },
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
          { title: '总处理量 (t)', value: '8,450.5', trend: '+4.2%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: '进场车次', value: '1,240', trend: '+1.1%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: '产能利用率', value: '88.5%', trend: '+2.5%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { title: '异常报警', value: '5', trend: '-10.4%', icon: PieChart, color: 'text-rose-500', bg: 'bg-rose-50' },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">各设施处理量统计</h3>
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
          <h3 className="text-lg font-bold text-slate-900 mb-6">处理量趋势 (24小时)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentStatsTab;
