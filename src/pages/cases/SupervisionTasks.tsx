import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckSquare, Search, Plus, Edit, Trash2, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  querySupervisionTasks,
  addSupervisionTask,
  updateSupervisionTask,
  deleteSupervisionTask
} from '../../api/services/cases';
import { SupervisionTask } from '../../types/cases';

const SupervisionTasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dispatch');
  const [tasks, setTasks] = useState<SupervisionTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'feedback' | 'review'>('add');
  const [selectedItem, setSelectedItem] = useState<SupervisionTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await querySupervisionTasks({ type: activeTab, keyword: searchQuery });
      setTasks(res.data.list);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, searchQuery]);

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

  const handleFeedback = (item: any) => {
    setModalType('feedback');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleReview = (item: any) => {
    setModalType('review');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    toast.promise(deleteSupervisionTask(id), {
      loading: '正在删除...',
      success: () => {
        fetchData();
        return '删除成功';
      },
      error: '删除失败'
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    let action;
    if (modalType === 'add') {
      action = addSupervisionTask({ ...data, status: 'dispatched', priority: (data.priority as any) || 'medium' });
    } else if (modalType === 'edit') {
      action = updateSupervisionTask({ ...selectedItem, ...data });
    } else if (modalType === 'feedback') {
      action = updateSupervisionTask({ 
        ...selectedItem, 
        ...data, 
        status: 'feedback_submitted',
        submitTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      });
    } else if (modalType === 'review') {
      // Review action is handled by specific buttons in the form or separate handlers
      return;
    }

    if (action) {
      toast.promise(action, {
        loading: '正在保存...',
        success: () => {
          setIsModalOpen(false);
          fetchData();
          return '操作成功';
        },
        error: '操作失败'
      });
    }
  };

  const handleReviewAction = async (passed: boolean) => {
    if (!selectedItem) return;
    
    const action = updateSupervisionTask({
      ...selectedItem,
      status: passed ? 'reviewed_passed' : 'reviewed_rejected'
    });

    toast.promise(action, {
      loading: '正在提交审核...',
      success: () => {
        setIsModalOpen(false);
        fetchData();
        return passed ? '审核已通过' : '审核已驳回';
      },
      error: '审核操作失败'
    });
  };

  const tabs = [
    { id: 'dispatch', label: '任务下发', icon: Send },
    { id: 'feedback', label: '任务反馈', icon: MessageSquare },
    { id: 'review', label: '任务审核', icon: CheckSquare },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>正在加载任务数据...</p>
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>暂无相关任务数据</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dispatch':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">任务编号</th>
                <th className="pb-3 font-medium">任务名称</th>
                <th className="pb-3 font-medium">优先级</th>
                <th className="pb-3 font-medium">执行人</th>
                <th className="pb-3 font-medium">截止时间</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      item.priority === 'urgent' ? 'bg-error text-white' : 
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                      item.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.assignee}</td>
                  <td className="py-4 text-sm text-slate-500">{item.deadline}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'dispatched' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status === 'dispatched' ? '已下发' : '草稿'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'feedback':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">任务编号</th>
                <th className="pb-3 font-medium">任务名称</th>
                <th className="pb-3 font-medium">优先级</th>
                <th className="pb-3 font-medium">执行人</th>
                <th className="pb-3 font-medium">提交时间</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      item.priority === 'urgent' ? 'bg-error text-white' : 
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                      item.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.assignee}</td>
                  <td className="py-4 text-sm text-slate-500">{item.submitTime || '-'}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'feedback_submitted' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {item.status === 'feedback_submitted' ? '已反馈' : '待反馈'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                      {item.status === 'pending_feedback' && (
                        <button 
                          onClick={() => handleFeedback(item)} 
                          className="px-3 py-1 text-xs font-bold text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          填写反馈
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'review':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">任务编号</th>
                <th className="pb-3 font-medium">任务名称</th>
                <th className="pb-3 font-medium">优先级</th>
                <th className="pb-3 font-medium">执行人</th>
                <th className="pb-3 font-medium">提交时间</th>
                <th className="pb-3 font-medium">审核状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="py-4 text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      item.priority === 'urgent' ? 'bg-error text-white' : 
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                      item.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.assignee}</td>
                  <td className="py-4 text-sm text-slate-500">{item.submitTime}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      item.status === 'pending_review' ? 'bg-orange-50 text-orange-600' : 
                      item.status === 'reviewed_passed' ? 'bg-emerald-50 text-emerald-600' : 
                      'bg-error/10 text-error'
                    }`}>
                      {item.status === 'pending_review' ? '待审核' : item.status === 'reviewed_passed' ? '审核通过' : '审核驳回'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                      {item.status === 'pending_review' && (
                        <button 
                          onClick={() => handleReview(item)} 
                          className="px-3 py-1 text-xs font-bold text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          去审核
                        </button>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`搜索${tabs.find(t => t.id === activeTab)?.label}...`} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {activeTab === 'dispatch' && (
            <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建任务
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {modalType === 'add' ? '新增任务' : 
                 modalType === 'edit' ? '编辑任务' : 
                 modalType === 'feedback' ? '任务反馈' : '任务审核'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {modalType === 'review' ? (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">任务名称</p>
                      <p className="text-sm font-bold text-slate-800">{selectedItem?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">执行人</p>
                      <p className="text-sm font-bold text-slate-800">{selectedItem?.assignee}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">反馈内容</p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 italic">
                      "{selectedItem?.feedback || '暂无文字反馈'}"
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => handleReviewAction(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-bold transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                    驳回
                  </button>
                  <button 
                    onClick={() => handleReviewAction(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    通过
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="p-6 space-y-4">
                  {modalType === 'feedback' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">反馈内容</label>
                        <textarea 
                          name="feedback" 
                          required
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                          placeholder="请详细描述任务完成情况..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">相关图片 (可选)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-primary/40 transition-colors cursor-pointer">
                          <Plus className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                          <p className="text-xs text-slate-400">点击上传现场照片</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">任务名称</label>
                        <input name="name" type="text" required defaultValue={selectedItem?.name || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入任务名称" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">执行人</label>
                          <input name="assignee" type="text" required defaultValue={selectedItem?.assignee || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="执行人姓名" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">优先级</label>
                          <select name="priority" defaultValue={selectedItem?.priority || 'medium'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                            <option value="urgent">紧急</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">截止时间</label>
                        <input name="deadline" type="datetime-local" required defaultValue={selectedItem?.deadline?.replace(' ', 'T') || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">任务描述</label>
                        <textarea name="description" rows={3} defaultValue={selectedItem?.description || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入任务详细说明..." />
                      </div>
                    </>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                  <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-sm">
                    {modalType === 'feedback' ? '提交反馈' : '保存任务'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisionTasks;
