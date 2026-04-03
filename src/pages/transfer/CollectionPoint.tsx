import React, { useState, useEffect } from 'react';
import { Download, Search, TrendingUp, Calendar, X, Activity } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { queryCollectionPointWeights } from '../../api/services/transfer';
import { CollectionPointWeight } from '../../types/transfer';

const CollectionPoint: React.FC = () => {
  const [data, setData] = useState<CollectionPointWeight[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<CollectionPointWeight | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryCollectionPointWeights({ pageNo: 1, pageSize: 10, pointName: search });
      if (res.code === 0) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch collection points:', error);
    } finally {
      setLoading(false);
    }
  };

  const trendData = [
    { name: '05-17', weight: 120 }, { name: '05-18', weight: 132 },
    { name: '05-19', weight: 101 }, { name: '05-20', weight: 143 },
    { name: '05-21', weight: 150 }, { name: '05-22', weight: 180 },
    { name: '05-23', weight: 190 },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收集点垃圾管理</h1>
          <p className="text-slate-500 mt-1">收集点每日垃圾重量数据统计与趋势分析</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>导出报表</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">今日总计收运量</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-primary font-headline">1,284.5</span>
            <span className="text-slate-400 font-bold mb-1">吨</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500 font-bold">
            <TrendingUp className="w-3 h-3" /> +5.2% 较昨日
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">活跃收集点</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800 font-headline">35</span>
            <span className="text-slate-400 font-bold mb-1">个</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">覆盖全区 100%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">本月累计垃圾量</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800 font-headline">28.4</span>
            <span className="text-slate-400 font-bold mb-1">k吨</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">预计本月增长 3%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">历史总量</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800 font-headline">452.8</span>
            <span className="text-slate-400 font-bold mb-1">k吨</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">自系统上线以来</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">收集点垃圾重量列表</h3>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
                  placeholder="搜索收集点名称..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <button className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100">
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-bold">收集点编号</th>
                  <th className="p-4 font-bold">收集点名称</th>
                  <th className="p-4 font-bold">所属区域</th>
                  <th className="p-4 font-bold">统计日期</th>
                  <th className="p-4 font-bold text-right">垃圾重量 (吨)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">加载中...</td></tr>
                ) : data.map((row) => (
                  <tr 
                    key={row.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedPoint(row)}
                  >
                    <td className="p-4 font-mono text-sm text-slate-600">{row.id}</td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      {row.pointName}
                      <Activity className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="p-4 text-sm text-slate-600">{row.region}</td>
                    <td className="p-4 text-sm text-slate-600">{row.date}</td>
                    <td className="p-4 text-right font-bold text-primary">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">近7日垃圾量变化趋势</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-2">数据分析摘要</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              本周垃圾产生量呈现稳步上升趋势，周末（周六、周日）垃圾量明显高于工作日，增幅约为 25%。建议在周末增加收运频次。
            </p>
          </div>
        </div>
      </div>

      {/* Point Detail Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedPoint.pointName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <span className="font-mono">{selectedPoint.id}</span>
                  <span>•</span>
                  <span>{selectedPoint.region}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedPoint(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">今日收集量</p>
                <p className="text-2xl font-black text-blue-700">{selectedPoint.weight} <span className="text-sm font-bold opacity-70">吨</span></p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">本月累计</p>
                <p className="text-2xl font-black text-emerald-700">{(selectedPoint.weight * 25).toFixed(1)} <span className="text-sm font-bold opacity-70">吨</span></p>
              </div>
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">环比增长</p>
                <p className="text-2xl font-black text-orange-700">+3.2%</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{selectedPoint.pointName} - 近7日趋势</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData.map(d => ({ ...d, weight: d.weight * (selectedPoint.weight / 150) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="weight" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPoint;
