import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Filter,
  BarChart3,
  Building2,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Mock Data ---

const KPIS = [
  { title: '履约企业总数', value: '24', unit: '家', icon: Building2, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: '平均履约得分', value: '92.5', unit: '分', icon: Award, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { title: '本月违约事件', value: '12', unit: '起', icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: '累计扣罚金额', value: '15.6', unit: '万元', icon: TrendingUp, color: 'text-red-500', bgColor: 'bg-red-50' },
];

const ENTERPRISES = [
  { id: 'ENT-001', name: '南山环卫一公司', type: '清扫保洁', score: 95, rank: 1, contractEnd: '2025-12-31', status: 'excellent' },
  { id: 'ENT-002', name: '福田环卫服务集团', type: '综合环卫', score: 88, rank: 5, contractEnd: '2024-06-30', status: 'good' },
  { id: 'ENT-003', name: '宝安固废处理公司', type: '垃圾收运', score: 76, rank: 18, contractEnd: '2024-12-31', status: 'warning' },
  { id: 'ENT-004', name: '罗湖清洁服务中心', type: '清扫保洁', score: 92, rank: 3, contractEnd: '2026-10-15', status: 'excellent' },
  { id: 'ENT-005', name: '龙华智慧环卫', type: '综合环卫', score: 85, rank: 8, contractEnd: '2025-08-20', status: 'good' },
];

const RADAR_DATA = [
  { subject: '作业质量', A: 95, fullMark: 100 },
  { subject: '人员管理', A: 90, fullMark: 100 },
  { subject: '车辆设备', A: 85, fullMark: 100 },
  { subject: '安全生产', A: 98, fullMark: 100 },
  { subject: '公众满意度', A: 88, fullMark: 100 },
  { subject: '数据接入', A: 100, fullMark: 100 },
];

const BAR_DATA = [
  { month: '5月', score: 92 },
  { month: '6月', score: 94 },
  { month: '7月', score: 90 },
  { month: '8月', score: 95 },
  { month: '9月', score: 93 },
  { month: '10月', score: 95 },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    excellent: { label: '优秀', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    good: { label: '良好', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    warning: { label: '需整改', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  }[status] || { label: '未知', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export default function ContractAnalysis() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState<typeof ENTERPRISES[0] | null>(ENTERPRISES[0]);

  const filteredEnterprises = ENTERPRISES.filter(e => 
    e.name.includes(searchQuery) || e.type.includes(searchQuery)
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
        <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">履约企业列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索企业名称/业务类型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredEnterprises.map((enterprise) => (
              <div
                key={enterprise.id}
                onClick={() => setSelectedEnterprise(enterprise)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border",
                  selectedEnterprise?.id === enterprise.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800">{enterprise.name}</span>
                  </div>
                  <StatusBadge status={enterprise.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">综合得分</div>
                    <div className={cn(
                      "text-sm font-bold",
                      enterprise.score >= 90 ? "text-emerald-600" : enterprise.score >= 80 ? "text-blue-600" : "text-orange-600"
                    )}>{enterprise.score}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">全市排名</div>
                    <div className="text-sm font-bold text-slate-700">第 {enterprise.rank} 名</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 mb-0.5">业务类型</div>
                    <div className="text-xs font-medium text-slate-700 mt-0.5">{enterprise.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right: Details */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedEnterprise ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedEnterprise.name}</h2>
                    <div className="text-sm text-slate-500 mt-1">合同到期日: {selectedEnterprise.contractEnd}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    查看合同详情
                  </button>
                  <button 
                    onClick={() => navigate('/sorting/report')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    生成评估报告
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Radar Chart */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">多维能力评估</h3>
                    <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="得分" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">近半年得分趋势</h3>
                    <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip 
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Penalty History */}
                  <div className="col-span-2 bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800">近期违约/扣罚记录</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        查看全部 <ChevronRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { date: '2023-10-15', type: '作业违规', desc: '清扫车辆未按规定路线作业', penalty: '扣除当月考核分 2 分' },
                        { date: '2023-09-22', type: '安全事故', desc: '垃圾收运过程中发生轻微刮擦', penalty: '罚款 5000 元' },
                        { date: '2023-08-10', type: '公众投诉', desc: '居民投诉垃圾桶满溢未及时清理', penalty: '警告一次' },
                      ].map((record, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-500 w-24">{record.date}</div>
                            <div className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-medium">{record.type}</div>
                            <div className="text-sm text-slate-800">{record.desc}</div>
                          </div>
                          <div className="text-sm font-medium text-slate-700">{record.penalty}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              请选择左侧企业查看履约详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
