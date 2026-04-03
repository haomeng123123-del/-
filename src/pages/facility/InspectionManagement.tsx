import React, { useEffect, useState } from 'react';
import { queryInspectionRecords } from '../../api/services/facility';
import { InspectionRecord } from '../../types/facility';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Calendar, ClipboardList, CheckCircle, AlertTriangle, Clock, Plus, User, ClipboardCheck } from 'lucide-react';

const InspectionManagement: React.FC = () => {
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await queryInspectionRecords({ pageNo: 1, pageSize: 10 });
        setRecords(res.data.list);
      } catch (error) {
        console.error('Failed to fetch inspection records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter(record => {
    return record.toiletName.includes(searchQuery) || record.inspector.includes(searchQuery);
  });

  if (loading) return <div className="p-8 text-center text-slate-500">加载巡检记录中...</div>;

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '今日巡检次数', value: '24', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '发现问题数', value: '3', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: '已整改', value: '2', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: '待整改', value: '1', icon: Clock, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">日常巡检记录</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索公厕或巡检员..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              发起巡检
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">暂无匹配的巡检记录</div>
          ) : (
            filteredRecords.map((record, idx) => (
              <motion.div
                key={record.inspectionId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow"
              >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    record.status === 'passed' ? 'bg-emerald-100 text-emerald-600' : 
                    record.status === 'failed' ? 'bg-red-100 text-red-600' : 
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{record.toiletName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {record.inspectionTime}
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-black ${
                  record.score >= 90 ? 'text-emerald-500' : 
                  record.score >= 80 ? 'text-orange-500' : 
                  'text-red-500'
                }`}>
                  {record.score}分
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">巡检员</span>
                  <span className="font-bold text-slate-900">{record.inspector}</span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="text-slate-500 whitespace-nowrap mr-4">发现问题</span>
                  <span className="font-medium text-slate-700 text-right line-clamp-2">{record.issues}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-200/60">
                  <span className="text-slate-500">处理状态</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    record.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 
                    record.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {record.status === 'passed' && <CheckCircle className="w-3 h-3" />}
                    {record.status === 'failed' && <AlertTriangle className="w-3 h-3" />}
                    {record.status === 'rectifying' && <Clock className="w-3 h-3" />}
                    {record.status === 'passed' ? '合格' : 
                     record.status === 'failed' ? '不合格' : '整改中'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex gap-2">
                <button 
                  onClick={() => setSelectedRecord(record)}
                  className="flex-1 bg-white text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  查看详情
                </button>
                {record.status === 'failed' && (
                  <button className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary-container transition-colors">
                    发起整改
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>

      {/* 发起巡检弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">发起新巡检</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">巡检公厕</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm">
                      <option>中山路智慧公厕</option>
                      <option>人民广场公厕</option>
                      <option>滨江公园公厕</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">巡检员</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" defaultValue="当前管理员" readOnly />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">巡检项</label>
                    <div className="space-y-2">
                      {['卫生情况', '设备运行', '耗材余量', '异味监测'].map(item => (
                        <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm text-slate-700">{item}</span>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white text-emerald-500 rounded-lg text-[10px] font-bold border border-emerald-100">合格</button>
                            <button className="px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-bold border border-slate-100">不合格</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    提交巡检
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
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
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">巡检详情</h3>
                  <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white text-primary shadow-sm"><ClipboardCheck className="w-6 h-6" /></div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{selectedRecord.toiletName}</p>
                        <p className="text-xs text-slate-400">{selectedRecord.inspectionTime}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-primary">{selectedRecord.score}分</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-400 text-sm">巡检员</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedRecord.inspector}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">发现问题</p>
                      <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-medium">
                        {selectedRecord.issues}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">当前状态</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedRecord.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 
                        selectedRecord.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {selectedRecord.status === 'passed' ? '合格' : 
                         selectedRecord.status === 'failed' ? '不合格' : '整改中'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspectionManagement;
