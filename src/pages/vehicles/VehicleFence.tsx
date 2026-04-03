import React, { useEffect, useState } from 'react';
import { Search, Plus, Map, Edit, Trash2, X } from 'lucide-react';
import { queryElectronicFences } from '../../api/services/sanitation';
import { ElectronicFence } from '../../types/sanitation';

const VehicleFencePage: React.FC = () => {
  const [fences, setFences] = useState<ElectronicFence[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFence, setEditingFence] = useState<ElectronicFence | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryElectronicFences({ pageNo: 1, pageSize: 50, name: search });
      setFences(res.data.list);
    } catch (error) {
      console.error('Failed to fetch electronic fences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleAdd = () => {
    setEditingFence(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fence: ElectronicFence) => {
    setEditingFence(fence);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该围栏吗？')) {
      setFences(fences.filter(f => f.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">电子围栏管理</h1>
          <p className="text-slate-500 mt-1">设置车辆作业区域与禁行区域</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索围栏名称..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-fence-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button 
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 font-bold text-sm"
            data-testid="vehicle-fence-btn-add"
          >
            <Plus className="w-4 h-4" />
            新增围栏
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Fence List */}
        <div className="w-96 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <span className="text-sm font-bold text-slate-500">围栏列表 ({fences.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-slate-400">加载中...</div>
            ) : fences.length === 0 ? (
              <div className="p-8 text-center text-slate-400">暂无数据</div>
            ) : (
              fences.map((f) => (
                <div key={f.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.status === '启用' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      f.type === '禁行区' ? 'bg-red-50 text-red-600' :
                      f.type === '限速区' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {f.type}
                    </span>
                    <span className="text-xs text-slate-500 truncate">{f.description}</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(f); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      data-testid={`vehicle-fence-btn-edit-${f.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      data-testid={`vehicle-fence-btn-delete-${f.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
             <svg width="100%" height="100%" viewBox="0 0 800 600" className="opacity-40">
                <path d="M0 100 L800 100 M0 300 L800 300 M0 500 L800 500 M100 0 L100 600 M300 0 L300 600 M500 0 L500 600 M700 0 L700 600" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                <polygon points="200,200 400,100 500,300 300,400" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                <polygon points="500,400 700,300 750,500 550,600" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
             </svg>
             <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-3 h-3 bg-red-500/20 border border-red-500"></div>
                 禁行区
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-3 h-3 bg-blue-500/20 border border-blue-500"></div>
                 作业区
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-3 h-3 bg-amber-500/20 border border-amber-500"></div>
                 限速区
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">{editingFence ? '编辑围栏' : '新增围栏'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">围栏名称</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入围栏名称"
                  defaultValue={editingFence?.name}
                  data-testid="vehicle-fence-modal-input-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">围栏类型</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingFence?.type || '作业区'}
                    data-testid="vehicle-fence-modal-select-type"
                  >
                    <option value="作业区">作业区</option>
                    <option value="禁行区">禁行区</option>
                    <option value="限速区">限速区</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">状态</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingFence?.status || '启用'}
                    data-testid="vehicle-fence-modal-select-status"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">描述</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 h-24"
                  placeholder="请输入围栏描述"
                  defaultValue={editingFence?.description}
                  data-testid="vehicle-fence-modal-input-desc"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                <Map className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-xs text-blue-700 leading-relaxed">
                  <p className="font-bold mb-1">提示：</p>
                  <p>保存后请在地图上通过绘制工具定义围栏的具体地理范围。目前仅支持多边形围栏。</p>
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
                  data-testid="vehicle-fence-modal-btn-submit"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleFencePage;
