import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Search,
  Filter,
  Camera,
  CheckCircle2,
  Clock,
  ChevronRight,
  Video
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const INCIDENTS = [
  { id: 'DMP-001', location: '南山区科技园北区空地', time: '2023-10-27 02:15', type: '建筑垃圾', confidence: 98, status: 'unprocessed', source: '无人机巡查', description: '发现一辆无牌货车倾倒大量建筑废料。' },
  { id: 'DMP-002', location: '宝安区西乡街道偏僻路段', time: '2023-10-26 23:40', type: '生活垃圾', confidence: 95, status: 'processing', source: '固定监控', description: '多名人员在此处丢弃大量生活垃圾袋。' },
  { id: 'DMP-003', location: '龙岗区平湖街道废弃厂房', time: '2023-10-26 04:20', type: '工业废弃物', confidence: 92, status: 'processed', source: '群众举报', description: '有刺鼻气味的工业废料被倾倒在厂房后方。' },
  { id: 'DMP-004', location: '福田区梅林水库周边', time: '2023-10-25 21:10', type: '大件垃圾', confidence: 88, status: 'unprocessed', source: '巡查车辆', description: '发现废弃沙发和床垫被丢弃在绿化带。' },
  { id: 'DMP-005', location: '罗湖区梧桐山盘山公路', time: '2023-10-24 01:30', type: '混合垃圾', confidence: 96, status: 'processed', source: '固定监控', description: '一辆小货车沿途抛洒混合垃圾。' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    unprocessed: { label: '待处理', className: 'bg-red-100 text-red-700 border-red-200' },
    processing: { label: '处理中', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    processed: { label: '已结案', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function IllegalDumping() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<typeof INCIDENTS[0] | null>(INCIDENTS[0]);

  const filteredIncidents = INCIDENTS.filter(i => 
    i.location.includes(searchQuery) || i.type.includes(searchQuery)
  );

  return (
    <div className="h-full flex space-x-4">
      {/* Left Panel: List */}
      <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">违规倾倒研判</h2>
            <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索地点/垃圾类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-all border",
                selectedIncident?.id === incident.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {incident.type}
                  </span>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    AI置信度 {incident.confidence}%
                  </span>
                </div>
                <StatusBadge status={incident.status} />
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">{incident.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    {incident.time}
                  </div>
                  <div className="text-slate-400">
                    来源: {incident.source}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center & Right: Details and Map */}
      <div className="flex-1 flex flex-col space-y-4 min-w-0">
        {/* Top: Details */}
        {selectedIncident ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">研判详情 - {selectedIncident.id}</h3>
                  <div className="text-xs text-slate-500">发现时间: {selectedIncident.time}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  误报排除
                </button>
                <button 
                  onClick={() => navigate('/comprehensive/inspection')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  生成工单
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Evidence */}
              <div className="col-span-2 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-slate-400" />
                  现场证据
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                    <Video className="w-8 h-8 text-slate-300" />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                      监控录像片段
                    </div>
                    <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl m-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-1">
                      <span className="bg-red-500 text-white text-[10px] px-1 rounded">AI 识别区域</span>
                    </div>
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative">
                    <Camera className="w-8 h-8 text-slate-300" />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                      抓拍照片
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-slate-400" />
                  AI 分析结果
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 space-y-3 border border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">事件描述</div>
                    <div className="text-sm text-slate-800">{selectedIncident.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">垃圾类型</div>
                      <div className="text-xs font-medium text-slate-800">{selectedIncident.type}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">预估体积</div>
                      <div className="text-xs font-medium text-slate-800">约 5m³</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">涉事车辆</div>
                      <div className="text-xs font-medium text-slate-800">粤B·***89</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-0.5">数据来源</div>
                      <div className="text-xs font-medium text-slate-800">{selectedIncident.source}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-64 shrink-0 text-slate-400">
            请选择左侧记录查看研判详情
          </div>
        )}

        {/* Bottom: Map */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">GIS 地图加载中...</p>
            <p className="text-sm text-slate-400 mt-1">将显示倾倒事件发生位置及周边监控分布</p>
          </div>
        </div>
      </div>
    </div>
  );
}
