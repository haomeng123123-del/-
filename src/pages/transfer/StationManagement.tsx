import React, { useState, useEffect } from 'react';
import { MapPin, Building2, TrendingUp, Download, PieChart as PieChartIcon, ArrowRight, X, Scale, Video, Settings } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { queryTransferStationStats } from '../../api/services/transfer';
import { TransferStationStat } from '../../types/transfer';
import { useNavigate } from 'react-router-dom';

const StationManagement: React.FC = () => {
  const [stats, setStats] = useState<TransferStationStat[]>([]);
  const [selectedStation, setSelectedStation] = useState<TransferStationStat | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    queryTransferStationStats().then(res => {
      if (res.code === 0) setStats(res.data);
    });
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const pieData = [
    { name: '普陀区', value: 400 },
    { name: '徐汇区', value: 300 },
    { name: '长宁区', value: 300 },
    { name: '静安区', value: 200 },
  ];

  const trendData = [
    { name: '05-17', trips: 1200, weight: 3500 },
    { name: '05-18', trips: 1320, weight: 3800 },
    { name: '05-19', trips: 1010, weight: 3100 },
    { name: '05-20', trips: 1430, weight: 4200 },
    { name: '05-21', trips: 1500, weight: 4500 },
    { name: '05-22', trips: 1800, weight: 5200 },
    { name: '05-23', trips: 1900, weight: 5500 },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">转运站管理</h1>
          <p className="text-slate-500 mt-1">转运站分布、进站车次与垃圾量统计</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>导出报表</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[400px]">
        {/* Map Placeholder */}
        <div className="lg:w-2/3 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner group">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Background" 
            className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
            <h4 className="font-bold text-slate-800 mb-2">转运站地图分布</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-primary" />
              <span>共计 15 个转运站在线</span>
            </div>
          </div>
          {/* Simulated Markers */}
          <div 
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-bounce cursor-pointer group/marker"
            onClick={() => navigate('/transfer/video')}
          >
            <div className="absolute -top-8 -left-8 bg-white px-2 py-1 rounded text-xs font-bold shadow-md opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">
              查看监控
            </div>
          </div>
          <div 
            className="absolute top-1/3 left-1/4 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer group/marker"
            onClick={() => navigate('/transfer/video')}
          >
            <div className="absolute -top-8 -left-8 bg-white px-2 py-1 rounded text-xs font-bold shadow-md opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">
              查看监控
            </div>
          </div>
          <div 
            className="absolute top-2/3 left-2/3 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer group/marker"
            onClick={() => navigate('/transfer/video')}
          >
            <div className="absolute -top-8 -left-8 bg-white px-2 py-1 rounded text-xs font-bold shadow-md opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">
              查看监控
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-white/40 hover:bg-white transition-colors">2D 地图</button>
            <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-primary-container transition-colors">3D 卫星</button>
          </div>
        </div>

        {/* Region Stats */}
        <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">各区域进站垃圾量占比</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-black text-slate-800">1.2k</span>
              <span className="text-xs text-slate-500">总吨数</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">各转运站今日进站报表</h3>
            <span className="text-xs text-slate-400">更新于 2024-05-23 10:30</span>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-bold sticky top-0 bg-slate-50">编号</th>
                  <th className="p-4 font-bold sticky top-0 bg-slate-50">名称</th>
                  <th className="p-4 font-bold sticky top-0 bg-slate-50">区域</th>
                  <th className="p-4 font-bold text-right sticky top-0 bg-slate-50">车次</th>
                  <th className="p-4 font-bold text-right sticky top-0 bg-slate-50">重量(吨)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr 
                    key={row.stationId} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedStation(row)}
                  >
                    <td className="p-4 font-mono text-sm text-slate-600">{row.stationId}</td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      {row.stationName}
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="p-4 text-sm text-slate-600">{row.region}</td>
                    <td className="p-4 text-right font-bold text-slate-700">{row.todayTrips}</td>
                    <td className="p-4 text-right font-bold text-primary">{row.todayWeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">进站趋势分析</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} name="进站车次" />
                <Bar dataKey="weight" fill="#10b981" radius={[4, 4, 0, 0]} name="进站重量(吨)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
              <span className="text-xs text-slate-600">进站车次</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
              <span className="text-xs text-slate-600">进站重量</span>
            </div>
          </div>
        </div>
      </div>

      {/* Station Detail Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedStation.stationName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <span className="font-mono">{selectedStation.stationId}</span>
                  <span>•</span>
                  <span>{selectedStation.region}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedStation(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">今日进站车次</p>
                <p className="text-4xl font-black text-blue-700">{selectedStation.todayTrips}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">今日进站重量 (吨)</p>
                <p className="text-4xl font-black text-emerald-700">{selectedStation.todayWeight}</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
              <button 
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                onClick={() => navigate(`/transfer/measurement?stationId=${encodeURIComponent(selectedStation.stationName)}`)}
              >
                <Scale className="w-5 h-5 text-primary" /> 计量记录
              </button>
              <button 
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                onClick={() => navigate(`/transfer/video?stationId=${encodeURIComponent(selectedStation.stationName)}`)}
              >
                <Video className="w-5 h-5 text-blue-500" /> 视频监控
              </button>
              <button 
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                onClick={() => navigate(`/transfer/operation?stationId=${encodeURIComponent(selectedStation.stationName)}`)}
              >
                <Settings className="w-5 h-5 text-emerald-500" /> 运行监管
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;
