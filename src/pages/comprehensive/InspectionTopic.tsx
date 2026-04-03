import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart3,
  Calendar,
  ChevronRight,
  Camera,
  MapPin,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Mock Data ---

const KPIS = [
  { title: '本月检查次数', value: '342', unit: '次', icon: ClipboardCheck, color: 'text-blue-500', bgColor: 'bg-blue-50', path: '/sorting/report' },
  { title: '发现问题数', value: '86', unit: '个', icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50', path: '/sorting/report' },
  { title: '已整改问题', value: '75', unit: '个', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50', path: '/sorting/report' },
  { title: '整改完成率', value: '87.2%', unit: '', icon: BarChart3, color: 'text-indigo-500', bgColor: 'bg-indigo-50', path: '/sorting/report' },
];

const RECORDS = [
  { id: 'REC-001', type: '清扫保洁', district: '南山区', location: '深南大道科技园段', issue: '路面有明显散落垃圾，未及时清理', status: 'pending', inspector: '张监督员', date: '2023-10-27 14:30', deadline: '2023-10-28 14:30', company: '南山环卫一公司' },
  { id: 'REC-002', type: '垃圾收运', district: '福田区', location: '梅林一村垃圾收集点', issue: '垃圾桶满溢，周边有污水', status: 'rectified', inspector: '李监督员', date: '2023-10-26 09:15', deadline: '2023-10-27 09:15', company: '福田环卫二公司' },
  { id: 'REC-003', type: '公厕管理', district: '宝安区', location: '海滨广场公厕', issue: '洗手台有积水，纸巾缺失', status: 'processing', inspector: '王监督员', date: '2023-10-27 10:00', deadline: '2023-10-27 18:00', company: '宝安公厕管理所' },
  { id: 'REC-004', type: '转运站管理', district: '罗湖区', location: '清水河转运站', issue: '除臭设备未开启，异味较大', status: 'pending', inspector: '赵监督员', date: '2023-10-27 16:45', deadline: '2023-10-28 16:45', company: '罗湖转运中心' },
  { id: 'REC-005', type: '清扫保洁', district: '龙华区', location: '深圳北站东广场', issue: '果皮箱未及时清掏', status: 'rectified', inspector: '陈监督员', date: '2023-10-25 11:20', deadline: '2023-10-26 11:20', company: '龙华环卫服务公司' },
];

const CHART_DATA = [
  { name: '南山区', value: 24 },
  { name: '福田区', value: 18 },
  { name: '宝安区', value: 28 },
  { name: '罗湖区', value: 15 },
  { name: '龙华区', value: 20 },
  { name: '龙岗区', value: 22 },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: { label: '待整改', className: 'bg-red-100 text-red-700 border-red-200' },
    processing: { label: '整改中', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    rectified: { label: '已整改', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function InspectionTopic() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<typeof RECORDS[0] | null>(RECORDS[0]);

  const filteredRecords = RECORDS.filter(r => 
    r.location.includes(searchQuery) || r.issue.includes(searchQuery) || r.company.includes(searchQuery)
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
        <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">考核记录</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索地点/问题/责任单位..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedRecord?.id === record.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {record.type}
                    </span>
                    <span className="text-xs text-slate-500">{record.id}</span>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
                <div className="font-medium text-slate-800 text-sm mb-2 line-clamp-2">
                  {record.issue}
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{record.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                      {record.date}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                      {record.inspector}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedRecord ? (
            <>
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">问题详情单</h2>
                      <div className="text-sm text-slate-500">{selectedRecord.id}</div>
                    </div>
                  </div>
                  <StatusBadge status={selectedRecord.status} />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-medium text-slate-800 mb-2">问题描述</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedRecord.issue}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-1 h-4 bg-blue-500 rounded-full mr-2" />
                    基本信息
                  </h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">问题分类</span>
                      <span className="text-sm font-medium text-slate-800">{selectedRecord.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">所属区域</span>
                      <span className="text-sm font-medium text-slate-800">{selectedRecord.district}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="text-xs text-slate-500 mb-1">详细地址</span>
                      <span className="text-sm font-medium text-slate-800">{selectedRecord.location}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">发现时间</span>
                      <span className="text-sm font-medium text-slate-800">{selectedRecord.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">监督员</span>
                      <span className="text-sm font-medium text-slate-800">{selectedRecord.inspector}</span>
                    </div>
                  </div>
                </div>

                {/* Rectification Info */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-1 h-4 bg-orange-500 rounded-full mr-2" />
                    整改要求
                  </h4>
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-orange-600/70 mb-1">责任单位</span>
                      <span className="text-sm font-medium text-orange-900">{selectedRecord.company}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-orange-600/70 mb-1">整改期限</span>
                      <span className="text-sm font-medium text-orange-900">{selectedRecord.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />
                    现场照片
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                      <Camera className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                      <Camera className="w-8 h-8 text-slate-300" />
                    </div>
                    {selectedRecord.status === 'rectified' && (
                      <div className="aspect-video bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-200 relative overflow-hidden">
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">整改后</div>
                        <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                <button 
                  onClick={() => navigate('/sorting/report')}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                >
                  查看完整报告
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  审核通过
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧记录查看详情
            </div>
          )}
        </div>

        {/* Right Panel: Charts */}
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">统计分析</h2>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-4">各区问题数量分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={60} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-4">问题分类占比</h3>
              <div className="space-y-3">
                {[
                  { label: '清扫保洁', value: 45, color: 'bg-blue-500' },
                  { label: '垃圾收运', value: 25, color: 'bg-emerald-500' },
                  { label: '公厕管理', value: 15, color: 'bg-orange-500' },
                  { label: '其他', value: 15, color: 'bg-slate-400' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-800">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
