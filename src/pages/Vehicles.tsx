import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Truck, MapPin, Battery, Fuel, Search, Filter, MoreVertical, AlertTriangle, Video, Navigation } from 'lucide-react';
import { queryVehicles } from '../api/services/sanitation';
import { Vehicle } from '../types/sanitation';
import { motion, AnimatePresence } from 'motion/react';

import VehicleInfo from './vehicles/VehicleInfo';
import VehicleTrack from './vehicles/VehicleTrack';
import VehicleOperation from './vehicles/VehicleOperation';
import VehicleVideo from './vehicles/VehicleVideo';
import VehicleAlarm from './vehicles/VehicleAlarm';
import VehicleFence from './vehicles/VehicleFence';
import VehicleStatistics from './vehicles/VehicleStatistics';
import { CollectionMap, RouteManagement, RecordManagement, BinManagement } from './vehicles/CollectionSupervision';
import CollectionPlans from './collection/CollectionPlans';
import CollectionStatistics from './collection/CollectionStatistics';
import Mechanization from './collection/Mechanization';

const RealTimeMonitor: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicles({ pageNo: 1, pageSize: 50, plateNo: search });
        setVehicles(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
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
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆实时监控</h1>
          <p className="text-slate-500 mt-1">实时监控 45 辆在线环卫车</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Vehicle List */}
        <div className="w-96 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <span className="text-sm font-bold text-slate-500">全部车辆 ({vehicles.length})</span>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
              <span className="text-xs font-bold text-emerald-600">{vehicles.filter(v => v.status !== '离线').length} 在线</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-slate-400">加载中...</div>
            ) : (
              vehicles.map((v) => (
                <motion.div
                  key={v.id}
                  layoutId={`list-${v.id}`}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedVehicle?.id === v.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedVehicle?.id === v.id ? 'bg-white/20' : 'bg-blue-50'}`}>
                        <Truck className={`w-5 h-5 ${selectedVehicle?.id === v.id ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{v.plateNo}</h4>
                        <p className={`text-xs ${selectedVehicle?.id === v.id ? 'text-white/70' : 'text-slate-400'}`}>{v.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      v.status !== '离线' 
                        ? (selectedVehicle?.id === v.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700') 
                        : (selectedVehicle?.id === v.id ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-400')
                    }`}>
                      {v.status !== '离线' ? '在线' : '离线'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3" />
                      <span className="text-xs font-bold">{v.loadRate}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs truncate max-w-[100px]">{v.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Map & Details */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
             <svg width="100%" height="100%" viewBox="0 0 800 600" className="opacity-40">
                <path d="M0 100 L800 100 M0 300 L800 300 M0 500 L800 500 M100 0 L100 600 M300 0 L300 600 M500 0 L500 600 M700 0 L700 600" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                <rect x="150" y="150" width="100" height="100" fill="#e2e8f0" rx="8" />
                <rect x="400" y="200" width="150" height="80" fill="#e2e8f0" rx="8" />
                <rect x="600" y="400" width="120" height="120" fill="#e2e8f0" rx="8" />
             </svg>
             
             {/* Vehicle Markers on Map */}
             {vehicles.map((v) => (
               <motion.div
                 key={`marker-${v.id}`}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute cursor-pointer group"
                 style={{ left: `${(v.lng - 120) * 500}px`, top: `${(v.lat - 30) * 500}px` }}
                 onClick={() => setSelectedVehicle(v)}
               >
                 <div className={`p-2 rounded-full shadow-lg transition-transform group-hover:scale-125 ${
                   selectedVehicle?.id === v.id ? 'bg-primary text-white scale-125' : 'bg-white text-primary'
                 }`}>
                   <Truck className="w-4 h-4" />
                 </div>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   {v.plateNo}
                 </div>
               </motion.div>
             ))}
          </div>

          {/* Floating Details Panel */}
          <AnimatePresence>
            {selectedVehicle && (
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-l border-slate-100 p-6 z-10 flex flex-col"
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-xl font-black font-headline text-slate-900">车辆详情</h3>
                  <button onClick={() => setSelectedVehicle(null)} className="p-1 hover:bg-slate-100 rounded-full">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-primary p-3 rounded-xl text-white">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">车牌号</p>
                      <h4 className="text-lg font-black text-slate-900">{selectedVehicle.plateNo}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Battery className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-slate-400 font-bold">电量/油量</span>
                      </div>
                      <p className="text-lg font-black text-slate-900">{selectedVehicle.loadRate}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Fuel className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-slate-400 font-bold">当日能耗</span>
                      </div>
                      <p className="text-lg font-black text-slate-900">{selectedVehicle.consumption} kWh</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs text-slate-400 font-bold">当前位置</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{selectedVehicle.location}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-slate-400 font-bold">今日报警</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">无异常报警记录</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('/vehicles/video', { state: { plateNo: selectedVehicle.plateNo } })} className="w-full bg-primary text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 text-sm">
                      <Video className="w-4 h-4" />
                      实时视频
                    </button>
                    <button onClick={() => navigate('/vehicles/track', { state: { plateNo: selectedVehicle.plateNo } })} className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm">
                      <Navigation className="w-4 h-4" />
                      轨迹回放
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Vehicles: React.FC = () => {
  return (
    <div className="h-[calc(100vh-128px)]">
      <Routes>
        <Route path="/" element={<RealTimeMonitor />} />
        <Route path="/info" element={<VehicleInfo />} />
        <Route path="/track" element={<VehicleTrack />} />
        <Route path="/operation" element={<VehicleOperation />} />
        <Route path="/video" element={<VehicleVideo />} />
        <Route path="/alarm" element={<VehicleAlarm />} />
        <Route path="/fence" element={<VehicleFence />} />
        <Route path="/statistics" element={<VehicleStatistics />} />
        <Route path="/collection-map" element={<CollectionMap />} />
        <Route path="/collection-routes" element={<RouteManagement />} />
        <Route path="/collection-plans" element={<CollectionPlans />} />
        <Route path="/collection-records" element={<RecordManagement />} />
        <Route path="/collection-statistics" element={<CollectionStatistics />} />
        <Route path="/collection-bins" element={<BinManagement />} />
        <Route path="/mechanization" element={<Mechanization />} />
        <Route path="*" element={<Navigate to="/vehicles" replace />} />
      </Routes>
    </div>
  );
};

export default Vehicles;
