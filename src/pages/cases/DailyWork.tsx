import React, { useState, useEffect } from 'react';
import { Users, Calendar, Map, AlertTriangle, Search, Plus, Edit, Trash2, MapPin, Clock, X } from 'lucide-react';
import { 
  queryInspectors, querySchedules, queryPatrols, queryWarnings,
  addInspector, updateInspector, deleteInspector,
  addSchedule, updateSchedule, deleteSchedule,
  addPatrol, updatePatrol, deletePatrol,
  updateWarning, deleteWarning
} from '../../api/services/cases';
import { Inspector, Schedule, Patrol, Warning } from '../../types/cases';
import { toast } from 'sonner';

const DailyWork: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inspectors');
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inspectors') {
        const res = await queryInspectors(searchKeyword);
        setInspectors(res.data.list);
      } else if (activeTab === 'scheduling') {
        const res = await querySchedules(searchKeyword);
        setSchedules(res.data.list);
      } else if (activeTab === 'patrol') {
        const res = await queryPatrols(searchKeyword);
        setPatrols(res.data.list);
      } else if (activeTab === 'warning') {
        const res = await queryWarnings(searchKeyword);
        setWarnings(res.data.list);
      }
    } catch (error) {
      toast.error('获取数据失败');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, searchKeyword]);

  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'inspectors') await deleteInspector(id);
      if (activeTab === 'scheduling') await deleteSchedule(id);
      if (activeTab === 'patrol') await deletePatrol(id);
      if (activeTab === 'warning') await deleteWarning(id);
      toast.success('删除成功');
      fetchData();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (activeTab === 'inspectors') {
        if (modalType === 'add') await addInspector(data);
        else await updateInspector({ ...selectedItem, ...data });
      } else if (activeTab === 'scheduling') {
        if (modalType === 'add') await addSchedule(data);
        else await updateSchedule({ ...selectedItem, ...data });
      } else if (activeTab === 'patrol') {
        if (modalType === 'add') await addPatrol(data);
        else await updatePatrol({ ...selectedItem, ...data });
      } else if (activeTab === 'warning') {
        await updateWarning({ ...selectedItem, ...data, status: 'handled' });
      }
      
      setIsModalOpen(false);
      toast.success('保存成功');
      fetchData();
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const tabs = [
    { id: 'inspectors', label: '巡查人员管理', icon: Users },
    { id: 'scheduling', label: '日常工作排班', icon: Calendar },
    { id: 'patrol', label: '巡更管理', icon: Map },
    { id: 'warning', label: '预警管理', icon: AlertTriangle },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-slate-500">加载中...</div>;
    }

    switch (activeTab) {
      case 'inspectors':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">人员编号</th>
                <th className="pb-3 font-medium">姓名</th>
                <th className="pb-3 font-medium">联系电话</th>
                <th className="pb-3 font-medium">负责网格</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">最后活跃时间</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {inspectors.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="py-4 text-sm text-slate-600">{item.phone}</td>
                  <td className="py-4 text-sm text-slate-600">{item.area}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status === 'online' ? '在线' : '离线'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{item.lastActive}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'scheduling':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">排班编号</th>
                <th className="pb-3 font-medium">日期</th>
                <th className="pb-3 font-medium">班次</th>
                <th className="pb-3 font-medium">巡查员</th>
                <th className="pb-3 font-medium">负责网格</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-medium text-slate-800">{item.date}</td>
                  <td className="py-4 text-sm text-slate-600">{item.shift}</td>
                  <td className="py-4 text-sm font-bold text-slate-700">{item.inspector}</td>
                  <td className="py-4 text-sm text-slate-600">{item.area}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {item.status === 'active' ? '执行中' : '待执行'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'patrol':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">巡更编号</th>
                <th className="pb-3 font-medium">路线名称</th>
                <th className="pb-3 font-medium">巡查员</th>
                <th className="pb-3 font-medium">进度</th>
                <th className="pb-3 font-medium">开始时间</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {patrols.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.route}</td>
                  <td className="py-4 text-sm text-slate-600">{item.inspector}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{item.startTime}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {item.status === 'in_progress' ? '巡查中' : '已完成'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><MapPin className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'warning':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">预警编号</th>
                <th className="pb-3 font-medium">预警类型</th>
                <th className="pb-3 font-medium">关联人员</th>
                <th className="pb-3 font-medium">发生时间</th>
                <th className="pb-3 font-medium">预警等级</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.type}</td>
                  <td className="py-4 text-sm text-slate-600">{item.inspector}</td>
                  <td className="py-4 text-sm text-slate-500">{item.time}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.level === 'high' ? 'bg-error/10 text-error' : 'bg-orange-50 text-orange-600'}`}>
                      {item.level === 'high' ? '高风险' : '中风险'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'unhandled' ? 'bg-error/10 text-error' : 'bg-emerald-50 text-emerald-600'}`}>
                      {item.status === 'unhandled' ? '未处理' : '已处理'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {item.status === 'unhandled' && (
                        <button onClick={() => handleEdit(item)} className="text-xs font-bold text-primary hover:text-primary-container transition-colors">处理</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar */}
      <div className="w-48 bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 border border-slate-100 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={`搜索${tabs.find(t => t.id === activeTab)?.label}...`} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {activeTab === 'inspectors' ? '新增人员' : 
             activeTab === 'scheduling' ? '新增排班' : 
             activeTab === 'patrol' ? '新增路线' : '预警设置'}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {modalType === 'add' ? '新增' : '编辑'}
                {activeTab === 'inspectors' ? '人员' : 
                 activeTab === 'scheduling' ? '排班' : 
                 activeTab === 'patrol' ? '路线' : '预警'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                {activeTab === 'inspectors' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">姓名</label>
                      <input name="name" required type="text" defaultValue={selectedItem?.name || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">联系电话</label>
                      <input name="phone" required type="text" defaultValue={selectedItem?.phone || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">负责网格</label>
                      <input name="area" required type="text" defaultValue={selectedItem?.area || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </>
                )}
                {activeTab === 'scheduling' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">日期</label>
                      <input name="date" required type="date" defaultValue={selectedItem?.date || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">班次</label>
                      <select name="shift" required defaultValue={selectedItem?.shift || '早班 (08:00-16:00)'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>早班 (08:00-16:00)</option>
                        <option>中班 (16:00-00:00)</option>
                        <option>晚班 (00:00-08:00)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">巡查员</label>
                      <input name="inspector" required type="text" defaultValue={selectedItem?.inspector || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">负责网格</label>
                      <input name="area" required type="text" defaultValue={selectedItem?.area || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </>
                )}
                {activeTab === 'patrol' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">路线名称</label>
                      <input name="route" required type="text" defaultValue={selectedItem?.route || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">巡查员</label>
                      <input name="inspector" required type="text" defaultValue={selectedItem?.inspector || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </>
                )}
                {activeTab === 'warning' && (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-sm text-orange-800">确定已处理该预警信息吗？</p>
                    <p className="text-xs text-orange-600 mt-1">预警编号: {selectedItem?.id}</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-sm">
                  {activeTab === 'warning' ? '确认处理' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyWork;
