import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { querySortingRecords, querySortingPoints } from '../../api/services/facility';
import { SortingRecord, SortingPoint } from '../../types/facility';
import { Search, Filter, Download, Calendar, User, MapPin, Trash2, Scale, Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X, Info, Camera, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SortingRecords: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPointId = searchParams.get('pointId') || '';
  
  const [records, setRecords] = useState<SortingRecord[]>([]);
  const [points, setPoints] = useState<SortingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPointId, setSelectedPointId] = useState(initialPointId);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SortingRecord | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await querySortingPoints({});
        setPoints(res.data);
      } catch (error) {
        console.error('Failed to fetch points:', error);
      }
    };
    fetchPoints();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await querySortingRecords({ 
          pageNo: page, 
          pageSize,
          pointId: selectedPointId
        });
        setRecords(res.data.list);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Failed to fetch sorting records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [page, selectedPointId, selectedDate]);

  const handlePointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedPointId(newId);
    setPage(1);
    if (newId) {
      setSearchParams({ pointId: newId });
    } else {
      setSearchParams({});
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '可回收物': return 'bg-blue-50 text-blue-600 border-blue-100';
      case '有害垃圾': return 'bg-red-50 text-red-600 border-red-100';
      case '厨余垃圾': return 'bg-green-50 text-green-600 border-green-100';
      case '其他垃圾': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索点位、分类..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" />
        </div>
        <select 
          value={selectedPointId}
          onChange={handlePointChange}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2"
        >
          <option value="">全部点位</option>
          {points.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setPage(1);
          }}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2" 
        />
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
          <Filter className="w-4 h-4" /> 筛选
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" /> 导出
        </button>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-6">记录编号</th>
                <th className="p-6">分类点位</th>
                <th className="p-6">垃圾类别</th>
                <th className="p-6">重量 (kg)</th>
                <th className="p-6">准确率</th>
                <th className="p-6">投放时间</th>
                <th className="p-6">状态</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center text-slate-400">加载记录中...</td></tr>
              ) : (
                records.map((record, idx) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedRecord(record)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="p-6 font-mono text-slate-400">{record.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{record.pointName}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${getCategoryColor(record.category)}`}>
                        <Trash2 className="w-3 h-3" />
                        {record.category}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-emerald-500" />
                        <span className="text-lg font-bold text-slate-900">{record.weight}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                          <div 
                            className={`h-full ${record.accuracy > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${record.accuracy}%` }}
                          />
                        </div>
                        <span className={`font-bold ${record.accuracy > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {record.accuracy}%
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        {record.time}
                      </div>
                    </td>
                    <td className="p-6">
                      {record.accuracy > 90 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> 合格
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <AlertCircle className="w-4 h-4" /> 待改进
                        </div>
                      )}
                    </td>
                  </motion.tr>
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
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                    page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={page === Math.ceil(total / pageSize)}
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

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
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">投放记录详情</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: {selectedRecord.id}</p>
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">投放点位</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-black text-slate-900">{selectedRecord.pointName}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">垃圾类别</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${getCategoryColor(selectedRecord.category).split(' ')[1]}`}>
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-black text-slate-900">{selectedRecord.category}</span>
                    </div>
                  </div>
                </div>

                {/* 详细指标 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <Scale className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">重量</p>
                    <p className="text-xl font-black text-slate-900">{selectedRecord.weight} <span className="text-xs text-slate-400">kg</span></p>
                  </div>
                  <div className="p-4 text-center border-x border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">准确率</p>
                    <p className="text-xl font-black text-slate-900">{selectedRecord.accuracy}%</p>
                  </div>
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">投放时间</p>
                    <p className="text-sm font-black text-slate-900">{selectedRecord.time.split(' ')[1]}</p>
                  </div>
                </div>

                {/* 现场抓拍 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-slate-400" /> 现场抓拍
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI 识别结果: {selectedRecord.category}</span>
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-[32px] overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/${selectedRecord.id}/800/450`} 
                      alt="Sorting Capture" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20">
                        {selectedRecord.time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 判定结果 */}
                <div className={`p-6 rounded-[32px] border flex items-start gap-4 ${
                  selectedRecord.accuracy > 90 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                }`}>
                  <div className={`p-3 rounded-2xl bg-white shadow-sm ${
                    selectedRecord.accuracy > 90 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {selectedRecord.accuracy > 90 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className={`text-lg font-black ${selectedRecord.accuracy > 90 ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {selectedRecord.accuracy > 90 ? '投放合格' : '投放不规范'}
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${selectedRecord.accuracy > 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedRecord.accuracy > 90 
                        ? '该次投放分类准确，感谢您对环保事业的支持！' 
                        : '经 AI 识别，该次投放中混入了少量其他类别的垃圾，请注意分类。'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
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

export default SortingRecords;
