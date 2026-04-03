import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Map, TrendingUp, CheckCircle, AlertCircle, PieChart as PieIcon, BarChart as BarIcon, Search, Download, Trash2, Truck, Calendar, Clock } from 'lucide-react';
import { queryCollectionRoutes, queryCollectionRecords, queryTrashBins } from '../../api/services/collection';
import { CollectionRoute, CollectionRecord, TrashBin } from '../../types/collection';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'motion/react';

import CollectionPlans from './collection/CollectionPlans';
import CollectionStatistics from './collection/CollectionStatistics';
import Mechanization from './collection/Mechanization';

// 1. 收运监控地图
export const CollectionMap: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运监控地图</h1>
          <p className="text-slate-500 mt-1">实时监控收运车辆位置与垃圾桶状态</p>
        </div>
      </header>
      <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Map Background" 
          className="w-full h-full object-cover opacity-60 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
          <h4 className="font-bold text-slate-800 mb-2">实时监控概览</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <div 
              className="flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
              onClick={() => navigate('/vehicles/collection-routes')}
            >
              <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-blue-500" /> 在线车辆</span>
              <span className="font-bold text-slate-900">45/50</span>
            </div>
            <div 
              className="flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
              onClick={() => navigate('/vehicles/collection-bins')}
            >
              <span className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-orange-500" /> 满溢垃圾桶</span>
              <span className="font-bold text-slate-900">12</span>
            </div>
          </div>
        </div>
        {/* Simulated Markers */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce cursor-pointer" onClick={() => navigate('/vehicles/collection-routes')}></div>
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-pointer" onClick={() => navigate('/vehicles/collection-bins')}></div>
        <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer" onClick={() => navigate('/vehicles/collection-bins')}></div>
      </div>
    </div>
  );
};

// 2. 收运路线管理
export const RouteManagement: React.FC = () => {
  const [routes, setRoutes] = useState<CollectionRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    queryCollectionRoutes({ pageNo: 1, pageSize: 10 }).then(res => {
      if (res.code === 0) setRoutes(res.data.list);
      setLoading(false);
    });
  }, []);

  const COLORS = ['#004275', '#005a9c', '#4b607b', '#727781'];
  const pieData = [
    { name: '作业中', value: 12 },
    { name: '已完成', value: 25 },
    { name: '待开始', value: 8 },
  ];

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运路线管理</h1>
        <p className="text-slate-500 mt-1">路线效率分析与作业覆盖率监控</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Efficiency Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              路线作业效率
            </h3>
            <div className="flex gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>效率 (%)</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="routeName" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="efficiency" fill="#004275" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-primary" />
            作业状态分布
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value} 条</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route List */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold">详细路线监控</h3>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="搜索路线名称..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">路线名称</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">覆盖点</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">分配车辆</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">效率评分</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {routes.map((route, idx) => (
                <motion.tr 
                  key={route.routeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => navigate('/vehicles/collection-records')}
                    >
                      <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Map className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold text-blue-600 group-hover:underline">{route.routeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{route.coveragePoints}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{route.assignedVehicle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${route.efficiency > 90 ? 'text-emerald-500' : 'text-orange-500'}`} />
                      <span className="text-sm font-black text-slate-900">{route.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {route.status === 'active' ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">运行中</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">维护中</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. 收运记录管理
export const RecordManagement: React.FC = () => {
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    queryCollectionRecords({ pageNo: 1, pageSize: 15 }).then(res => {
      if (res.code === 0) setRecords(res.data.list);
    });
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运记录管理</h1>
          <p className="text-slate-500 mt-1">历史收运任务执行记录与垃圾量统计</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>导出记录</span>
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">收运任务明细表</h3>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="搜索车牌号或路线..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-bold">记录编号</th>
                <th className="p-4 font-bold">收运路线</th>
                <th className="p-4 font-bold">车牌号</th>
                <th className="p-4 font-bold">开始时间</th>
                <th className="p-4 font-bold">结束时间</th>
                <th className="p-4 font-bold text-right">收集重量 (吨)</th>
                <th className="p-4 font-bold">状态</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.recordId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-600">{row.recordId}</td>
                  <td 
                    className="p-4 font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate('/vehicles/collection-routes')}
                  >
                    {row.routeName}
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-600">{row.plateNo}</td>
                  <td className="p-4 text-sm text-slate-600">{row.startTime}</td>
                  <td className="p-4 text-sm text-slate-600">{row.endTime}</td>
                  <td className="p-4 text-right font-bold text-primary">{row.collectedWeight}</td>
                  <td className="p-4">
                    {row.status === 'completed' ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">已完成</span>
                    ) : (
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold">进行中</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. 垃圾桶管理
export const BinManagement: React.FC = () => {
  const [bins, setBins] = useState<TrashBin[]>([]);

  useEffect(() => {
    queryTrashBins({ pageNo: 1, pageSize: 15 }).then(res => {
      if (res.code === 0) setBins(res.data.list);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'normal': return <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">正常</span>;
      case 'full': return <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold">满溢</span>;
      case 'damaged': return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">破损</span>;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">垃圾桶管理</h1>
          <p className="text-slate-500 mt-1">智能垃圾桶状态监测与维护管理</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Trash2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">正常运行</p>
            <p className="text-3xl font-black text-slate-800 font-headline">1,245</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">满溢告警</p>
            <p className="text-3xl font-black text-slate-800 font-headline">86</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">设备破损</p>
            <p className="text-3xl font-black text-slate-800 font-headline">12</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">垃圾桶状态列表</h3>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="搜索位置..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-bold">设备编号</th>
                <th className="p-4 font-bold">位置</th>
                <th className="p-4 font-bold">区域</th>
                <th className="p-4 font-bold">类型</th>
                <th className="p-4 font-bold">满溢度</th>
                <th className="p-4 font-bold">状态</th>
                <th className="p-4 font-bold">最后清运时间</th>
              </tr>
            </thead>
            <tbody>
              {bins.map((row) => (
                <tr key={row.binId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-600">{row.binId}</td>
                  <td className="p-4 font-bold text-slate-800">{row.location}</td>
                  <td className="p-4 text-sm text-slate-600">{row.region}</td>
                  <td className="p-4 text-sm text-slate-600">{row.type}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${row.fillLevel > 80 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${row.fillLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{row.fillLevel}%</span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(row.status)}</td>
                  <td className="p-4 text-sm text-slate-500">{row.lastCollected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


