import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Users, Truck, Building2, Map, Briefcase, Activity, ChevronRight, Database, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';
import { queryDepartments, queryBidSections, queryEnterprises, queryVehicles, queryPersonnel, addResource, updateResource, deleteResource } from '../../api/services/data';

const ResourceManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('department');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  const resourceTypes = [
    { id: 'department', label: '环卫部门', icon: Building2 },
    { id: 'bid_section', label: '环卫标段', icon: Map },
    { id: 'enterprise', label: '环卫企业', icon: Briefcase },
    { id: 'vehicle', label: '车辆基础信息', icon: Truck },
    { id: 'personnel', label: '环卫人员信息', icon: Users },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

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
      let res: any;
      switch (activeSubTab) {
        case 'department': res = await queryDepartments(); break;
        case 'bid_section': res = await queryBidSections(); break;
        case 'enterprise': res = await queryEnterprises(); break;
        case 'vehicle': res = await queryVehicles({ pageNo: 1, pageSize: 50 }); break;
        case 'personnel': res = await queryPersonnel({ pageNo: 1, pageSize: 50 }); break;
      }
      const list = res.data.list || res.data;
      // Filter by search name if applicable
      if (searchName) {
        setData(list.filter((item: any) => 
          (item.name && item.name.includes(searchName)) || 
          (item.plateNo && item.plateNo.includes(searchName))
        ));
      } else {
        setData(list);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab, showWorkflow, searchName]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as any;
    
    try {
      if (modalType === 'add') {
        await addResource(activeSubTab, {
          ...data,
          id: `RES-${Date.now()}`,
          lastUpdate: new Date().toISOString().split('T')[0]
        });
        alert('新增成功');
      } else if (selectedItem) {
        await updateResource(activeSubTab, { 
          ...selectedItem, 
          ...data,
          lastUpdate: new Date().toISOString().split('T')[0]
        });
        alert('保存成功');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除该资源吗？')) return;
    try {
      await deleteResource(activeSubTab, id);
      alert('删除成功');
      fetchData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleTaskDetail = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {showWorkflow ? (
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowWorkflow(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-slate-800">资源数据常态化更新</h2>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                <Clock className="w-3 h-3" />
                平均处理时效: 4.2h
              </div>
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
                  <p className="text-[10px] text-slate-400 mt-1">待处理: {Math.floor(Math.random() * 10) + 3}</p>
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
                  <button className="px-3 py-1 text-[10px] font-bold bg-white text-primary rounded-md shadow-sm">全部任务</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">我发起的</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">待我审批</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-colors">新建更新流程</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">任务名称</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">当前环节</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">发起人</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">更新时间</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'T001', name: '2026年第一季度人员信息核对', step: '数据审核', user: '张三', time: '2026-03-30 14:00', type: 'personnel', status: 'processing', desc: '对全市25名环卫人员的基础信息进行年度核对。' },
                    { id: 'T002', name: '车辆报废及新增入库申请', step: '问题下发', user: '李四', time: '2026-03-30 15:30', type: 'vehicle', status: 'warning', desc: '申请报废3辆老旧洒水车，并新增5辆压缩式垃圾车入库。' },
                    { id: 'T003', name: '环卫企业资质年度审查', step: '整改反馈', user: '王五', time: '2026-03-29 10:00', type: 'enterprise', status: 'pending', desc: '对入驻的4家环卫企业进行年度资质、安全生产等方面的审查。' },
                    { id: 'T004', name: '标段作业面积重新测绘', step: '数据入库', user: '赵六', time: '2026-03-28 09:15', type: 'bid_section', status: 'completed', desc: '根据最新城市规划，对静安寺等标段的作业面积进行重新测绘并更新系统数据。' },
                  ].map((task, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{task.name}</div>
                        <div className="text-[10px] text-slate-400">流程类型: {resourceTypes.find(t => t.id === task.type)?.label}</div>
                      </td>
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
                        <button onClick={() => handleTaskDetail(task)} className="text-xs font-bold text-primary hover:underline">详情</button>
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
            {resourceTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveSubTab(type.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeSubTab === type.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <type.icon className="w-4 h-4" />
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
                  placeholder={`搜索${resourceTypes.find(t => t.id === activeSubTab)?.label}...`}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowWorkflow(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Activity className="w-4 h-4" />
                常态化更新
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
                <Plus className="w-4 h-4" />
                新增信息
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {activeSubTab === 'department' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">部门名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">上级部门</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">负责人</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">联系电话</th>
                      </>
                    )}
                    {activeSubTab === 'bid_section' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">标段名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">作业面积 (㎡)</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所属企业</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">负责人</th>
                      </>
                    )}
                    {activeSubTab === 'enterprise' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">企业名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">企业类型</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">负责人</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">联系电话</th>
                      </>
                    )}
                    {activeSubTab === 'vehicle' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">车牌号</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">车辆类型</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所属企业</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                      </>
                    )}
                    {activeSubTab === 'personnel' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">姓名</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">性别/年龄</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">岗位</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所属企业</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">联系电话</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold">加载中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="w-12 h-12 text-slate-200" />
                          <span className="text-sm font-bold">暂无数据</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        {activeSubTab === 'department' && (
                          <>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.parentName}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.manager}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.phone}</td>
                          </>
                        )}
                        {activeSubTab === 'bid_section' && (
                          <>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{item.area.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.enterprise}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.manager}</td>
                          </>
                        )}
                        {activeSubTab === 'enterprise' && (
                          <>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.type}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.manager}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.phone}</td>
                          </>
                        )}
                        {activeSubTab === 'vehicle' && (
                          <>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.plateNo}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.type}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.enterprise}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                item.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                item.status === 'maintenance' ? 'bg-orange-50 text-orange-600' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {item.status === 'online' ? '在线' : item.status === 'maintenance' ? '维修' : '离线'}
                              </span>
                            </td>
                          </>
                        )}
                        {activeSubTab === 'personnel' && (
                          <>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.gender} / {item.age}岁</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.position}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.enterprise}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.phone}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors">
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

      {/* Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {modalType === 'add' ? '新增' : '编辑'}{resourceTypes.find(t => t.id === activeSubTab)?.label}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                {activeSubTab === 'department' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">部门名称</label>
                      <input name="name" type="text" required defaultValue={selectedItem?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">上级部门</label>
                      <input name="parentName" type="text" defaultValue={selectedItem?.parentName} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">负责人</label>
                      <input name="manager" type="text" defaultValue={selectedItem?.manager} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">联系电话</label>
                      <input name="phone" type="text" defaultValue={selectedItem?.phone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
                {activeSubTab === 'bid_section' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">标段名称</label>
                      <input name="name" type="text" required defaultValue={selectedItem?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">作业面积 (㎡)</label>
                      <input name="area" type="number" defaultValue={selectedItem?.area} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">所属企业</label>
                      <input name="enterprise" type="text" defaultValue={selectedItem?.enterprise} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">负责人</label>
                      <input name="manager" type="text" defaultValue={selectedItem?.manager} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
                {activeSubTab === 'enterprise' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">企业名称</label>
                      <input name="name" type="text" required defaultValue={selectedItem?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">企业类型</label>
                      <select name="type" defaultValue={selectedItem?.type || '私营企业'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>国有企业</option>
                        <option>私营企业</option>
                        <option>合资企业</option>
                        <option>事业单位</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">负责人</label>
                      <input name="manager" type="text" defaultValue={selectedItem?.manager} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">联系电话</label>
                      <input name="phone" type="text" defaultValue={selectedItem?.phone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
                {activeSubTab === 'vehicle' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">车牌号</label>
                      <input name="plateNo" type="text" required defaultValue={selectedItem?.plateNo} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">车辆类型</label>
                      <select name="type" defaultValue={selectedItem?.type || '压缩式垃圾车'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>压缩式垃圾车</option>
                        <option>扫路车</option>
                        <option>洒水车</option>
                        <option>勾臂车</option>
                        <option>餐厨垃圾车</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">所属企业</label>
                      <input name="enterprise" type="text" defaultValue={selectedItem?.enterprise} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">运行状态</label>
                      <select name="status" defaultValue={selectedItem?.status || 'online'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="online">在线</option>
                        <option value="offline">离线</option>
                        <option value="maintenance">维修</option>
                      </select>
                    </div>
                  </div>
                )}
                {activeSubTab === 'personnel' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">姓名</label>
                      <input name="name" type="text" required defaultValue={selectedItem?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">性别</label>
                      <select name="gender" defaultValue={selectedItem?.gender || '男'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>男</option>
                        <option>女</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">年龄</label>
                      <input name="age" type="number" defaultValue={selectedItem?.age} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">岗位</label>
                      <input name="position" type="text" defaultValue={selectedItem?.position} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">所属企业</label>
                      <input name="enterprise" type="text" defaultValue={selectedItem?.enterprise} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">联系电话</label>
                      <input name="phone" type="text" defaultValue={selectedItem?.phone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">取消</button>
                <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition-colors shadow-lg shadow-primary/20">保存信息</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  selectedTask.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                  selectedTask.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                  selectedTask.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">任务详情</h3>
                  <p className="text-xs text-slate-400">ID: {selectedTask.id}</p>
                </div>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">任务名称</label>
                <p className="text-slate-800 font-bold mt-1">{selectedTask.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前环节</label>
                  <p className="mt-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">{selectedTask.step}</span>
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">发起人</label>
                  <p className="text-slate-800 text-sm font-medium mt-1">{selectedTask.user}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">任务描述</label>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{selectedTask.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-800">处理记录</h4>
                  <button className="text-[10px] font-bold text-primary hover:underline">查看全部</button>
                </div>
                <div className="space-y-4">
                  {[
                    { time: '2026-03-30 14:00', user: '张三', action: '发起任务', remark: '初始化核对流程' },
                    { time: '2026-03-30 15:30', user: '系统', action: '自动分发', remark: '任务已分发至相关审核人员' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">{log.user}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{log.action}: {log.remark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsTaskModalOpen(false)} className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">关闭</button>
              <button className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-colors">处理任务</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ResourceManagement;
