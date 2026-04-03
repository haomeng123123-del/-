import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Truck, Users, AlertTriangle, Video, Search, Activity, ArrowRight } from 'lucide-react';

const CleaningTopic: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">清扫保洁专题</h1>
        <p className="text-slate-500 mt-1">作业地图、车辆与人员全方位监控</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'map' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2"><Map className="w-4 h-4" /> 作业地图</div>
        </button>
        <button 
          onClick={() => setActiveTab('vehicle')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'vehicle' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> 车辆主题</div>
        </button>
        <button 
          onClick={() => setActiveTab('personnel')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'personnel' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 人员主题</div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        {activeTab === 'map' && (
          <>
            <div className="lg:w-[70%] relative bg-slate-100 border-r border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                alt="Map Background" 
                className="w-full h-full object-cover opacity-60 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
                <h4 className="font-bold text-slate-800 mb-2">路段作业完成率</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-600">已完成路段</span>
                    <span className="font-bold text-emerald-600">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[30%] p-6 flex flex-col gap-4 overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900">路段作业情况反查</h3>
              <div className="relative">
                <input
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
                  placeholder="输入路段名称查询..."
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-4 mt-4">
                {['南京西路', '淮海中路', '延安高架路'].map(road => (
                  <div key={road} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => navigate('/personnel/grid')}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{road}</h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">已完成</span>
                    </div>
                    <p className="text-xs text-slate-500">作业车辆: 沪A·8K291</p>
                    <p className="text-xs text-slate-500">完成时间: 08:30</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'vehicle' && (
          <div className="flex-1 p-6 flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="bg-blue-50 p-6 rounded-2xl flex-1 border border-blue-100 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/vehicles')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900">车辆分布</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-blue-700">1,245<span className="text-sm font-normal ml-1">台</span></p>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl flex-1 border border-red-100 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/vehicles/alarm')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-900">车辆报警</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-red-300 group-hover:text-red-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-red-700">12<span className="text-sm font-normal ml-1">条</span></p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl flex-1 border border-slate-200 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/vehicles/video')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-slate-600" />
                    <h4 className="font-bold text-slate-900">视频监控</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-slate-700">856<span className="text-sm font-normal ml-1">路在线</span></p>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center relative cursor-pointer group" onClick={() => navigate('/vehicles')}>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                alt="Map Background" 
                className="w-full h-full object-cover opacity-60 grayscale rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg text-center group-hover:bg-white transition-colors">
                  <p className="font-bold text-slate-800">车辆分布地图加载中...</p>
                  <p className="text-xs text-slate-500 mt-1">支持点击车辆查看详情面板与视频监控</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personnel' && (
          <div className="flex-1 p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/personnel')}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-emerald-900">人员在线率</h4>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-emerald-700">95.2%</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/personnel/statistics')}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-orange-900">考勤异常</h4>
                  <ArrowRight className="w-4 h-4 text-orange-300 group-hover:text-orange-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-orange-700">24<span className="text-sm font-normal ml-1">人</span></p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/personnel/statistics')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-purple-900">健康状态预警</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600 transition-colors" />
                </div>
                <p className="text-3xl font-black text-purple-700">3<span className="text-sm font-normal ml-1">人</span></p>
              </div>
            </div>
            <div className="flex-1 flex gap-6">
              <div className="w-2/3 bg-slate-100 rounded-2xl border border-slate-200 relative cursor-pointer group" onClick={() => navigate('/personnel')}>
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                  alt="Map Background" 
                  className="w-full h-full object-cover opacity-60 grayscale rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg text-center group-hover:bg-white transition-colors">
                    <p className="font-bold text-slate-800">人员在线地图</p>
                    <p className="text-xs text-slate-500 mt-1">支持人员作业轨迹回放</p>
                  </div>
                </div>
              </div>
              <div className="w-1/3 bg-white border border-slate-100 rounded-2xl p-4 overflow-y-auto">
                <h4 className="font-bold text-slate-800 mb-4">人员作业详情面板</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700">张师傅 (环卫工)</span>
                        <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-bold">在线</span>
                      </div>
                      <p className="text-xs text-slate-500">心率: 75 bpm (正常)</p>
                      <p className="text-xs text-slate-500">步数: 12,450 步</p>
                      <button className="mt-2 text-xs text-primary font-bold hover:underline" onClick={() => navigate('/personnel/track-realtime')}>查看轨迹回放</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningTopic;
