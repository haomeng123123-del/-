import React, { useState, useEffect } from 'react';
import { Search, Play, CheckCircle2, Settings, Share2, Code, Filter, Calendar, MapPin, AlertTriangle, Eye, Trash2, Activity } from 'lucide-react';
import { queryVideoEvents } from '../../api/services/platform';
import { VideoAnalysisEvent } from '../../types/platform';

const VideoAnalysis: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('realtime');
  const [events, setEvents] = useState<VideoAnalysisEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const subTabs = [
    { id: 'realtime', label: '实时信息', icon: Play },
    { id: 'search', label: '数据检索', icon: Search },
    { id: 'audit', label: '审核处理', icon: CheckCircle2 },
    { id: 'system', label: '系统管理', icon: Settings },
    { id: 'service', label: '对外服务', icon: Share2 },
    { id: 'algorithm', label: '算法开发', icon: Code },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryVideoEvents({});
      setEvents(res.data.list);
    } catch (error) {
      console.error('Failed to fetch video events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'illegal_dumping': return '非法倾倒';
      case 'overflow': return '满溢报警';
      case 'unauthorized_parking': return '违规停车';
      case 'littering': return '乱扔垃圾';
      default: return '未知事件';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {activeSubTab === 'realtime' && (
          <div className="flex-1 flex flex-col p-6 gap-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">今日预警总数</p>
                <p className="text-2xl font-black text-slate-800">128</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">待处理预警</p>
                <p className="text-2xl font-black text-orange-600">42</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">已处理预警</p>
                <p className="text-2xl font-black text-emerald-600">86</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">算法识别准确率</p>
                <p className="text-2xl font-black text-blue-600">94.2%</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
              <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    实时预警流
                  </h3>
                  <button className="text-xs font-bold text-primary hover:underline">查看全部</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400">加载中...</div>
                  ) : (
                    events.map((event) => (
                      <div key={event.id} className="group flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img src={event.imageUrl} alt={event.type} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                            {(event.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-800">{getEventTypeName(event.type)}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(event.status)}`}>
                                {event.status === 'pending' ? '待审核' : event.status === 'processing' ? '处理中' : '已完成'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.time}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  算法运行状态
                </h3>
                <div className="space-y-6">
                  {[
                    { name: '非法倾倒检测', status: 'online', load: '12%' },
                    { name: '满溢报警检测', status: 'online', load: '8%' },
                    { name: '违规停车检测', status: 'online', load: '15%' },
                    { name: '乱扔垃圾检测', status: 'online', load: '22%' },
                    { name: '人流量统计', status: 'offline', load: '0%' },
                  ].map((algo) => (
                    <div key={algo.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${algo.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                        <span className="text-sm font-medium text-slate-700">{algo.name}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{algo.load}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6 border-t border-slate-200">
                  <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>算法开发控制台</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab !== 'realtime' && (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
            <Settings className="w-12 h-12 opacity-20" />
            <p className="font-bold">{subTabs.find(t => t.id === activeSubTab)?.label} 模块正在建设中...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
