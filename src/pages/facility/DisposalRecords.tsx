import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queryDisposalRecords, queryDisposalFacilities } from '../../api/services/facility';
import { DisposalRecord, DisposalFacility } from '../../types/facility';
import { 
  Search, Filter, Download, Calendar, User, MapPin, Truck, Scale, 
  Clock, ChevronLeft, ChevronRight, BarChart3, PieChart as PieIcon, 
  LayoutGrid, List as ListIcon, X, Info, ShieldCheck, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const DisposalRecords: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFacilityId = searchParams.get('facilityId') || '';

  const [records, setRecords] = useState<DisposalRecord[]>([]);
  const [facilities, setFacilities] = useState<DisposalFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');
  const [subsystem, setSubsystem] = useState<string>('all');
  const [selectedFacilityId, setSelectedFacilityId] = useState(initialFacilityId);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DisposalRecord | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await queryDisposalFacilities();
        setFacilities(res.data);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      }
    };
    fetchFacilities();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await queryDisposalRecords({ 
          pageNo: page, 
          pageSize,
          facilityId: selectedFacilityId
        });
        setRecords(res.data.list);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Failed to fetch disposal records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [page, selectedFacilityId, selectedDate]);

  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedFacilityId(newId);
    setPage(1);
    if (newId) {
      setSearchParams({ facilityId: newId });
    } else {
      setSearchParams({});
    }
  };

  const filteredRecords = records.filter(r => {
    if (subsystem === 'all') return true;
    const facility = facilities.find(f => f.id === r.facilityId);
    return facility?.type === subsystem;
  });

  // 统计数据
  const statsByFacility = facilities.map(f => ({
    name: f.name,
    weight: records.filter(r => r.facilityId === f.id).reduce((sum, r) => sum + r.weight, 0),
    count: records.filter(r => r.facilityId === f.id).length
  })).filter(s => s.count > 0);

  const statsByRegion = Array.from(new Set(records.map(r => r.source))).map(region => ({
    name: region,
    value: records.filter(r => r.source === region).reduce((sum, r) => sum + r.weight, 0)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">今日总处置量</p>
              <p className="text-2xl font-bold text-slate-900">1,245.8 <span className="text-xs font-normal text-slate-400">吨</span></p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">今日进场车次</p>
              <p className="text-2xl font-bold text-slate-900">86 <span className="text-xs font-normal text-slate-400">次</span></p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">处置负荷率</p>
              <p className="text-2xl font-bold text-slate-900">78.5 <span className="text-xs font-normal text-slate-400">%</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选与视图切换 */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索记录、操作人..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" />
          </div>
          <select 
            value={subsystem}
            onChange={(e) => setSubsystem(e.target.value)}
            className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 font-bold text-slate-600"
          >
            <option value="all">全部子系统</option>
            <option value="landfill">填埋场监管</option>
            <option value="incineration">焚烧厂监管</option>
            <option value="kitchen">餐厨处置监管</option>
          </select>
          <select 
            value={selectedFacilityId}
            onChange={handleFacilityChange}
            className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 font-bold text-slate-600"
          >
            <option value="">全部设施</option>
            {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 font-bold text-slate-600" 
          />
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ListIcon className="w-4 h-4" /> 详细报表
          </button>
          <button 
            onClick={() => setViewMode('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'stats' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <PieIcon className="w-4 h-4" /> 计量统计
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-6">记录编号</th>
                    <th className="p-6">处置设施</th>
                    <th className="p-6">垃圾类型</th>
                    <th className="p-6">重量 (吨)</th>
                    <th className="p-6">来源区域</th>
                    <th className="p-6">操作人</th>
                    <th className="p-6">处置时间</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {loading ? (
                    <tr><td colSpan={7} className="p-12 text-center text-slate-400">加载记录中...</td></tr>
                  ) : (
                    filteredRecords.map((record, idx) => (
                      <tr 
                        key={record.recordId} 
                        onClick={() => setSelectedRecord(record)}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="p-6 font-mono text-slate-400">{record.recordId}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-900">{record.facilityName}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">{record.wasteType}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-emerald-500" />
                            <span className="text-lg font-bold text-slate-900">{record.weight}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-600">{record.source}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-bold text-slate-700">{record.operator}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            {record.time}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="p-6 border-t border-slate-50 flex justify-between items-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                共 <span className="text-slate-900">{total}</span> 条记录
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={page === Math.ceil(total / pageSize)}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                各设施处置量统计 (吨)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsByFacility}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Bar dataKey="weight" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-500" />
                区域来源分布 (吨)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsByRegion}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statsByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {statsByRegion.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* 头部 */}
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">处置记录详情</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: {selectedRecord.recordId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* 核心信息卡片 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">处置设施</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-black text-slate-900">{selectedRecord.facilityName}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">垃圾类型</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-black text-slate-900">{selectedRecord.wasteType}</span>
                    </div>
                  </div>
                </div>

                {/* 详细指标 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <Scale className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">处置重量</p>
                    <p className="text-xl font-black text-slate-900">{selectedRecord.weight} <span className="text-xs text-slate-400">吨</span></p>
                  </div>
                  <div className="p-4 text-center border-x border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">来源区域</p>
                    <p className="text-sm font-black text-slate-900">{selectedRecord.source}</p>
                  </div>
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">处置时间</p>
                    <p className="text-sm font-black text-slate-900">{selectedRecord.time.split(' ')[1]}</p>
                  </div>
                </div>

                {/* 操作信息 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> 操作人员信息
                  </h4>
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{selectedRecord.operator}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">现场操作员</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">认证通过</span>
                    </div>
                  </div>
                </div>

                {/* 备注说明 */}
                <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm"><Info className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs font-bold text-blue-900 mb-1">处置说明</p>
                    <p className="text-[10px] text-blue-700 leading-relaxed">
                      该批次垃圾已按照标准处置流程完成进场计量与卸料，系统已自动同步至监管平台。
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all"
                >
                  打印凭证
                </button>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                  关闭详情
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisposalRecords;
