import React, { useState } from 'react';
import { Download, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const PersonnelStatistics: React.FC = () => {
  const [showToast, setShowToast] = useState('');
  const [timeRange, setTimeRange] = useState('全部部门');

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  const roleData = [
    { name: '清扫工', value: 850 },
    { name: '清运司机', value: 210 },
    { name: '巡查员', value: 120 },
    { name: '管理人员', value: 68 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const ageData = [
    { name: '20-30岁', value: 150 },
    { name: '31-40岁', value: 320 },
    { name: '41-50岁', value: 480 },
    { name: '51-60岁', value: 298 },
  ];

  const attendanceData = [
    { date: '10-01', rate: 95 },
    { date: '10-05', rate: 96 },
    { date: '10-10', rate: 94 },
    { date: '10-15', rate: 97 },
    { date: '10-20', rate: 96.5 },
    { date: '10-25', rate: 98 },
  ];

  const deptData = [
    { name: '静安寺', count: 320 },
    { name: '南京西路', count: 280 },
    { name: '曹家渡', count: 210 },
    { name: '江宁路', count: 190 },
    { name: '石门二路', count: 150 },
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Download className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">人员统计分析</h1>
          <p className="text-slate-500 mt-1">环卫人员综合数据分析看板</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-slate-700"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>全部部门</option>
            <option>静安寺班组</option>
            <option>南京西路班组</option>
            <option>运输车队</option>
          </select>
          <button onClick={() => handleAction('正在导出报表...')} className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600 font-bold text-sm flex items-center gap-2">
            导出报表
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold mb-2">在职总人数</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-slate-800">1,248</p>
            <p className="text-sm text-emerald-500 font-bold mb-1">+12 本月</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold mb-2">平均年龄</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-slate-800">46.5</p>
            <p className="text-sm text-slate-400 font-bold mb-1">岁</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold mb-2">今日出勤率</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-slate-800">96.5</p>
            <p className="text-sm text-slate-400 font-bold mb-1">%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold mb-2">异常考勤</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-orange-500">15</p>
            <p className="text-sm text-slate-400 font-bold mb-1">人次</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">岗位属性分布</h3>
            <PieChartIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {roleData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-slate-600 font-bold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">年龄结构统计</h3>
            <BarChartIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">近30天出勤率趋势</h3>
            <LineChartIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={['dataMin - 2', 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">各部门人员分布</h3>
            <BarChartIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelStatistics;
