import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart3,
  Calendar,
  ChevronRight,
  Battery,
  Wifi,
  Thermometer,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const KPIS = [
  { title: '今日计划收运', value: '1,250', unit: '吨', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50', path: '/sorting/collection' },
  { title: '已完成收运', value: '850', unit: '吨', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50', path: '/sorting/collection' },
  { title: '收运完成率', value: '68%', unit: '', icon: BarChart3, color: 'text-indigo-500', bgColor: 'bg-indigo-50', path: '/sorting/collection' },
  { title: '作业车辆数', value: '142', unit: '辆', icon: Truck, color: 'text-orange-500', bgColor: 'bg-orange-50', path: '/sorting/collection' },
];

const VEHICLES = [
  { id: 'V-001', plate: '粤B·12345', type: '压缩式垃圾车', driver: '张师傅', phone: '13800138000', status: 'working', route: '南山区-科技园线', progress: 75, load: '4.5/5t', speed: '35km/h', fuel: '60%', lastUpdate: '10分钟前' },
  { id: 'V-002', plate: '粤B·23456', type: '餐厨垃圾车', driver: '李师傅', phone: '13900139000', status: 'idle', route: '福田区-CBD线', progress: 100, load: '0/3t', speed: '0km/h', fuel: '80%', lastUpdate: '2分钟前' },
  { id: 'V-003', plate: '粤B·34567', type: '勾臂式垃圾车', driver: '王师傅', phone: '13700137000', status: 'alert', route: '宝安区-中心线', progress: 30, load: '2/8t', speed: '0km/h', fuel: '15%', lastUpdate: '刚刚', alert: '油量偏低' },
  { id: 'V-004', plate: '粤B·45678', type: '压缩式垃圾车', driver: '赵师傅', phone: '13600136000', status: 'working', route: '罗湖区-老街线', progress: 50, load: '3/5t', speed: '40km/h', fuel: '45%', lastUpdate: '5分钟前' },
  { id: 'V-005', plate: '粤B·56789', type: '餐厨垃圾车', driver: '陈师傅', phone: '13500135000', status: 'working', route: '龙华区-民治线', progress: 10, load: '0.5/3t', speed: '25km/h', fuel: '90%', lastUpdate: '1分钟前' },
  { id: 'V-006', plate: '粤B·67890', type: '勾臂式垃圾车', driver: '刘师傅', phone: '13400134000', status: 'offline', route: '龙岗区-大运线', progress: 0, load: '0/8t', speed: '0km/h', fuel: '--', lastUpdate: '2小时前' },
];

const ROUTES = [
  { id: 'R-001', name: '南山区-科技园线', points: 12, completed: 9, distance: '15km', estTime: '2.5h' },
  { id: 'R-002', name: '福田区-CBD线', points: 8, completed: 8, distance: '10km', estTime: '1.5h' },
  { id: 'R-003', name: '宝安区-中心线', points: 15, completed: 4, distance: '22km', estTime: '3.5h' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    working: { label: '作业中', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    idle: { label: '空闲', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    alert: { label: '异常', className: 'bg-red-100 text-red-700 border-red-200' },
    offline: { label: '离线', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function CollectionTopic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'routes'>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[0] | null>(VEHICLES[0]);

  const filteredVehicles = VEHICLES.filter(v => 
    v.plate.includes(searchQuery) || v.driver.includes(searchQuery) || v.route.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {KPIS.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(kpi.path)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className={cn("p-3 rounded-xl", kpi.bgColor, kpi.color)}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{kpi.title}</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                  <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Left Panel: List */}
        <div className="w-96 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">收运监控</h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('vehicles')}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    activeTab === 'vehicles' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  车辆
                </button>
                <button
                  onClick={() => setActiveTab('routes')}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    activeTab === 'routes' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  路线
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'vehicles' ? "搜索车牌号/司机/路线..." : "搜索路线名称..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeTab === 'vehicles' ? (
              filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all border",
                    selectedVehicle?.id === vehicle.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{vehicle.plate}</div>
                        <div className="text-xs text-slate-500">{vehicle.type}</div>
                      </div>
                    </div>
                    <StatusBadge status={vehicle.status} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span className="truncate">{vehicle.route}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-600">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {vehicle.lastUpdate}
                      </div>
                      <div className="font-medium text-slate-700">
                        进度: {vehicle.progress}%
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          vehicle.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${vehicle.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="font-medium text-slate-800 mb-2">{route.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>收运点: <span className="font-medium text-slate-800">{route.completed}/{route.points}</span></div>
                    <div>里程: <span className="font-medium text-slate-800">{route.distance}</span></div>
                    <div>预计耗时: <span className="font-medium text-slate-800">{route.estTime}</span></div>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(route.completed / route.points) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center: Map */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">GIS 地图加载中...</p>
            <p className="text-sm text-slate-400 mt-1">将显示收运路线、车辆实时位置及收运点状态</p>
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Panel: Details */}
        {selectedVehicle && (
          <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">车辆详情</h3>
                <StatusBadge status={selectedVehicle.status} />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800">{selectedVehicle.plate}</div>
                  <div className="text-sm text-slate-500">{selectedVehicle.type}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Alert if any */}
              {selectedVehicle.alert && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-red-800">当前告警</div>
                    <div className="text-xs text-red-600 mt-0.5">{selectedVehicle.alert}</div>
                  </div>
                </div>
              )}

              {/* Driver Info */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">人员信息</h4>
                <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">司机姓名</span>
                    <span className="font-medium text-slate-800">{selectedVehicle.driver}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">联系电话</span>
                    <span className="font-medium text-slate-800">{selectedVehicle.phone}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Status */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">实时状态</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">当前载重</span>
                    </div>
                    <div className="font-medium text-slate-800">{selectedVehicle.load}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Thermometer className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">行驶速度</span>
                    </div>
                    <div className="font-medium text-slate-800">{selectedVehicle.speed}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Battery className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">剩余油量</span>
                    </div>
                    <div className="font-medium text-slate-800">{selectedVehicle.fuel}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Wifi className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">信号状态</span>
                    </div>
                    <div className="font-medium text-emerald-600">良好</div>
                  </div>
                </div>
              </div>

              {/* Route Progress */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">路线进度</h4>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-sm font-medium text-slate-800 mb-2">{selectedVehicle.route}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>完成度</span>
                    <span className="font-medium text-blue-600">{selectedVehicle.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${selectedVehicle.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => navigate('/sorting/collection')}
                className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                查看历史轨迹
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
