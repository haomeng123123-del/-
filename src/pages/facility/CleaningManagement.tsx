import React, { useEffect, useState } from 'react';
import { queryCleaningAttendance, queryCleaningShifts, queryCleaningStaff } from '../../api/services/facility';
import { CleaningAttendance, CleaningShift, CleaningStaff } from '../../types/facility';
import { Users, Clock, Calendar, Search, Filter, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CleaningManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'shifts' | 'staff'>('attendance');
  const [attendance, setAttendance] = useState<CleaningAttendance[]>([]);
  const [shifts, setShifts] = useState<CleaningShift[]>([]);
  const [staff, setStaff] = useState<CleaningStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attRes, shiftRes, staffRes] = await Promise.all([
          queryCleaningAttendance({ pageNo: 1, pageSize: 10 }),
          queryCleaningShifts(),
          queryCleaningStaff()
        ]);
        setAttendance(attRes.data.list);
        setShifts(shiftRes.data);
        setStaff(staffRes.data);
      } catch (error) {
        console.error('Failed to fetch cleaning data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('全部状态');
  const [staffSearch, setStaffSearch] = useState('');

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.staffName.includes(attendanceSearch);
    const matchesStatus = attendanceStatus === '全部状态' || 
      (attendanceStatus === '正常' && record.status === 'normal') ||
      (attendanceStatus === '缺勤' && record.status === 'absent') ||
      (attendanceStatus === '异常' && record.status === 'exception');
    return matchesSearch && matchesStatus;
  });

  const filteredStaff = staff.filter(person => {
    return person.name.includes(staffSearch) || person.phone.includes(staffSearch);
  });

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex gap-1">
          {[
            { id: 'attendance', label: '考勤统计', icon: Calendar },
            { id: 'shifts', label: '排班设置', icon: Clock },
            { id: 'staff', label: '人员管理', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pr-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            <Plus className="w-4 h-4" /> 新增{activeTab === 'attendance' ? '记录' : activeTab === 'shifts' ? '班次' : '人员'}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">加载中...</div>
        ) : (
          <>
            {activeTab === 'attendance' && (
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="搜索人员姓名..." 
                      value={attendanceSearch}
                      onChange={(e) => setAttendanceSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" 
                    />
                  </div>
                  <input type="date" className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2" />
                  <select 
                    value={attendanceStatus}
                    onChange={(e) => setAttendanceStatus(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2"
                  >
                    <option value="全部状态">全部状态</option>
                    <option value="正常">正常</option>
                    <option value="缺勤">缺勤</option>
                    <option value="异常">异常</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-4 px-2">考勤日期</th>
                        <th className="pb-4 px-2">人员姓名</th>
                        <th className="pb-4 px-2">所属公厕</th>
                        <th className="pb-4 px-2">班次</th>
                        <th className="pb-4 px-2">签到时间</th>
                        <th className="pb-4 px-2">签退时间</th>
                        <th className="pb-4 px-2">状态</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {filteredAttendance.map((record) => (
                        <tr 
                          key={record.recordId} 
                          onClick={() => setSelectedItem({ type: 'attendance', data: record })}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-2 text-slate-500">{record.date}</td>
                          <td className="py-4 px-2 font-bold text-slate-900">{record.staffName}</td>
                          <td className="py-4 px-2 text-slate-600">{record.toiletName}</td>
                          <td className="py-4 px-2 text-slate-600">{record.shift}</td>
                          <td className="py-4 px-2 text-slate-500 font-mono">{record.clockInTime}</td>
                          <td className="py-4 px-2 text-slate-500 font-mono">{record.clockOutTime}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              record.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                              record.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {record.status === 'normal' ? '正常' : record.status === 'absent' ? '缺勤' : '异常'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'shifts' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shifts.map(shift => (
                  <div 
                    key={shift.shiftId} 
                    onClick={() => setSelectedItem({ type: 'shift', data: shift })}
                    className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-primary shadow-sm"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-red-500 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{shift.shiftName}</h4>
                    <p className="text-sm text-primary font-bold mb-4">{shift.startTime} - {shift.endTime}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Users className="w-3 h-3" /> 班次人数: <span className="font-bold text-slate-900">{shift.staffCount}人</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{shift.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="搜索姓名、电话..." 
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {filteredStaff.map(person => (
                    <div 
                      key={person.staffId} 
                      onClick={() => setSelectedItem({ type: 'staff', data: person })}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        person.gender === '男' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {person.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-slate-900">{person.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            person.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {person.status === 'active' ? '在岗' : '请假'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{person.group} | {person.age}岁</p>
                        <p className="text-xs text-slate-500 font-mono">{person.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 新增弹窗 */}
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
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  新增{activeTab === 'attendance' ? '考勤记录' : activeTab === 'shifts' ? '排班' : '保洁人员'}
                </h3>
                <div className="space-y-4">
                  {activeTab === 'staff' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">姓名</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" placeholder="请输入姓名" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">手机号</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" placeholder="请输入手机号" />
                      </div>
                    </>
                  ) : activeTab === 'shifts' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">班次名称</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" placeholder="如：早班" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">开始时间</label>
                          <input type="time" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">结束时间</label>
                          <input type="time" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">人员</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm">
                          {staff.map(s => <option key={s.staffId}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">打卡状态</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm">
                          <option>正常</option>
                          <option>迟到</option>
                          <option>早退</option>
                        </select>
                      </div>
                    </>
                  )}
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
                    确认提交
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
                  <h3 className="text-2xl font-bold text-slate-900">详情信息</h3>
                  <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {selectedItem.type === 'staff' && (
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 ${
                        selectedItem.data.gender === '男' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {selectedItem.data.name[0]}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">{selectedItem.data.name}</h4>
                      <p className="text-sm text-slate-400 mb-6">{selectedItem.data.group} | {selectedItem.data.age}岁</p>
                      <div className="w-full grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">联系电话</p>
                          <p className="font-bold text-slate-900">{selectedItem.data.phone}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">当前状态</p>
                          <p className="font-bold text-emerald-500">在岗</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedItem.type === 'shift' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                        <div className="p-3 rounded-xl bg-white text-primary shadow-sm"><Clock className="w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{selectedItem.data.shiftName}</p>
                          <p className="text-xs text-primary font-bold">{selectedItem.data.startTime} - {selectedItem.data.endTime}</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">班次说明</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedItem.data.description}</p>
                      </div>
                    </div>
                  )}
                  {selectedItem.type === 'attendance' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                        <div className="p-3 rounded-xl bg-white text-primary shadow-sm"><Calendar className="w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{selectedItem.data.staffName}</p>
                          <p className="text-xs text-slate-400">{selectedItem.data.date} | {selectedItem.data.shift}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">签到时间</p>
                          <p className="font-bold text-slate-900">{selectedItem.data.clockInTime}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">签退时间</p>
                          <p className="font-bold text-slate-900">{selectedItem.data.clockOutTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    确定
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

export default CleaningManagement;
