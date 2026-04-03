import React, { useState } from 'react';
import { Video, Play, Monitor, List, Clock, Maximize2, Search } from 'lucide-react';
import { toast } from 'sonner';

const TreatmentMonitorTab: React.FC = () => {
  const [activeCamera, setActiveCamera] = useState(0);

  const cameras = [
    { id: 0, name: '卸料大厅-01', status: 'online' },
    { id: 1, name: '焚烧炉口-02', status: 'online' },
    { id: 2, name: '渗滤液处理区-03', status: 'online' },
    { id: 3, name: '地磅房-04', status: 'online' },
    { id: 4, name: '中控室-05', status: 'online' },
  ];

  const handleCameraSwitch = (index: number) => {
    setActiveCamera(index);
    toast.success(`已切换至监控点：${cameras[index].name}`);
  };

  const handleSearchHistory = () => {
    toast.info('正在检索历史录像...');
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden aspect-video relative group shadow-2xl border border-slate-800">
        {/* Simulated Video Feed */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cctv/1200/800')] bg-cover bg-center opacity-60" />
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="px-3 py-1 bg-rose-600 text-white text-[10px] font-bold rounded flex items-center gap-1.5 shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            REC
          </div>
          <span className="px-3 py-1 bg-black/50 text-white text-[10px] font-bold rounded-full backdrop-blur-md border border-white/10">
            {cameras[activeCamera].name}
          </span>
        </div>

        <div className="absolute top-4 right-4 text-white/70 text-xs font-mono drop-shadow-md bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
          2026-03-27 11:05:42
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all transform hover:scale-110">
            <Play className="w-8 h-8 fill-current" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-lg backdrop-blur-sm"><Monitor className="w-5 h-5" /></button>
            <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/80 text-[10px] font-bold">
            <span className="px-1.5 py-0.5 border border-white/30 rounded">HD</span>
            <span>100%</span>
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><Maximize2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <List className="w-4 h-4 text-primary" />
              实时监控列表
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[300px] lg:max-h-none">
            {cameras.map((cam, idx) => (
              <button
                key={cam.id}
                onClick={() => handleCameraSwitch(idx)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all group ${
                  activeCamera === idx ? 'bg-primary/5 border-primary/30' : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${cam.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className={`text-xs font-bold ${activeCamera === idx ? 'text-primary' : 'text-slate-700'}`}>{cam.name}</span>
                </div>
                <Video className={`w-4 h-4 transition-colors ${activeCamera === idx ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            历史录像回放
          </h3>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button 
              onClick={handleSearchHistory}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> 检索历史记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentMonitorTab;
