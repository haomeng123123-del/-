import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Search,
  Filter,
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const KPIS = [
  { title: '今日急加水事件', value: '8', unit: '起', icon: Droplets, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '已核实处理', value: '5', unit: '起', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { title: '待核实事件', value: '3', unit: '起', icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50' },
];

const EVENTS = [
  { id: 'WR-20231027-001', vehicle: '粤B·12345', time: '14:23:45', location: '南山区深南大道与科技南路交汇处', status: 'unhandled', duration: '15分钟', volume: '约 2.5 吨', type: '消防栓违规取水' },
  { id: 'WR-20231027-002', vehicle: '粤B·67890', time: '11:15:20', location: '福田区滨河大道', status: 'handled', duration: '10分钟', volume: '约 1.8 吨', type: '绿化带取水' },
  { id: 'WR-20231027-003', vehicle: '粤B·24680', time: '09:45:10', location: '罗湖区深南东路', status: 'handled', duration: '20分钟', volume: '约 3.0 吨', type: '消防栓违规取水' },
  { id: 'WR-20231027-004', vehicle: '粤B·13579', time: '08:30:05', location: '宝安区宝安大道', status: 'unhandled', duration: '12分钟', volume: '约 2.0 吨', type: '绿化带取水' },
  { id: 'WR-20231027-005', vehicle: '粤B·98765', time: '07:10:55', location: '龙华区龙华大道', status: 'handled', duration: '18分钟', volume: '约 2.8 吨', type: '消防栓违规取水' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    unhandled: { label: '待核实', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    handled: { label: '已处理', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function WaterRefill() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(EVENTS[0]);

  const filteredEvents = EVENTS.filter(e => 
    e.vehicle.includes(searchQuery) || e.location.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        {KPIS.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center space-x-4"
          >
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
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Left Panel: List */}
        <div className="w-[380px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">事件列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索车牌号/地点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedEvent?.id === event.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-xs font-medium flex items-center">
                      <Droplets className="w-3 h-3 mr-1" />
                      {event.type}
                    </span>
                    <span className="text-xs text-slate-500">{event.time}</span>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center">
                    <Car className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{event.vehicle}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedEvent ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">车辆急加水识别 - {selectedEvent.type}</h2>
                    <div className="text-sm text-slate-500 mt-1">事件编号: {selectedEvent.id}</div>
                  </div>
                </div>
                {selectedEvent.status === 'unhandled' && (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => navigate('/comprehensive/cleaning')}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      下发整改
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      标记为已处理
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Event Details */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">事件详情</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">发生时间</div>
                          <div className="text-sm font-medium text-slate-800">{selectedEvent.time}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-slate-500 mb-1">发生地点</div>
                          <div className="text-sm font-medium text-slate-800">{selectedEvent.location}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">事件类型</div>
                          <div className="text-sm font-medium text-blue-600">{selectedEvent.type}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">涉事车辆</div>
                          <div className="text-sm font-medium text-slate-800">{selectedEvent.vehicle}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">停留时长</div>
                          <div className="text-sm font-medium text-slate-800">{selectedEvent.duration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">预估加水量</div>
                          <div className="text-sm font-medium text-slate-800">{selectedEvent.volume}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">AI 研判分析</h3>
                      <div className="space-y-3 text-sm text-slate-600">
                        <p>1. 车辆在非规定取水点长时间停留（超过10分钟）。</p>
                        <p>2. 视频监控识别到车辆连接外部水源（消防栓/绿化带水管）。</p>
                        <p>3. 车辆水箱液位传感器数据显示短时间内液位急剧上升。</p>
                        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                          <strong>研判结论：</strong> 高度疑似违规取水，建议立即核实处理。
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence (Video/Image) */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800">现场抓拍证据</h3>
                      <div className="flex space-x-2">
                        <button className="p-1.5 bg-white rounded-md text-slate-500 hover:text-blue-600 shadow-sm border border-slate-200">
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative min-h-[300px] flex items-center justify-center">
                      {/* Placeholder for actual video/image */}
                      <img 
                        src={`https://picsum.photos/seed/${selectedEvent.id}/800/600`} 
                        alt="Evidence" 
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                        </div>
                      </div>
                      {/* AI Overlay Box */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-blue-500 rounded-lg">
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          违规取水行为 (95%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧事件记录查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
