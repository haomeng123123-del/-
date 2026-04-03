import React, { useEffect, useState } from 'react';
import { queryMechanizationRecords } from '../../../api/services/collection';
import { MechanizationRecord } from '../../../types/collection';
import { TrendingUp, MapPin, Search, Filter, Activity, CheckCircle, BarChart as BarIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { motion } from 'motion/react';

const Mechanization: React.FC = () => {
  const [records, setRecords] = useState<MechanizationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryMechanizationRecords({ pageNo: 1, pageSize: 10 }).then(res => {
      if (res.code === 0) setRecords(res.data.list);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运机械化水平</h1>
          <p className="text-slate-500 mt-1">全区收运点位机械化作业覆盖率监控</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarIcon className="w-5 h-5 text-primary" />
            各区域机械化率对比
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={records}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rate" fill="#004275" radius={[4, 4, 0, 0]} barSize={40}>
                  {records.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 96 ? '#10b981' : '#004275'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            全区概览
          </h3>
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle className="text-primary stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.965)} transform="rotate(-90 50 50)"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 font-headline">96.5%</span>
                <span className="text-xs text-slate-400 font-bold">平均机械化率</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">总点位</p>
                <p className="text-lg font-black text-slate-900">5,630</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">机械化点位</p>
                <p className="text-lg font-black text-emerald-600">5,433</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">区域机械化明细</h3>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="搜索区域..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-bold">区域名称</th>
                <th className="p-4 font-bold">总收运点位</th>
                <th className="p-4 font-bold">机械化点位</th>
                <th className="p-4 font-bold">机械化率</th>
                <th className="p-4 font-bold">状态</th>
                <th className="p-4 font-bold">最后更新</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{row.region}</td>
                  <td className="p-4 text-sm text-slate-600">{row.totalPoints}</td>
                  <td className="p-4 text-sm text-slate-600 font-bold text-primary">{row.mechanizedPoints}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-primary" 
                          style={{ width: `${row.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{row.rate}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {row.rate > 95 ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> 达标</span>
                    ) : (
                      <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><TrendingUp className="w-3 h-3" /> 提升中</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Mechanization;
