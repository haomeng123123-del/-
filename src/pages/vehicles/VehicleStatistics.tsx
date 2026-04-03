import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Truck, AlertTriangle, Fuel, Activity, Navigation } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { queryVehicleStats } from '../../api/services/sanitation';
import { VehicleStats } from '../../types/sanitation';

const VehicleStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicleStats();
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch vehicle stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mileageData = [
    { name: '周一', value: 400 },
    { name: '周二', value: 600 },
    { name: '周三', value: 450 },
    { name: '周四', value: 800 },
    { name: '周五', value: 550 },
    { name: '周六', value: 900 },
    { name: '周日', value: 750 },
  ];

  const alarmData = [
    { name: '超速', value: 12 },
    { name: '偏离路线', value: 8 },
    { name: '疲劳驾驶', value: 5 },
  ];
  const ALARM_COLORS = ['#ef4444', '#f97316', '#f59e0b'];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆统计分析</h1>
          <p className="text-slate-500 mt-1">环卫车辆运行数据多维分析</p>
        </div>
      </header>

      {loading ? (
        <div className="p-8 text-center text-slate-400">加载中...</div>
      ) : !stats ? (
        <div className="p-8 text-center text-slate-400">暂无数据</div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">总车辆数</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.totalVehicles}</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">在线车辆</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.onlineVehicles}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">作业中车辆</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.workingVehicles}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <Navigation className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">总行驶里程 (km)</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.totalMileage}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">今日报警数</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.totalAlarms}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                  <Fuel className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">总能耗 (L/kWh)</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.fuelConsumption}</h3>
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-900">近七日作业里程趋势</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mileageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-slate-900">报警类型分布</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alarmData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {alarmData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALARM_COLORS[index % ALARM_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {alarmData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ALARM_COLORS[index % ALARM_COLORS.length] }}></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleStatisticsPage;
