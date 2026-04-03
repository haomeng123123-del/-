import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database } from 'lucide-react';
import { queryFacilities, addFacility, updateFacility, deleteFacility } from '../../api/services/data';
import { Facility } from '../../types/data';

const FacilityManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<Facility | null>(null);
  const [searchName, setSearchName] = useState('');
  const [showWorkflow, setShowWorkflow] = useState(false);

  const facilityTypes = [
    { id: 'all', label: '全部设施' },
    { id: 'toilet', label: '环卫公厕' },
    { id: 'collection_point', label: '垃圾收集点' },
    { id: 'transfer_station', label: '垃圾转运站' },
    { id: 'rest_room', label: '环卫工作息房' },
    { id: 'disposal_site', label: '终端处置场' },
    { id: 'sorting_collection', label: '分类投放收集设施' },
    { id: 'sorting_treatment', label: '分类处理设施' },
  ];

  const workflowSteps = [
    { id: 'report', label: '数据上报', icon: Upload, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'audit', label: '数据审核', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'issue', label: '问题下发', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'rectify', label: '整改反馈', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'entry', label: '数据入库', icon: Database, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  const fetchData = async () => {
    if (showWorkflow) return;
    setLoading(true);
    try {
      const res = await queryFacilities({
        pageNo: 1,
        pageSize: 50,
        type: activeSubTab === 'all' ? undefined : activeSubTab as any,
        name: searchName || undefined,
      });
      setFacilities(res.data.list);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab, searchName, showWorkflow]);

  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Facility) => {
    setModalType('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除该设施信息吗？')) {
      try {
        await deleteFacility(id);
        alert('删除成功');
        fetchData();
      } catch (error) {
        alert('删除失败');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as any;
    
    try {
      if (modalType === 'add') {
        await addFacility({
          ...data,
          lastUpdate: new Date().toISOString().split('T')[0]
        });
      } else {
        await updateFacility({ 
          ...selectedItem, 
          ...data,
          lastUpdate: new Date().toISOString().split('T')[0]
        });
      }
      setIsModalOpen(false);
      alert('保存成功');
      fetchData();
    } catch (error) {
      alert('保存失败');
    }
  };

  const [selectedType, setSelectedType] = useState<string>('toilet');

  return (
    <div className="h-full flex flex-col gap-4">
      {showWorkflow ? (
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowWorkflow(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-slate-800">设施数据常态化更新</h2>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                本月已更新: 128
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
                待审核: 12
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 relative group hover:shadow-md transition-all cursor-pointer">
                <div className={`p-4 ${step.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">{step.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">待处理: {Math.floor(Math.random() * 10) + 2}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200 z-10" />
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-slate-800">更新任务列表</h3>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="px-3 py-1 text-[10px] font-bold bg-white text-primary rounded-md shadow-sm">全部</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">进行中</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">已完成</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-colors">新建更新任务</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">任务名称</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">关联设施</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">当前环节</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">发起人</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">更新时间</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: '南京西路公厕设施更新', facility: '南京西路128号公厕', step: '数据审核', user: '张三', time: '2026-03-30 14:00', status: 'warning' },
                    { name: '静安寺收集点设备更换', facility: '静安寺地铁站3号口收集点', step: '问题下发', user: '李四', time: '2026-03-30 15:30', status: 'info' },
                    { name: '徐汇转运站年度检修', facility: '徐汇区漕溪路转运站', step: '整改反馈', user: '王五', time: '2026-03-29 10:00', status: 'success' },
                    { name: '淮海中路果壳箱增设', facility: '淮海中路商业街', step: '数据上报', user: '赵六', time: '2026-03-28 16:45', status: 'info' },
                  ].map((task, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{task.name}</div>
                        <div className="text-[10px] text-slate-400">任务编号: TASK-2026-{1000 + i}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{task.facility}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                          task.step === '数据审核' ? 'bg-blue-50 text-blue-600' :
                          task.step === '问题下发' ? 'bg-orange-50 text-orange-600' :
                          task.step === '整改反馈' ? 'bg-purple-50 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>{task.step}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{task.user}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">{task.time}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-primary hover:underline">查看详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Sub-tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {facilityTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveSubTab(type.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeSubTab === type.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索设施名称、地址..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                <Filter className="w-4 h-4" />
                高级筛选
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowWorkflow(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Activity className="w-4 h-4" />
                更新流程
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Upload className="w-4 h-4" />
                批量导入
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                导出报表
              </button>
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
                <Plus className="w-4 h-4" />
                新增设施
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">设施名称</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">类型</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">详细地址</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">负责人/电话</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">最后更新</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold">加载中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : facilities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="w-12 h-12 text-slate-200" />
                          <span className="text-sm font-bold">暂无设施数据</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    facilities.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-800">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded font-medium">
                            {facilityTypes.find(t => t.id === item.type)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{item.address}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700 font-medium">{item.manager}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.contact}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                            item.status === 'maintenance' ? 'bg-orange-50 text-orange-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {item.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : 
                             item.status === 'maintenance' ? <Clock className="w-3 h-3" /> : 
                             <AlertCircle className="w-3 h-3" />}
                            {item.status === 'active' ? '正常运行' : item.status === 'maintenance' ? '维护中' : '已停用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.lastUpdate}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="编辑">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors" title="删除">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">{modalType === 'add' ? '新增设施' : '编辑设施'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">设施名称</label>
                    <input name="name" type="text" required defaultValue={selectedItem?.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="请输入设施名称" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">设施类型</label>
                    <select 
                      name="type" 
                      required 
                      defaultValue={selectedItem?.type || (activeSubTab === 'all' ? 'toilet' : activeSubTab)} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      {facilityTypes.filter(t => t.id !== 'all').map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">运行状态</label>
                    <select name="status" required defaultValue={selectedItem?.status || 'active'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="active">正常运行</option>
                      <option value="maintenance">维护中</option>
                      <option value="inactive">已停用</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">详细地址</label>
                    <input name="address" type="text" required defaultValue={selectedItem?.address} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="请输入详细地址" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">负责人</label>
                    <input name="manager" type="text" required defaultValue={selectedItem?.manager} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="负责人姓名" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">联系电话</label>
                    <input name="contact" type="text" required defaultValue={selectedItem?.contact} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="联系电话" />
                  </div>

                  {/* Dynamic fields based on type */}
                  <div className="col-span-2 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      设施详细参数
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedType === 'toilet' && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">厕位数量</label>
                            <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="如: 10" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">是否包含第三卫生间</label>
                            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                              <option>是</option>
                              <option>否</option>
                            </select>
                          </div>
                        </>
                      )}
                      {selectedType === 'transfer_station' && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">设计处理能力 (吨/日)</label>
                            <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="如: 50" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">压缩设备数量</label>
                            <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="如: 2" />
                          </div>
                        </>
                      )}
                      {(selectedType === 'collection_point' || selectedType === 'sorting_collection') && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">容器容量 (L)</label>
                            <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="如: 240" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">清运频率 (次/日)</label>
                            <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="如: 2" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">取消</button>
                <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition-colors shadow-lg shadow-primary/20">保存信息</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityManagement;
