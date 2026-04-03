import React, { useState } from 'react';
import { Search, Plus, Calendar, Clock, Edit, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollectionPlans: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([
    { id: 'PLN-202310-001', name: '静安寺商圈早班收运', route: '静安寺-01线', vehicle: '沪A·A1234', driver: '张师傅', time: '05:00 - 08:00', status: 'active', frequency: '每日' },
    { id: 'PLN-202310-002', name: '南京西路夜间清运', route: '南京西路-核心段', vehicle: '沪A·B5678', driver: '李师傅', time: '22:00 - 02:00', status: 'active', frequency: '每日' },
    { id: 'PLN-202310-003', name: '延安中路绿化带清理', route: '延安中路-绿地', vehicle: '沪A·C9012', driver: '王师傅', time: '09:00 - 11:30', status: 'paused', frequency: '每周一、三、五' },
    { id: 'PLN-202310-004', name: '静安寺商圈午后收运', route: '静安寺-01线', vehicle: '沪A·D3456', driver: '赵师傅', time: '13:00 - 15:00', status: 'active', frequency: '每日' },
    { id: 'PLN-202310-005', name: '大型活动临时保障', route: '临时路线-01', vehicle: '沪A·E7890', driver: '孙师傅', time: '08:00 - 18:00', status: 'draft', frequency: '单次' },
  ]);

  const filteredPlans = plans.filter(p => p.name.includes(search) || p.route.includes(search));

  const handleAdd = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该收运计划吗？')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运计划管理</h1>
          <p className="text-slate-500 mt-1">制定与管理垃圾收运的周期性计划</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索计划名称或路线..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="collection-plans-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button 
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 font-bold text-sm"
            data-testid="collection-plans-btn-add"
          >
            <Plus className="w-4 h-4" />
            新建计划
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="collection-plans-table-list">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-sm">计划编号</th>
                <th className="p-4 font-bold text-slate-500 text-sm">计划名称</th>
                <th className="p-4 font-bold text-slate-500 text-sm">关联路线</th>
                <th className="p-4 font-bold text-slate-500 text-sm">执行车辆/人员</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业时间</th>
                <th className="p-4 font-bold text-slate-500 text-sm">执行频率</th>
                <th className="p-4 font-bold text-slate-500 text-sm">状态</th>
                <th className="p-4 font-bold text-slate-500 text-sm text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{plan.id}</td>
                  <td className="p-4 font-bold text-slate-900">{plan.name}</td>
                  <td 
                    className="p-4 text-blue-600 text-sm cursor-pointer hover:underline"
                    onClick={() => navigate('/vehicles/collection-routes')}
                  >
                    {plan.route}
                  </td>
                  <td className="p-4">
                    <div 
                      className="text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate('/vehicles/info')}
                    >
                      {plan.vehicle}
                    </div>
                    <div 
                      className="text-xs text-slate-500 cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => navigate('/personnel/info')}
                    >
                      {plan.driver}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {plan.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {plan.frequency}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-fit ${
                      plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      plan.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {plan.status === 'active' && <CheckCircle className="w-3 h-3" />}
                      {plan.status === 'paused' && <AlertCircle className="w-3 h-3" />}
                      {plan.status === 'active' ? '执行中' : plan.status === 'paused' ? '已暂停' : '草稿'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="编辑"
                        data-testid={`collection-plans-btn-edit-${plan.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="删除"
                        data-testid={`collection-plans-btn-delete-${plan.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">没有找到匹配的计划</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">{editingPlan ? '编辑收运计划' : '新建收运计划'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">计划名称</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="请输入计划名称"
                    defaultValue={editingPlan?.name}
                    data-testid="collection-plans-modal-input-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">关联路线</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingPlan?.route}
                    data-testid="collection-plans-modal-select-route"
                  >
                    <option value="">请选择收运路线</option>
                    <option value="静安寺-01线">静安寺-01线</option>
                    <option value="南京西路-核心段">南京西路-核心段</option>
                    <option value="延安中路-绿地">延安中路-绿地</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">执行车辆</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingPlan?.vehicle}
                    data-testid="collection-plans-modal-select-vehicle"
                  >
                    <option value="">请选择车辆</option>
                    <option value="沪A·A1234">沪A·A1234</option>
                    <option value="沪A·B5678">沪A·B5678</option>
                    <option value="沪A·C9012">沪A·C9012</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">执行人员</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingPlan?.driver}
                    data-testid="collection-plans-modal-select-driver"
                  >
                    <option value="">请选择人员</option>
                    <option value="张师傅">张师傅</option>
                    <option value="李师傅">李师傅</option>
                    <option value="王师傅">王师傅</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">作业时间段</label>
                  <div className="flex items-center gap-2">
                    <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                    <span className="text-slate-400">-</span>
                    <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">执行频率</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingPlan?.frequency || '每日'}
                    data-testid="collection-plans-modal-select-frequency"
                  >
                    <option value="每日">每日</option>
                    <option value="每周一、三、五">每周一、三、五</option>
                    <option value="每周二、四、六">每周二、四、六</option>
                    <option value="单次">单次</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">计划状态</label>
                <div className="flex gap-4">
                  {['active', 'paused', 'draft'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value={s} 
                        defaultChecked={editingPlan?.status === s || (s === 'active' && !editingPlan)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600">
                        {s === 'active' ? '执行中' : s === 'paused' ? '已暂停' : '草稿'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-colors"
                  data-testid="collection-plans-modal-btn-submit"
                >
                  保存计划
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPlans;
