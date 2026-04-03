import React, { useEffect, useState } from 'react';
import { Search, Video, Play, Maximize2 } from 'lucide-react';
import { queryVehicleVideos } from '../../api/services/sanitation';
import { VehicleVideo } from '../../types/sanitation';
import { useLocation } from 'react-router-dom';

const VehicleVideoPage: React.FC = () => {
  const location = useLocation();
  const [videos, setVideos] = useState<VehicleVideo[]>([]);
  const [search, setSearch] = useState(location.state?.plateNo || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicleVideos({ pageNo: 1, pageSize: 50, plateNo: search });
        setVideos(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicle videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆视频监控</h1>
          <p className="text-slate-500 mt-1">实时查看车辆内外监控画面</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-video-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400">加载中...</div>
        ) : videos.length === 0 ? (
          <div className="p-8 text-center text-slate-400">暂无数据</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((v) => (
              <div key={v.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                  {v.status === '在线' ? (
                    <>
                      <img src={`https://picsum.photos/seed/${v.id}/600/400`} alt="Video Stream" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                          <Play className="w-6 h-6" />
                        </button>
                      </div>
                      <button className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-slate-600 flex flex-col items-center gap-2">
                      <Video className="w-8 h-8 opacity-50" />
                      <span className="text-sm font-bold opacity-50">设备离线</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md ${
                      v.status === '在线' ? 'bg-emerald-500/80 text-white' : 'bg-slate-800/80 text-slate-300'
                    }`}>
                      {v.status}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-md">
                      {v.channel}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900">{v.plateNo}</h4>
                  <p className="text-xs text-slate-500 mt-1">设备ID: {v.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleVideoPage;
