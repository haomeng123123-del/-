import React, { useEffect, useState } from 'react';
import { queryCollectionPlans } from '../../../api/services/collection';
import { CollectionPlan } from '../../../types/collection';
import { Calendar, Search, Plus, MoreVertical, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

const CollectionPlans: React.FC = () => {
  const [plans, setPlans] = useState<CollectionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryCollectionPlans({ pageNo: 1, pageSize: 10 }).then(res => {
      if (res.code === 0) setPlans(res.data.list);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 执行中</span>;
      case 'draft': return <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg flex items-center gap-1"><FileText className="w-3 h-3" /> 草稿</span>;
      case 'expired': return <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg flex items-center gap-1"><Clock className="w-3 h-3" /> 已过期</span>;
      default: return null;
    }
  };

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">收运计划管理</h1>
          <p className="text-slate-500 mt-1">制定与管理生活垃圾收运作业计划</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>新建计划</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.planId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              {getStatusBadge(plan.status)}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{plan.planName}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">计划类型</span>
                <span className="font-bold text-slate-700">{plan.type === 'daily' ? '日常收运' : '专项保障'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">生效时间</span>
                <span className="font-bold text-slate-700">{plan.startTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">包含路线</span>
                <span className="font-bold text-primary">{plan.assignedRoutes.length} 条</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {plan.creator[0]}
                </div>
                <span className="text-xs text-slate-500">{plan.creator}</span>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold">计划执行明细</h3>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="搜索计划名称..."
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">计划编号</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">计划名称</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plans.map((plan) => (
                <tr key={plan.planId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{plan.planId}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{plan.planName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{plan.createdAt}</td>
                  <td className="px-6 py-4">{getStatusBadge(plan.status)}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary text-sm font-bold hover:underline">查看详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollectionPlans;
