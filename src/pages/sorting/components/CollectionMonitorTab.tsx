import React, { useState } from 'react';
import { MapPin, Truck, Activity, X, User, Phone } from 'lucide-react';

interface CollectionRealtime {
  id: string;
  vehicleNo: string;
  vehiclePlate: string;
  driver: string;
  phone: string;
  status: string;
  location: string;
  loadRate: number;
  capacity: number;
  lastUpdate: string;
  type: string;
  company: string;
}

const CollectionMonitorTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<CollectionRealtime | null>(null);

  const realtime: CollectionRealtime[] = [
    { id: '1', vehicleNo: 'V001', vehiclePlate: '沪A12345', driver: '张三', phone: '13800138000', status: 'moving', location: '浦东新区', loadRate: 45, capacity: 10, lastUpdate: '2023-10-27 10:00:00', type: '厨余垃圾车', company: '浦东环卫' },
    { id: '2', vehicleNo: 'V002', vehiclePlate: '沪A67890', driver: '李四', phone: '13900139000', status: 'collecting', location: '徐汇区', loadRate: 85, capacity: 8, lastUpdate: '2023-10-27 10:05:00', type: '其他垃圾车', company: '徐汇环卫' },
    { id: '3', vehicleNo: 'V003', vehiclePlate: '沪B11223', driver: '王五', phone: '13700137000', status: 'idle', location: '静安区', loadRate: 0, capacity: 5, lastUpdate: '2023-10-27 09:30:00', type: '可回收物车', company: '静安环卫' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[600px] relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> 收运车辆实时地图
          </h3>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold animate-pulse">
            实时更新中
          </span>
        </div>
        
        {/* Mock Map Background */}
        <div className="absolute inset-0 top-16 bg-slate-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center opacity-10 grayscale" />
          <div className="text-slate-400 flex flex-col items-center gap-2 relative z-0">
            <Truck className="w-12 h-12 opacity-20" />
            <span className="text-sm font-medium">GIS 地图加载中...</span>
          </div>
          
          {/* Mock Vehicle Markers */}
          {realtime.map((v, i) => (
            <div 
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`absolute w-10 h-10 rounded-full shadow-lg border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all z-10 ${
                selectedVehicle?.id === v.id ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-white'
              } ${v.status === 'moving' ? 'bg-emerald-500' : v.status === 'collecting' ? 'bg-blue-500' : 'bg-slate-400'}`}
              style={{ 
                left: `${20 + (i * 25) % 60}%`, 
                top: `${30 + (i * 20) % 50}%` 
              }}
            >
              <Truck className="w-5 h-5 text-white" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {v.vehiclePlate}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Detail Overlay */}
        {selectedVehicle && (
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-5 flex items-center justify-between animate-in slide-in-from-bottom-4 z-20">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                selectedVehicle.status === 'moving' ? 'bg-emerald-500' : 
                selectedVehicle.status === 'collecting' ? 'bg-blue-500' : 'bg-slate-400'
              }`}>
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{selectedVehicle.vehiclePlate}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedVehicle.status === 'moving' ? 'bg-emerald-100 text-emerald-700' : 
                    selectedVehicle.status === 'collecting' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {selectedVehicle.status === 'moving' ? '行驶中' : selectedVehicle.status === 'collecting' ? '作业中' : '静止'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selectedVehicle.driver}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedVehicle.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前载重率</p>
                <p className={`text-2xl font-mono font-bold ${selectedVehicle.loadRate > 80 ? 'text-rose-500' : 'text-primary'}`}>
                  {selectedVehicle.loadRate}%
                </p>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" /> 车辆运行状态
        </h3>
        <div className="space-y-4">
          {realtime.map((v) => (
            <div 
              key={v.id} 
              onClick={() => setSelectedVehicle(v)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                selectedVehicle?.id === v.id ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 border-slate-100 hover:border-primary/20 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{v.vehiclePlate}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  v.status === 'moving' ? 'bg-emerald-100 text-emerald-700' : 
                  v.status === 'collecting' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {v.status === 'moving' ? '行驶中' : v.status === 'collecting' ? '收运中' : '静止'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${v.loadRate > 80 ? 'bg-rose-500' : 'bg-primary'}`}
                    style={{ width: `${v.loadRate}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500">{v.loadRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionMonitorTab;
