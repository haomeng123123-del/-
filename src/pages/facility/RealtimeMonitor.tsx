import React, { useEffect, useState } from 'react';
import { queryToiletMonitorData, queryToiletMapList } from '../../api/services/facility';
import { ToiletMonitorData, ToiletMapPoint } from '../../types/facility';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, CheckCircle2, Activity, Users, Wind, Thermometer, Droplets, ChevronRight, LayoutGrid } from 'lucide-react';

const RealtimeMonitor: React.FC = () => {
  const [toilets, setToilets] = useState<ToiletMapPoint[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [data, setData] = useState<ToiletMonitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToilets = async () => {
      try {
        const res = await queryToiletMapList({});
        setToilets(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].toiletId);
        }
      } catch (error) {
        console.error('Failed to fetch toilets:', error);
      }
    };
    fetchToilets();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await queryToiletMonitorData({ toiletId: selectedId });
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch monitor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedId]);

  const regions = Array.from(new Set(toilets.map(t => t.region)));

  const [alarmDate, setAlarmDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filteredAlarms = data?.alarms.filter(alarm => {
    if (!alarmDate) return true;
    return alarm.time.startsWith(alarmDate);
  }) || [];

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      {/* 左侧区域树 */}
      <div className="w-64 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-slate-900 text-sm">区域公厕树</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {regions.map(region => (
            <div key={region} className="mb-2">
              <div className="flex items-center gap-2 p-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <ChevronRight className="w-3 h-3" /> {region}
              </div>
              <div className="ml-4 space-y-1">
                {toilets.filter(t => t.region === region).map(t => (
                  <div 
                    key={t.toiletId}
                    onClick={() => setSelectedId(t.toiletId)}
                    className={`p-2 rounded-xl text-xs cursor-pointer transition-all ${
                      selectedId === t.toiletId ? 'bg-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.toiletName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧监测内容 */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {loading || !data ? (
          <div className="h-full flex items-center justify-center text-slate-400">加载中...</div>
        ) : (
          <>
            {/* 实时概览卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: '异味浓度', value: data.realtime.odor, unit: 'ppm', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '氨气浓度', value: data.realtime.ammonia, unit: 'ppm', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '硫化氢', value: data.realtime.hydrogenSulfide, unit: 'ppm', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: '环境温度', value: data.realtime.temperature, unit: '℃', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: '环境湿度', value: data.realtime.humidity, unit: '%', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                { label: '今日客流', value: data.realtime.flow, unit: '人次', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{item.label}</p>
                  <p className="text-xl font-black text-slate-900">{item.value}<span className="text-xs font-normal text-slate-400 ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 异味趋势图 */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-500" /> 异味浓度变化趋势 (24h)
                </h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.odorTrend}>
                      <defs>
                        <linearGradient id="colorOdor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorOdor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 客流趋势图 */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> 客流量监测变化趋势 (24h)
                </h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.flowTrend}>
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 报警记录 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">实时报警记录</h3>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={alarmDate}
                    onChange={(e) => setAlarmDate(e.target.value)}
                    className="text-xs border-slate-200 rounded-lg px-2 py-1" 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-4 px-2">报警时间</th>
                      <th className="pb-4 px-2">报警类型</th>
                      <th className="pb-4 px-2">报警描述</th>
                      <th className="pb-4 px-2">报警值</th>
                      <th className="pb-4 px-2">状态</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {filteredAlarms.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-400">暂无该日期报警记录</td></tr>
                    ) : (
                      filteredAlarms.map((alarm, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-2 text-slate-500 font-mono">{alarm.time}</td>
                          <td className="py-4 px-2 font-bold text-slate-900">{alarm.type}</td>
                          <td className="py-4 px-2 text-slate-600">{alarm.description}</td>
                          <td className="py-4 px-2 font-bold text-red-500">{alarm.value}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              alarm.status === 'handled' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {alarm.status === 'handled' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {alarm.status === 'handled' ? '已处理' : '待处理'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealtimeMonitor;
