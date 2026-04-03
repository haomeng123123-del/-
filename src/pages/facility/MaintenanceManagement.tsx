import React, { useEffect, useState } from 'react';
import { queryMaintenanceRecords, queryMaintenancePlans, queryFaultAlarms, queryDisposalFacilities } from '../../api/services/facility';
import { MaintenanceRecord, MaintenancePlan, FaultAlarm, DisposalFacility } from '../../types/facility';
import { 
  Wrench, Calendar, Clock, CheckCircle2, AlertTriangle, 
  Settings, Search, Filter, Plus, ChevronRight, 
  History, ClipboardList, BellRing, Activity, MapPin, User, MoreVertical, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MaintenanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'records' | 'alarms'>('plans');
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [alarms, setAlarms] = useState<FaultAlarm[]>([]);
  const [facilities, setFacilities] = useState<DisposalFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plansRes, recordsRes, alarmsRes, facilitiesRes] = await Promise.all([
          queryMaintenancePlans(),
          queryMaintenanceRecords({ pageNo: page, pageSize }),
          queryFaultAlarms(),
          queryDisposalFacilities()
        ]);
        setPlans(plansRes.data);
        setRecords(recordsRes.data.list);
        setTotal(recordsRes.data.total);
        setAlarms(alarmsRes.data);
        setFacilities(facilitiesRes.data);
      } catch (error) {
        console.error('Failed to fetch maintenance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const filteredPlans = plans.filter(p => 
    (selectedFacility === 'all' || p.facilityName === selectedFacility) &&
    (p.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) || p.facilityName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRecords = records.filter(r => 
    (selectedFacility === 'all' || r.facilityName === selectedFacility) &&
    (r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) || r.staff.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAlarms = alarms.filter(a => 
    (selectedFacility === 'all' || a.facilityName === selectedFacility) &&
    (a.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-50';
      case 'paused': return 'text-amber-500 bg-amber-50';
      case 'completed': return 'text-blue-500 bg-blue-50';
      case 'unhandled': return 'text-rose-500 bg-rose-50';
      case 'handling': return 'text-amber-500 bg-amber-50';
      case 'resolved': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-slate-400 bg-slate-50';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-rose-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">进行中计划</p>
              <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-500">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">未处理故障</p>
              <p className="text-2xl font-bold text-slate-900">{alarms.filter(a => a.status === 'unhandled').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">本月已完成维保</p>
              <p className="text-2xl font-bold text-slate-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">设备健康度</p>
              <p className="text-2xl font-bold text-slate-900">96.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 选项卡切换 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ClipboardList className="w-4 h-4" /> 维保计划
          </button>
          <button 
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History className="w-4 h-4" /> 维保记录
          </button>
          <button 
            onClick={() => setActiveTab('alarms')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'alarms' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BellRing className="w-4 h-4" /> 故障报警
          </button>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索设备、设施..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <select 
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="bg-white border border-slate-100 rounded-2xl text-sm px-4 py-2.5 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">全部设施</option>
            {facilities.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> 新增计划
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 gap-6"
        >
          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlans.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-400">未找到匹配的维保计划</div>
              ) : (
                filteredPlans.map(plan => (
                  <div key={plan.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-2xl bg-slate-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Settings className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(plan.status)}`}>
                        {plan.status === 'active' ? '执行中' : plan.status === 'paused' ? '已暂停' : '已完成'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{plan.deviceName}</h4>
                    <p className="text-sm text-slate-400 mb-4">{plan.facilityName}</p>
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">维保周期</span>
                        <span className="font-bold text-slate-700">{plan.cycle === 'daily' ? '每日' : plan.cycle === 'weekly' ? '每周' : plan.cycle === 'monthly' ? '每月' : '每季度'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">上次维保</span>
                        <span className="font-bold text-slate-700">{plan.lastTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">下次维保</span>
                        <span className="font-bold text-rose-500">{plan.nextTime}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedItem({ type: 'plan', data: plan })}
                      className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      查看详情 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-6">维保单号</th>
                    <th className="p-6">设施名称</th>
                    <th className="p-6">维保类型</th>
                    <th className="p-6">维保人员</th>
                    <th className="p-6">维保日期</th>
                    <th className="p-6">维保结果</th>
                    <th className="p-6">操作</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredRecords.length === 0 ? (
                    <tr><td colSpan={7} className="p-12 text-center text-slate-400">未找到匹配的维保记录</td></tr>
                  ) : (
                    filteredRecords.map(record => (
                      <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-mono text-slate-400">{record.id}</td>
                        <td className="p-6 font-bold text-slate-900">{record.facilityName}</td>
                        <td className="p-6">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">
                            {record.type === 'routine' ? '例行维保' : record.type === 'repair' ? '故障维修' : '升级改造'}
                          </span>
                        </td>
                        <td className="p-6 text-slate-600">{record.staff}</td>
                        <td className="p-6 text-slate-400">{record.date}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${record.result === 'success' ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className={record.result === 'success' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                              {record.result === 'success' ? '成功' : '待定'}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <button 
                            onClick={() => setSelectedItem({ type: 'record', data: record })}
                            className="text-primary font-bold hover:underline"
                          >
                            详情
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'alarms' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredAlarms.length === 0 ? (
                <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">未找到匹配的故障报警</div>
              ) : (
                filteredAlarms.map(alarm => (
                  <div key={alarm.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-rose-100 transition-all">
                    <div className={`w-2 h-16 rounded-full ${getLevelColor(alarm.level)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${getLevelColor(alarm.level)}`}>
                          {alarm.level === 'critical' ? '紧急' : alarm.level === 'high' ? '高危' : '中等'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{alarm.deviceName} - {alarm.description}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alarm.facilityName}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alarm.time}</span>
                        <span className="flex items-center gap-1"><Settings className="w-3 h-3" /> {alarm.type === 'sensor' ? '传感器故障' : '机械故障'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${getStatusColor(alarm.status)}`}>
                        {alarm.status === 'unhandled' ? '未处理' : alarm.status === 'handling' ? '处理中' : '已解决'}
                      </span>
                      <button 
                        onClick={() => setSelectedItem({ type: 'alarm', data: alarm })}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 新增计划弹窗 */}
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
                <h3 className="text-2xl font-bold text-slate-900 mb-6">新增维保计划</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">设备名称</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" placeholder="请输入设备名称" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">所属设施</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm">
                      {facilities.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">维保周期</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm">
                        <option value="daily">每日</option>
                        <option value="weekly">每周</option>
                        <option value="monthly">每月</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">下次维保时间</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" />
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
                    确认创建
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
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
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedItem.type === 'plan' ? '维保计划详情' : selectedItem.type === 'record' ? '维保记录详情' : '故障报警详情'}
                  </h3>
                  <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {selectedItem.type === 'plan' && (
                    <>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                        <div className="p-3 rounded-xl bg-white text-primary shadow-sm"><Settings className="w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{selectedItem.data.deviceName}</p>
                          <p className="text-xs text-slate-400">{selectedItem.data.facilityName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">维保周期</p>
                          <p className="font-bold text-slate-900">{selectedItem.data.cycle === 'daily' ? '每日' : '定期'}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">下次维保</p>
                          <p className="font-bold text-rose-500">{selectedItem.data.nextTime}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'record' && (
                    <>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                        <div className="p-3 rounded-xl bg-white text-primary shadow-sm"><History className="w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{selectedItem.data.facilityName}</p>
                          <p className="text-xs text-slate-400">单号: {selectedItem.data.id}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-400 text-sm">维保人员</span>
                          <span className="font-bold text-slate-900 text-sm">{selectedItem.data.staff}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-400 text-sm">维保日期</span>
                          <span className="font-bold text-slate-900 text-sm">{selectedItem.data.date}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400 text-sm">维保结果</span>
                          <span className="font-bold text-emerald-500 text-sm">成功</span>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'alarm' && (
                    <>
                      <div className={`p-4 rounded-2xl ${getLevelColor(selectedItem.data.level)} text-white`}>
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-bold uppercase tracking-widest text-[10px]">
                            {selectedItem.data.level === 'critical' ? '紧急故障' : '一般故障'}
                          </span>
                        </div>
                        <p className="text-lg font-bold">{selectedItem.data.deviceName}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">故障描述</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{selectedItem.data.description}</p>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500">{selectedItem.data.time}</span>
                        </div>
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                          立即处理
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenanceManagement;
