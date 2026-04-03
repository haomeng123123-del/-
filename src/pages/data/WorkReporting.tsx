import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, XCircle, Eye, FileText, Settings, Clock, ChevronRight } from 'lucide-react';
import { queryWorkReports, addWorkReport, auditWorkReport, deleteWorkReport } from '../../api/services/data';
import { WorkReport } from '../../types/data';

const WorkReporting: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [showConfig, setShowConfig] = useState(false);
  const [configTab, setConfigTab] = useState('unit');
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkReport | null>(null);

  const reportTypes = [
    { id: 'all', label: '全部报送' },
    { id: 'daily', label: '日常工作信息' },
    { id: 'bid_section', label: '企业标段信息' },
    { id: 'solid_waste', label: '固废处理项目运行' },
    { id: 'kitchen_waste', label: '餐厨垃圾收运' },
    { id: 'construction', label: '设施项目建设进度' },
  ];

  const configTabs = [
    { id: 'unit', label: '填报单位配置' },
    { id: 'type', label: '填报类型配置' },
    { id: 'period', label: '填报周期配置' },
    { id: 'subject', label: '填报主体设置' },
    { id: 'process', label: '填报流程配置' },
    { id: 'field', label: '填报字段配置' },
  ];

  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedConfigItem, setSelectedConfigItem] = useState<any>(null);

  const [configItems, setConfigItems] = useState<Record<string, any[]>>({
    unit: [
      { id: '1', name: '环卫一分公司', desc: '负责辖区内基础数据上报' },
      { id: '2', name: '环卫二分公司', desc: '负责辖区内基础数据上报' },
      { id: '3', name: '环卫三分公司', desc: '负责辖区内基础数据上报' },
      { id: '4', name: '环卫四分公司', desc: '负责辖区内基础数据上报' },
    ],
    type: [
      { id: '1', name: '日常作业类', desc: '定义报送任务的业务分类' },
      { id: '2', name: '专项整治类', desc: '定义报送任务的业务分类' },
      { id: '3', name: '应急保障类', desc: '定义报送任务的业务分类' },
      { id: '4', name: '设施检查类', desc: '定义报送任务的业务分类' },
    ],
    period: [
      { id: '1', name: '每日报送', desc: '设定任务的定期报送频率' },
      { id: '2', name: '每周报送', desc: '设定任务的定期报送频率' },
      { id: '3', name: '每月报送', desc: '设定任务的定期报送频率' },
      { id: '4', name: '每季报送', desc: '设定任务的定期报送频率' },
    ],
    subject: [
      { id: '1', name: '道路清扫指标', desc: '核心业务考核指标定义' },
      { id: '2', name: '垃圾清运指标', desc: '核心业务考核指标定义' },
      { id: '3', name: '公厕维护指标', desc: '核心业务考核指标定义' },
      { id: '4', name: '水域保洁指标', desc: '核心业务考核指标定义' },
    ],
    process: [
      { id: '1', name: '填报流程', desc: '报送审批流转节点配置' },
      { id: '2', name: '初审流程', desc: '报送审批流转节点配置' },
      { id: '3', name: '复核流程', desc: '报送审批流转节点配置' },
      { id: '4', name: '归档流程', desc: '报送审批流转节点配置' },
    ],
    field: [
      { id: '1', name: '基础信息字段', desc: '报送表单的具体字段定义' },
      { id: '2', name: '作业数据字段', desc: '报送表单的具体字段定义' },
      { id: '3', name: '异常反馈字段', desc: '报送表单的具体字段定义' },
      { id: '4', name: '附件上传字段', desc: '报送表单的具体字段定义' },
    ],
  });

  const fetchData = async () => {
    if (showConfig) return;
    setLoading(true);
    try {
      const res = await queryWorkReports({
        pageNo: 1,
        pageSize: 50,
        type: activeSubTab === 'all' ? undefined : activeSubTab as any,
      });
      setReports(res.data.list);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab, showConfig]);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as any;
    
    try {
      await addWorkReport(data);
      setIsModalOpen(false);
      alert('报送成功');
      fetchData();
    } catch (error) {
      alert('报送失败');
    }
  };

  const handleAudit = async (status: 'approved' | 'rejected', remarks?: string) => {
    if (!selectedItem) return;
    try {
      await auditWorkReport(selectedItem.id, status, remarks);
      setAuditModalOpen(false);
      alert('审核完成');
      fetchData();
    } catch (error) {
      alert('审核失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该报送记录吗？')) return;
    try {
      await deleteWorkReport(id);
      alert('删除成功');
      fetchData();
    } catch (error) {
      alert('删除失败');
    }
  };

  if (showConfig) {
    const currentConfig = configTabs.find(t => t.id === configTab);
    
    return (
      <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowConfig(false)} 
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">基础配置管理</h2>
              <p className="text-xs text-slate-400">管理报送单位、类型、周期及流程等核心参数</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
            保存全局配置
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex overflow-hidden">
          {/* Config Sidebar */}
          <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-4 flex flex-col gap-2">
            {configTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setConfigTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                  configTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                <ChevronRight className={`w-4 h-4 transition-transform ${configTab === tab.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </div>

          {/* Config Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{currentConfig?.label}</h3>
                  <p className="text-sm text-slate-400">配置当前模块的详细参数与规则</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">启用此配置项</span>
                      <span className="text-xs text-slate-400">关闭后，该配置在填报端将不可见</span>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">配置说明</label>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      此处用于管理【{currentConfig?.label}】的核心参数。修改后将实时影响所有填报单位的填报流程与数据结构，请在调整前确认业务需求。
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800">当前配置列表</h4>
                    <button 
                      onClick={() => { setSelectedConfigItem(null); setConfigModalOpen(true); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      添加配置项
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {configItems[configTab]?.map((item, i) => (
                      <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center hover:border-primary/30 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-xs">
                            {i + 1 < 10 ? `0${i + 1}` : i + 1}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-700">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedConfigItem(item); setConfigModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('确定要删除该配置项吗？')) {
                                setConfigItems(prev => ({
                                  ...prev,
                                  [configTab]: prev[configTab].filter(i => i.id !== item.id)
                                }));
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
                  <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-orange-800">最近修改记录</p>
                    <p className="text-[11px] text-orange-600 mt-1">管理员 (admin) 于 2024-03-20 14:30 修改了“填报周期配置”</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {reportTypes.map(type => (
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
              placeholder="搜索报送标题、单位..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowConfig(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4" />
            基础配置
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            批量导出
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
            <Plus className="w-4 h-4" />
            信息填报
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报送标题</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">类型</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报送单位</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报送人</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报送时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">加载中...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">暂无数据</td>
                </tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {reportTypes.find(t => t.id === item.type)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.unit}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.reporter}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.reportTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        item.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : 
                         item.status === 'rejected' ? <XCircle className="w-3 h-3" /> : 
                         <Clock className="w-3 h-3" />}
                        {item.status === 'approved' ? '已审核' : item.status === 'rejected' ? '已驳回' : '待审核'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedItem(item); setAuditModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="审核">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="查看详情">
                          <Eye className="w-4 h-4" />
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

      {/* Info Reporting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">信息填报</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">报送标题</label>
                  <input name="title" type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入报送标题" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">报送类型</label>
                    <select name="type" required defaultValue="daily" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      {reportTypes.filter(t => t.id !== 'all').map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">报送单位</label>
                    <input name="unit" type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="报送单位名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">报送人</label>
                    <input name="reporter" type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="姓名" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">报送内容/附件</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-sm text-slate-500">点击或拖拽文件上传</p>
                    <p className="text-[10px] text-slate-400">支持 PDF, Word, Excel, JPG, PNG (最大 20MB)</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-sm">提交报送</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {auditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">报送审核</h3>
              <button onClick={() => setAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">报送详情</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">标题：</span>
                    <span className="text-sm font-bold text-slate-800">{selectedItem.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">单位：</span>
                    <span className="text-sm text-slate-800">{selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">报送人：</span>
                    <span className="text-sm text-slate-800">{selectedItem.reporter}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">审核意见</label>
                <textarea id="auditRemarks" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-24" placeholder="请输入审核意见（可选）"></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => handleAudit('rejected', (document.getElementById('auditRemarks') as HTMLTextAreaElement).value)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                驳回
              </button>
              <button onClick={() => handleAudit('approved', (document.getElementById('auditRemarks') as HTMLTextAreaElement).value)} className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                通过
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Config Item Modal */}
      {configModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">{selectedConfigItem ? '编辑配置项' : '添加配置项'}</h3>
              <button onClick={() => setConfigModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const name = formData.get('name') as string;
              const desc = formData.get('desc') as string;
              
              if (selectedConfigItem) {
                setConfigItems(prev => ({
                  ...prev,
                  [configTab]: prev[configTab].map(i => i.id === selectedConfigItem.id ? { ...i, name, desc } : i)
                }));
              } else {
                setConfigItems(prev => ({
                  ...prev,
                  [configTab]: [...prev[configTab], { id: Date.now().toString(), name, desc }]
                }));
              }
              setConfigModalOpen(false);
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">名称</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    defaultValue={selectedConfigItem?.name}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    placeholder="请输入名称" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">描述说明</label>
                  <textarea 
                    name="desc" 
                    required 
                    defaultValue={selectedConfigItem?.desc}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-24" 
                    placeholder="请输入描述说明"
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setConfigModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-sm">确定</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkReporting;
