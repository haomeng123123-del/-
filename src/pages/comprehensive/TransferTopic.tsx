import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart3,
  Wind,
  Droplets,
  Video,
  Activity,
  ChevronRight,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const KPIS = [
  { title: '转运站总数', value: '45', unit: '座', icon: Building2, color: 'text-blue-500', bgColor: 'bg-blue-50', path: '/sorting/treatment' },
  { title: '今日处理量', value: '3,250', unit: '吨', icon: BarChart3, color: 'text-emerald-500', bgColor: 'bg-emerald-50', path: '/sorting/treatment' },
  { title: '平均负荷率', value: '72%', unit: '', icon: Activity, color: 'text-indigo-500', bgColor: 'bg-indigo-50', path: '/sorting/treatment' },
  { title: '异常报警', value: '3', unit: '起', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50', path: '/sorting/treatment' },
];

const STATIONS = [
  { id: 'TS-001', name: '南山中心转运站', district: '南山区', status: 'normal', capacity: '500t/日', currentLoad: 350, loadRate: 70, odor: '优', noise: '55dB', lastUpdate: '10分钟前' },
  { id: 'TS-002', name: '福田梅林转运站', district: '福田区', status: 'warning', capacity: '800t/日', currentLoad: 720, loadRate: 90, odor: '良', noise: '65dB', lastUpdate: '2分钟前', alert: '负荷率偏高' },
  { id: 'TS-003', name: '宝安西乡转运站', district: '宝安区', status: 'alert', capacity: '600t/日', currentLoad: 400, loadRate: 66, odor: '差', noise: '75dB', lastUpdate: '刚刚', alert: '臭气浓度超标' },
  { id: 'TS-004', name: '罗湖清水河转运站', district: '罗湖区', status: 'normal', capacity: '1000t/日', currentLoad: 500, loadRate: 50, odor: '优', noise: '50dB', lastUpdate: '5分钟前' },
  { id: 'TS-005', name: '龙华大浪转运站', district: '龙华区', status: 'normal', capacity: '400t/日', currentLoad: 200, loadRate: 50, odor: '良', noise: '58dB', lastUpdate: '1分钟前' },
  { id: 'TS-006', name: '龙岗平湖转运站', district: '龙岗区', status: 'offline', capacity: '700t/日', currentLoad: 0, loadRate: 0, odor: '--', noise: '--', lastUpdate: '2小时前' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    normal: { label: '运行正常', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    warning: { label: '高负荷', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    alert: { label: '异常报警', className: 'bg-red-100 text-red-700 border-red-200' },
    offline: { label: '设备离线', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function TransferTopic() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<typeof STATIONS[0] | null>(STATIONS[0]);

  const filteredStations = STATIONS.filter(s => 
    s.name.includes(searchQuery) || s.district.includes(searchQuery)
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
              <h2 className="text-lg font-bold text-slate-800">转运站监控</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索转运站名称/区域..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedStation?.id === station.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{station.name}</div>
                      <div className="text-xs text-slate-500">{station.district}</div>
                    </div>
                  </div>
                  <StatusBadge status={station.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">当前负荷: {station.currentLoad}t / {station.capacity}</span>
                    <span className="font-medium text-slate-700">{station.loadRate}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        station.loadRate > 85 ? 'bg-orange-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${station.loadRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center"><Wind className="w-3 h-3 mr-1" /> 臭气: {station.odor}</span>
                      <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> 噪音: {station.noise}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <p className="text-sm text-slate-400 mt-1">将显示转运站分布及实时状态</p>
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Panel: Details */}
        {selectedStation && (
          <div className="w-96 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">转运站详情</h3>
                <StatusBadge status={selectedStation.status} />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800">{selectedStation.name}</div>
                  <div className="text-sm text-slate-500">{selectedStation.district}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Alert if any */}
              {selectedStation.alert && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-red-800">当前告警</div>
                    <div className="text-xs text-red-600 mt-0.5">{selectedStation.alert}</div>
                  </div>
                </div>
              )}

              {/* Video Feed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">实时监控</h4>
                  <button className="text-slate-400 hover:text-blue-600">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center group">
                  <Video className="w-8 h-8 text-slate-600" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-[10px] text-white flex items-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse" />
                    卸料大厅 01
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm text-sm font-medium transition-colors">
                      查看所有监控
                    </button>
                  </div>
                </div>
              </div>

              {/* Operations Data */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">运行数据</h4>
                <div className="bg-slate-50 rounded-xl p-3 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-500">设计处理能力</span>
                      <span className="font-medium text-slate-800">{selectedStation.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-500">今日已处理</span>
                      <span className="font-medium text-slate-800">{selectedStation.currentLoad}t</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500">当前负荷率</span>
                      <span className={cn(
                        "font-bold",
                        selectedStation.loadRate > 85 ? "text-orange-600" : "text-blue-600"
                      )}>{selectedStation.loadRate}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          selectedStation.loadRate > 85 ? 'bg-orange-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${selectedStation.loadRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Data */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">环境监测</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Wind className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">臭气浓度</span>
                    </div>
                    <div className={cn(
                      "font-medium",
                      selectedStation.odor === '差' ? "text-red-600" : "text-slate-800"
                    )}>{selectedStation.odor}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Activity className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">噪音水平</span>
                    </div>
                    <div className="font-medium text-slate-800">{selectedStation.noise}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Droplets className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">渗滤液液位</span>
                    </div>
                    <div className="font-medium text-slate-800">45%</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center text-slate-500 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">除臭设备</span>
                    </div>
                    <div className="font-medium text-emerald-600">运行中</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => navigate('/sorting/treatment')}
                className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                进入详细管控面板
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
