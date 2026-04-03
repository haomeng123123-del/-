import React, { useEffect, useState } from 'react';
import { Search, MapPin, Navigation, Clock } from 'lucide-react';
import { queryVehicleTracks } from '../../api/services/sanitation';
import { VehicleTrack } from '../../types/sanitation';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

const VehicleTrackPage: React.FC = () => {
  const location = useLocation();
  const [tracks, setTracks] = useState<VehicleTrack[]>([]);
  const [search, setSearch] = useState(location.state?.plateNo || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicleTracks({ pageNo: 1, pageSize: 50, plateNo: search });
        setTracks(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicle tracks:', error);
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
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆轨迹管理</h1>
          <p className="text-slate-500 mt-1">查询与回放环卫车辆历史行驶轨迹</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-track-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button 
            className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 font-bold text-sm"
            data-testid="vehicle-track-btn-query"
          >
            <Navigation className="w-4 h-4" />
            查询轨迹
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Track List */}
        <div className="w-96 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <span className="text-sm font-bold text-slate-500">轨迹记录 ({tracks.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-slate-400">加载中...</div>
            ) : tracks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">暂无数据</div>
            ) : (
              tracks.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-900">{t.plateNo}</h4>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{t.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{new Date(t.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-mono">{t.lat.toFixed(4)}, {t.lng.toFixed(4)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
             <svg width="100%" height="100%" viewBox="0 0 800 600" className="opacity-40">
                <path d="M0 100 L800 100 M0 300 L800 300 M0 500 L800 500 M100 0 L100 600 M300 0 L300 600 M500 0 L500 600 M700 0 L700 600" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                <path d="M 200 200 Q 300 100 400 300 T 600 400" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="8 8" />
             </svg>
             
             {tracks.slice(0, 5).map((t, index) => (
               <motion.div
                 key={`marker-${t.id}`}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: index * 0.1 }}
                 className="absolute"
                 style={{ left: `${(t.lng - 120) * 500}px`, top: `${(t.lat - 30) * 500}px` }}
               >
                 <div className="p-2 rounded-full shadow-lg bg-blue-500 text-white">
                   <Navigation className="w-3 h-3" />
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleTrackPage;
