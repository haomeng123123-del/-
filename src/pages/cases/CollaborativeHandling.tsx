import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Clock, MapPin, Camera, User, CheckCircle2, XCircle, Send, Video, FileText, List, BarChart2, Download, Settings, Plus, RefreshCw } from 'lucide-react';
import { queryCases, addCase, updateCase } from '../../api/services/sanitation';
import { Case, CaseStatus } from '../../types/sanitation';
import { toast } from 'sonner';

const CollaborativeHandling: React.FC = () => {
  const [activeTab, setActiveTab] = useState('accept');
  const [cases, setCases] = useState<Case[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Form state for registration
  const [formData, setFormData] = useState<Partial<Case>>({
    type: '暴露垃圾',
    title: '',
    description: '',
    priority: 'medium',
    locationName: '',
    reporter: '系统管理员',
    evidenceImages: []
  });

  const tabs = [
    { id: 'register', label: '案件登记录入', icon: FileText },
    { id: 'accept', label: '案件受理立案', icon: CheckCircle2 },
    { id: 'dispatch', label: '案件派遣处置', icon: Send },
    { id: 'supervise', label: '案件督办', icon: AlertTriangle },
    { id: 'close', label: '案件结案', icon: CheckCircle2 },
    { id: 'details', label: '案件详情', icon: List },
    { id: 'query', label: '案件查询', icon: Search },
    { id: 'statistics', label: '案件统计', icon: BarChart2 },
    { id: 'similar', label: '相似案卷提示', icon: FileText },
    { id: 'typical', label: '典型案件', icon: FileText },
    { id: 'self', label: '案件自行处置', icon: CheckCircle2 },
    { id: 'export', label: '案件导出下载', icon: Download },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryCases({ 
        pageNo: 1, 
        pageSize: 50, 
        status: status === 'all' ? undefined : status,
        keyword: searchKeyword || undefined
      });
      setCases(res.data.list);
      if (res.data.list.length > 0 && !selectedCase) {
        setSelectedCase(res.data.list[0]);
      } else if (selectedCase) {
        const updated = res.data.list.find(c => c.id === selectedCase.id);
        if (updated) setSelectedCase(updated);
      }
    } catch (error) {
      toast.error('获取案件列表失败');
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [status, searchKeyword]);

  const handleAction = async (caseId: string, newStatus: CaseStatus, actionLabel: string) => {
    try {
      await updateCase({ id: caseId, status: newStatus });
      toast.success(`${actionLabel}成功`);
      fetchData();
    } catch (error) {
      toast.error(`${actionLabel}失败`);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCase({
        ...formData,
        reportTime: new Date().toISOString(),
        status: 'pending',
        location: formData.locationName || '',
        source: '系统录入',
        coordinates: '116.40, 39.90',
        grid: '默认网格',
        suggestedHandler: '待分配',
        evidenceImages: [
          'https://picsum.photos/seed/case1/800/600',
          'https://picsum.photos/seed/case2/800/600'
        ]
      });
      toast.success('案件登记成功');
      setFormData({
        type: '暴露垃圾',
        title: '',
        description: '',
        priority: 'medium',
        locationName: '',
        reporter: '系统管理员',
        evidenceImages: []
      });
      setActiveTab('accept');
      fetchData();
    } catch (error) {
      toast.error('案件登记失败');
    }
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-error text-white',
  };

  const statusLabels = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar for Sub-functions */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {['accept', 'dispatch', 'supervise', 'close', 'details'].includes(activeTab) ? (
          <>
            {/* Left Panel: Case Queue */}
            <div className="lg:w-[30%] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="搜索案件编号、位置或描述..." 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    onClick={() => setStatus('all')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${status === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    全部 ({cases.length})
                  </button>
                  <button 
                    onClick={() => setStatus('pending')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${status === 'pending' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    待处理 ({cases.filter(c => c.status === 'pending').length})
                  </button>
                  <button 
                    onClick={() => setStatus('processing')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${status === 'processing' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    处理中 ({cases.filter(c => c.status === 'processing').length})
                  </button>
                  <button 
                    onClick={() => setStatus('resolved')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${status === 'resolved' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    已解决 ({cases.filter(c => c.status === 'resolved').length})
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loading ? (
                  <div className="p-8 text-center text-slate-400">加载中...</div>
                ) : (
                  cases.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedCase(item)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedCase?.id === item.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${priorityColors[item.priority]}`}>
                          {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{item.id.slice(0, 8)}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">{item.type}</h4>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{item.locationName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(item.reportTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                            item.status === 'processing' ? 'bg-blue-50 text-blue-600' : 
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {statusLabels[item.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:w-[70%] flex flex-col gap-6">
              {/* Top: Interactive Map & Live Feed */}
              <div className="h-[55%] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative group">
                <div className="absolute inset-0 bg-slate-200">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Map" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeC1DNNy1WZXtwI4Lg68jtYDdc1ppRJrCs06Q_rqjoDO-dqgWErN3Di47e4-WTS9EMvRkDJAftVG9ChgMg6kjAk6fSLx3F5Pq-0t9M34dnvljBb9DsfdYgbD3NE2bV_JFfIfD-ASR58kWxUJ7rAeU1CuHbgcajcO2CaDifarnzrAaEIrJ9NZvZOYggBJqrbYL5pFfYDvuiSSwIcZh9ipo5kNj1TyfO1xtxyirgjOGQkBnUBgI4S5asJcy9U2w9vWKVoJj8XDrR9U8"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Live Feed Overlay */}
                <div className="absolute top-4 right-4 w-64 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                  <div className="px-3 py-2 bg-slate-800/80 backdrop-blur flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                      <span className="text-xs font-bold text-white uppercase">现场监控画面</span>
                    </div>
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="aspect-video bg-black relative">
                    {selectedCase?.evidenceImages[0] ? (
                      <img src={selectedCase.evidenceImages[0]} alt="Live Feed" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">无视频信号</div>
                    )}
                    <div className="absolute bottom-2 left-2 text-[10px] text-white/70 font-mono bg-black/50 px-1.5 py-0.5 rounded">CAM-042 | {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-md hover:bg-white flex items-center justify-center text-slate-700">
                    <span className="text-lg font-bold leading-none">+</span>
                  </button>
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-md hover:bg-white flex items-center justify-center text-slate-700">
                    <span className="text-lg font-bold leading-none">-</span>
                  </button>
                </div>
              </div>

              {/* Bottom: Detailed Case Content */}
              <div className="h-[45%] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                {selectedCase ? (
                  <>
                    <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black font-headline text-slate-800">{selectedCase.type}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityColors[selectedCase.priority]}`}>
                            {selectedCase.priority === 'urgent' ? '紧急' : selectedCase.priority === 'high' ? '高' : selectedCase.priority === 'medium' ? '中' : '低'}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            selectedCase.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                            selectedCase.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {statusLabels[selectedCase.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">案件编号: #{selectedCase.id}</p>
                      </div>
                      <div className="flex gap-2">
                        {activeTab === 'accept' && selectedCase.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(selectedCase.id, 'closed', '驳回')}
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4 text-slate-400" />
                              驳回
                            </button>
                            <button 
                              onClick={() => handleAction(selectedCase.id, 'processing', '立案')}
                              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              立案
                            </button>
                          </>
                        )}
                        {activeTab === 'dispatch' && selectedCase.status === 'processing' && (
                          <button 
                            onClick={() => handleAction(selectedCase.id, 'processing', '派发')}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            派发工单
                          </button>
                        )}
                        {activeTab === 'supervise' && (
                          <button 
                            onClick={() => toast.info('已发起督办通知')}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            发起督办
                          </button>
                        )}
                         {activeTab === 'close' && selectedCase.status !== 'closed' && (
                          <button 
                            onClick={() => handleAction(selectedCase.id, 'closed', '结案')}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            标记完成
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-5 overflow-y-auto flex gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">发生时间</p>
                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {new Date(selectedCase.reportTime).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">上报来源</p>
                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" />
                              {selectedCase.reporter} (网格员)
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">详细位置</p>
                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {selectedCase.locationName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">事件描述</p>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedCase.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-64 flex flex-col">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5" />
                          现场抓拍图片
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedCase.evidenceImages.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity">
                              <img src={img} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                          {selectedCase.evidenceImages.length === 0 && (
                            <div className="col-span-2 aspect-video rounded-lg bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center text-xs text-slate-400">
                              暂无图片
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <AlertTriangle className="w-12 h-12 mb-4 text-slate-200" />
                    <p>请在左侧选择一个案件查看详情</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'register' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">案件登记录入</h2>
            <form onSubmit={handleRegisterSubmit} className="flex-1 overflow-y-auto max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">案件类型</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>暴露垃圾</option>
                    <option>占道经营</option>
                    <option>违规广告牌</option>
                    <option>路面破损</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">上报人</label>
                  <input 
                    type="text" 
                    required
                    value={formData.reporter}
                    onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                    placeholder="请输入上报人姓名" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">优先级</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="urgent">紧急</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">发生位置</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      value={formData.locationName}
                      onChange={(e) => setFormData({...formData, locationName: e.target.value, location: e.target.value})}
                      placeholder="请输入详细位置" 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                    <button type="button" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      定位
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">案件描述</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="请输入案件详细描述..." 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">现场照片</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-xs">上传照片</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button type="button" onClick={() => setFormData({})} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">重置</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-container transition-colors">提交登记</button>
              </div>
            </form>
          </div>
        ) : activeTab === 'query' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
              <div className="flex gap-4">
                <input type="text" placeholder="案件编号/关键字" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <select className="w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">所有状态</option>
                  <option value="pending">待处理</option>
                  <option value="processing">处理中</option>
                  <option value="resolved">已解决</option>
                  <option value="closed">已关闭</option>
                </select>
                <input type="date" className="w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-container transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  查询
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="pb-3 font-medium">案件编号</th>
                    <th className="pb-3 font-medium">案件类型</th>
                    <th className="pb-3 font-medium">发生位置</th>
                    <th className="pb-3 font-medium">上报时间</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-sm font-mono text-slate-500">#{item.id.slice(0, 8)}</td>
                      <td className="py-4 text-sm font-bold text-slate-800">{item.type}</td>
                      <td className="py-4 text-sm text-slate-600">{item.locationName}</td>
                      <td className="py-4 text-sm text-slate-500">{new Date(item.reportTime).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          item.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                          item.status === 'processing' ? 'bg-blue-50 text-blue-600' : 
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors">查看详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'statistics' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">案件统计分析</h2>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-600 font-bold mb-1">今日新增案件</p>
                <p className="text-3xl font-black text-blue-700">24</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-600 font-bold mb-1">待处理案件</p>
                <p className="text-3xl font-black text-orange-700">12</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-600 font-bold mb-1">今日结案数</p>
                <p className="text-3xl font-black text-emerald-700">18</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-600 font-bold mb-1">结案率</p>
                <p className="text-3xl font-black text-purple-700">85%</p>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>图表组件加载中...</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'similar' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">相似案卷提示</h2>
            <div className="flex-1 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-blue-800 mb-1">智能分析提示</h3>
                  <p className="text-sm text-blue-600">系统检测到近期有 3 起相似案件，建议合并处理或参考历史处置方案。</p>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl hover:border-primary transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm">朝阳区暴露垃圾问题 #{i}</h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">相似度 9{i}%</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">发生地点：朝阳区某某街道... 描述：路边有大量建筑垃圾堆积...</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>上报时间：2026-03-{30-i}</span>
                      <button className="text-primary font-bold hover:underline">查看详情</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'typical' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">典型案件库</h2>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="搜索典型案件..." className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <select className="w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>所有分类</option>
                <option>优秀处置案例</option>
                <option>疑难复杂案件</option>
                <option>跨部门协同案例</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded">优秀处置</span>
                    <h4 className="font-bold text-slate-800 text-sm truncate">海淀区大型违建拆除案</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">该案件涉及多个部门协同，通过高效的指挥调度，在48小时内完成了大型违章建筑的拆除和现场清理工作...</p>
                  <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors">学习案例</button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'self' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">案件自行处置</h2>
            <div className="flex-1 overflow-y-auto max-w-3xl">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-orange-800">说明：适用于网格员或巡查员在巡查过程中发现并当场解决的轻微案件，无需经过完整的上报、立案、派遣流程。</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">案件类型</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>轻微暴露垃圾</option>
                    <option>共享单车乱停放</option>
                    <option>非法小广告</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">发生位置</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="请输入详细位置" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      定位
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">处置说明</label>
                  <textarea rows={3} placeholder="请简述处置过程和结果..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">处置前照片</label>
                  <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs">上传照片</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">处置后照片</label>
                  <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs">上传照片</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-container transition-colors">提交处置记录</button>
              </div>
            </div>
          </div>
        ) : activeTab === 'export' ? (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">案件导出下载</h2>
            <div className="max-w-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">时间范围</label>
                  <div className="flex gap-4">
                    <input type="date" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="flex items-center text-slate-400">至</span>
                    <input type="date" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">案件状态</label>
                  <div className="flex gap-4 flex-wrap">
                    {['全部', '待处理', '处理中', '已解决', '已关闭'].map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked={s === '全部'} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">导出格式</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="radio" name="format" className="text-primary focus:ring-primary" defaultChecked />
                      Excel (.xlsx)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="radio" name="format" className="text-primary focus:ring-primary" />
                      CSV (.csv)
                    </label>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-container transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    生成并下载报表
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 p-8">
            <FileText className="w-16 h-16 mb-4 text-slate-200" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p>该模块功能正在开发中，敬请期待...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeHandling;
