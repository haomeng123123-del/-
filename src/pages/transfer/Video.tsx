import React, { useState, useEffect } from 'react';
import { Search, Video, MapPin, Play, Maximize2, Grid, Map as MapIcon, X, Scale, Settings } from 'lucide-react';
import { queryVideoCameras } from '../../api/services/transfer';
import { VideoCamera } from '../../types/transfer';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VideoMonitoring: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get('stationId') || '';

  const [cameras, setCameras] = useState<VideoCamera[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCamera, setSelectedCamera] = useState<VideoCamera | null>(null);

  useEffect(() => {
    queryVideoCameras({ pageNo: 1, pageSize: 12, stationId: search }).then(res => {
      if (res.code === 0) setCameras(res.data.list);
    });
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val) {
      setSearchParams({ stationId: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">视频监控管理</h1>
          <p className="text-slate-500 mt-1">转运设施实时监控视频与点位分布</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="按转运站或点位查询..."
              value={search}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {cameras.map((camera) => (
            <div 
              key={camera.cameraId} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer"
              onClick={() => setSelectedCamera(camera)}
            >
              <div className="aspect-video bg-slate-900 relative">
                {camera.status === 'online' ? (
                  <>
                    <img 
                      src={`https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600&seed=${camera.cameraId}`} 
                      alt="Video Stream" 
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      REC
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-bold">设备离线</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{camera.cameraName}</h4>
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${camera.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {camera.stationName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Background" 
            className="w-full h-full object-cover opacity-60 grayscale"
            referrerPolicy="no-referrer"
          />
          {/* Simulated Camera Markers */}
          {cameras.map((camera, i) => (
            <div 
              key={camera.cameraId}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110 ${camera.status === 'online' ? 'bg-primary text-white' : 'bg-slate-300 text-slate-500'}`}
              style={{ top: `${20 + (i * 10) % 60}%`, left: `${15 + (i * 15) % 70}%` }}
              onClick={() => setSelectedCamera(camera)}
            >
              <Video className="w-4 h-4" />
              {camera.status === 'online' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </div>
          ))}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
            <h4 className="font-bold text-slate-800 mb-2">监控点位地图分布</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Video className="w-4 h-4 text-primary" />
              <span>共计 {cameras.filter(c => c.status === 'online').length} 个点位在线</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedCamera.cameraName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {selectedCamera.stationName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCamera(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="aspect-video bg-black relative">
              <img 
                src={`https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1200&seed=${selectedCamera.cameraId}`} 
                alt="Live Stream" 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE • 1080P
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                <div className="flex gap-4">
                  <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold hover:bg-white/40 transition-colors flex items-center gap-1"
                    onClick={() => alert('云台控制功能开发中...')}
                  >
                    云台控制
                  </button>
                  <button 
                    className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold hover:bg-white/40 transition-colors flex items-center gap-1"
                    onClick={() => alert('历史回放功能开发中...')}
                  >
                    历史回放
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-6 bg-slate-50">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">设备状态</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 正常运行中
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">分辨率</p>
                <p className="text-sm font-bold text-slate-700">1920 x 1080 (30fps)</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">存储周期</p>
                <p className="text-sm font-bold text-slate-700">30 天循环覆盖</p>
              </div>
              <div className="col-span-3 flex gap-4 pt-2">
                <button 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => navigate(`/transfer/measurement?stationId=${selectedCamera.stationName}`)}
                >
                  <Scale className="w-5 h-5 text-primary" /> 计量记录
                </button>
                <button 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => navigate(`/transfer/operation?stationId=${selectedCamera.stationName}`)}
                >
                  <Settings className="w-5 h-5 text-emerald-500" /> 运行监管
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default VideoMonitoring;
