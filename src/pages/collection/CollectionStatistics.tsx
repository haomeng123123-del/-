import React from 'react';
import { BarChart3, TrendingUp, Truck, Trash2, Activity, Map } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const CollectionStatistics: React.FC = () => {
  const weeklyData = [
    { name: '周一', weight: 120, trips: 45 },
    { name: '周二', weight: 132, trips: 48 },
    { name: '周三', weight: 101, trips: 40 },
    { name: '周四', weight: 145, trips: 52 },
    { name: '周五', weight: 150, trips: 55 },
    { name: '周六', weight: 180, trips: 65 },
    { name: '周日', weight: 190, trips: 70 },
  ];

  const regionData = [
    { name: '静安寺街道', value: 450 },
    { name: '南京西路街道', value: 380 },
    { name: '曹家渡街道', value: 290 },
    { name: '江宁路街道', value: 310 },
    { name: '石门二路街道', value: 250 },
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运统计分析</h1>
          <p className="text-slate-500 mt-1">垃圾收运量、车次与区域分布多维分析</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Trash2 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">今日总收运量 (吨)</p>
            <h3 className="text-3xl font-black text-slate-900">145.2</h3>
            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 较昨日 +5.2%
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">今日出车车次</p>
            <h3 className="text-3xl font-black text-slate-900">52</h3>
            <p className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-1">
              <Activity className="w-3 h-3" /> 与昨日持平
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
              <Map className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">覆盖点位</p>
            <h3 className="text-3xl font-black text-slate-900">1,245</h3>
            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 新增 12 个
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">平均满载率</p>
            <h3 className="text-3xl font-black text-slate-900">85.4%</h3>
            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 较上周 +2.1%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-900">近七日收运量趋势 (吨)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#004275" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-900">各区域收运量对比 (本月/吨)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#004275" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionStatistics;
