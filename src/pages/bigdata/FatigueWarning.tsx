import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Search,
  Filter,
  Car,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  PhoneCall
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const KPIS = [
  { title: '今日预警总数', value: '15', unit: '次', icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: '已处理预警', value: '12', unit: '次', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { title: '待处理预警', value: '3', unit: '次', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50' },
];

const WARNINGS = [
  { id: 'WARN-20231027-001', driver: '张师傅', vehicle: '粤B·12345', time: '10:23:45', location: '南山区深南大道', status: 'unhandled', type: '打哈欠', duration: '3秒', speed: '45 km/h' },
  { id: 'WARN-20231027-002', driver: '李师傅', vehicle: '粤B·67890', time: '09:15:20', location: '福田区滨河大道', status: 'handled', type: '闭眼', duration: '2秒', speed: '50 km/h' },
  { id: 'WARN-20231027-003', driver: '王师傅', vehicle: '粤B·24680', time: '08:45:10', location: '罗湖区深南东路', status: 'handled', type: '左顾右盼', duration: '5秒', speed: '30 km/h' },
  { id: 'WARN-20231027-004', driver: '赵师傅', vehicle: '粤B·13579', time: '07:30:05', location: '宝安区宝安大道', status: 'unhandled', type: '打哈欠', duration: '4秒', speed: '40 km/h' },
  { id: 'WARN-20231027-005', driver: '陈师傅', vehicle: '粤B·98765', time: '06:10:55', location: '龙华区龙华大道', status: 'handled', type: '闭眼', duration: '1.5秒', speed: '55 km/h' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    unhandled: { label: '待处理', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    handled: { label: '已处理', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function FatigueWarning() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarning, setSelectedWarning] = useState<typeof WARNINGS[0] | null>(WARNINGS[0]);

  const filteredWarnings = WARNINGS.filter(w => 
    w.driver.includes(searchQuery) || w.vehicle.includes(searchQuery)
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
              <h2 className="text-lg font-bold text-slate-800">预警列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索司机姓名/车牌号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredWarnings.map((warning) => (
              <div
                key={warning.id}
                onClick={() => setSelectedWarning(warning)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedWarning?.id === warning.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {warning.type}
                    </span>
                    <span className="text-xs text-slate-500">{warning.time}</span>
                  </div>
                  <StatusBadge status={warning.status} />
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{warning.driver}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{warning.vehicle}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{warning.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedWarning ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">疲劳驾驶预警 - {selectedWarning.type}</h2>
                    <div className="text-sm text-slate-500 mt-1">预警编号: {selectedWarning.id}</div>
                  </div>
                </div>
                {selectedWarning.status === 'unhandled' && (
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      联系司机
                    </button>
                    <button 
                      onClick={() => navigate('/comprehensive/collection')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      标记为已处理
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Warning Details */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">预警详情</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">发生时间</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.time}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">发生地点</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.location}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">预警类型</div>
                          <div className="text-sm font-medium text-red-600">{selectedWarning.type}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">持续时间</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.duration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">当前车速</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.speed}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">车辆与司机信息</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">司机姓名</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.driver}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">联系电话</div>
                          <div className="text-sm font-medium text-slate-800">138****1234</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">车牌号</div>
                          <div className="text-sm font-medium text-slate-800">{selectedWarning.vehicle}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">所属车队</div>
                          <div className="text-sm font-medium text-slate-800">南山一队</div>
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
                        src={`https://picsum.photos/seed/${selectedWarning.id}/800/600`} 
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
                      <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-red-500 rounded-lg">
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {selectedWarning.type} (98%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧预警记录查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
