import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Truck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/common/Modal';

interface CollectionPlan {
  id: string;
  name: string;
  points: string[];
  vehicle: string;
  timeSlot: string;
  status: 'active' | 'inactive';
}

const CollectionPlanTab: React.FC = () => {
  const [plans, setPlans] = useState<CollectionPlan[]>([
    { id: 'P001', name: '浦东新区厨余垃圾早班收运', points: ['世纪大道收集点', '陆家嘴收集点', '张江高科收集点'], vehicle: '沪A12345', timeSlot: '06:00 - 10:00', status: 'active' },
    { id: 'P002', name: '徐汇区其他垃圾晚班收运', points: ['徐家汇收集点', '漕河泾收集点'], vehicle: '沪A67890', timeSlot: '18:00 - 22:00', status: 'active' },
    { id: 'P003', name: '静安区可回收物周三收运', points: ['静安寺收集点', '南京西路收集点'], vehicle: '沪B11223', timeSlot: '09:00 - 17:00', status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CollectionPlan | null>(null);

  const handleAdd = () => {
    setCurrentPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: CollectionPlan) => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    toast.success('计划已删除');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(currentPlan ? '计划修改成功' : '新增计划成功');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索计划名称或车辆..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
            查询
          </button>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> 新增收运计划
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <span className="text-xs font-mono text-slate-400">{plan.id}</span>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {plan.status === 'active' ? '执行中' : '已停用'}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-600">
                  <span className="font-bold text-slate-700">收集点路线:</span>
                  <p className="mt-1 text-xs leading-relaxed">
                    {plan.points.join(' → ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600"><span className="font-bold text-slate-700">绑定车辆:</span> {plan.vehicle}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600"><span className="font-bold text-slate-700">收运时段:</span> {plan.timeSlot}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleEdit(plan)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                title="编辑"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(plan.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPlan ? '编辑收运计划' : '新增收运计划'}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              保存计划
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">计划名称</label>
            <input 
              type="text" 
              defaultValue={currentPlan?.name}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="例如：浦东新区厨余垃圾早班收运"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">收集点路线 (逗号分隔)</label>
            <textarea 
              defaultValue={currentPlan?.points.join(', ')}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
              placeholder="例如：世纪大道收集点, 陆家嘴收集点"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">绑定车辆</label>
              <input 
                type="text" 
                defaultValue={currentPlan?.vehicle}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="车牌号"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">收运时段</label>
              <input 
                type="text" 
                defaultValue={currentPlan?.timeSlot}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="例如：06:00 - 10:00"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">状态</label>
            <select 
              defaultValue={currentPlan?.status || 'active'}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="active">执行中</option>
              <option value="inactive">已停用</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollectionPlanTab;
