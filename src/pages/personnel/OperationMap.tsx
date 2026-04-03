import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Activity, UserCheck, AlertCircle, Filter, Phone, Video, Layers, Search } from 'lucide-react';

const OperationMap: React.FC = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<number | null>(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showToast, setShowToast] = useState('');
  const navigate = useNavigate();

  const personnelList = [
    { id: 1, name: '张建国', role: '清扫工', dept: '静安寺班组', status: 'online', location: '南京西路1649号', battery: 85, heartRate: 72 },
    { id: 2, name: '李明', role: '巡查员', dept: '南京西路班组', status: 'online', location: '静安公园', battery: 62, heartRate: 80 },
    { id: 3, name: '王阿姨', role: '公厕保洁', dept: '静安寺班组', status: 'offline', location: '华山路公厕', battery: 0, heartRate: 0 },
    { id: 4, name: '赵铁柱', role: '清运司机', dept: '运输车队', status: 'warning', location: '延安中路', battery: 15, heartRate: 95 },
    { id: 5, name: '孙大娘', role: '清扫工', dept: '南京西路班组', status: 'online', location: '常德路', battery: 90, heartRate: 68 },
  ];

  const filteredList = personnelList.filter(person => {
    const matchesSearch = person.name.includes(search) || person.dept.includes(search);
    const matchesStatus = statusFilter === 'all' || person.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedPersonData = personnelList.find(p => p.id === selectedPersonnel);

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tight">作业监管地图</h1>
          <p className="text-slate-500 font-sans mt-1">人员在线状态、实时报警与定位追踪</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleAction('打开高级筛选面板')} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>高级筛选</span>
          </button>
          <button onClick={() => navigate('/personnel/statistics')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>考勤统计</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">在岗总人数</p>
            <p className="text-2xl font-bold text-slate-800">1,248</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">出勤率</p>
            <p className="text-2xl font-bold text-slate-800">96.5%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">健康预警</p>
            <p className="text-2xl font-bold text-slate-800">3</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">越界预警</p>
            <p className="text-2xl font-bold text-slate-800">1</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Panel: Personnel List (30%) */}
        <div className="lg:w-[30%] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索姓名、工号或部门..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button onClick={() => setStatusFilter('all')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>全部</button>
              <button onClick={() => setStatusFilter('online')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'online' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>在线</button>
              <button onClick={() => setStatusFilter('offline')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'offline' ? 'bg-slate-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>离线</button>
              <button onClick={() => setStatusFilter('warning')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === 'warning' ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>预警</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredList.map((person) => (
              <div 
                key={person.id}
                onClick={() => setSelectedPersonnel(person.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center gap-4 ${selectedPersonnel === person.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    {person.name[0]}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    person.status === 'online' ? 'bg-emerald-500' : 
                    person.status === 'warning' ? 'bg-orange-500' : 'bg-slate-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm">{person.name}</h4>
                    <span className="text-xs text-slate-500">{person.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{person.location}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredList.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                没有找到匹配的人员
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Map & Details (70%) */}
        <div className="lg:w-[70%] flex flex-col gap-6">
          {/* Map View */}
          <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              alt="Map Background" 
              className="w-full h-full object-cover opacity-60 grayscale"
              referrerPolicy="no-referrer"
            />
            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button onClick={() => handleAction('定位到当前区域')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50">
                <MapPin className="w-4 h-4" />
              </button>
              <button onClick={() => handleAction('切换地图图层')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50">
                <Layers className="w-4 h-4" />
              </button>
            </div>
            
            {/* Simulated Personnel Marker */}
            {selectedPersonData && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-slate-800 mb-1 border border-slate-200 whitespace-nowrap">
                  {selectedPersonData.name} ({selectedPersonData.role})
                </div>
                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                  selectedPersonData.status === 'online' ? 'bg-emerald-500' : 
                  selectedPersonData.status === 'warning' ? 'bg-orange-500' : 'bg-slate-400'
                }`}>
                  {selectedPersonData.status !== 'offline' && (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Details Panel (Bottom) */}
          {selectedPersonData ? (
            <div className="h-48 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
              <div className="w-1/3 border-r border-slate-100 pr-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl text-slate-500 font-bold">
                    {selectedPersonData.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedPersonData.name}</h3>
                    <p className="text-sm text-slate-500">部门: {selectedPersonData.dept}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(`正在呼叫 ${selectedPersonData.name}...`)} className="flex-1 bg-primary/10 text-primary py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4" />
                    呼叫
                  </button>
                  <button onClick={() => handleAction(`正在发起视频 ${selectedPersonData.name}...`)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors">
                    <Video className="w-4 h-4" />
                    视频
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => navigate('/personnel/track-realtime')} className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors">
                    <MapPin className="w-4 h-4" />
                    实时轨迹
                  </button>
                  <button onClick={() => navigate('/personnel/track-history')} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors">
                    <Activity className="w-4 h-4" />
                    历史轨迹
                  </button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold mb-1">当前位置</p>
                  <p className="text-sm font-medium text-slate-800">{selectedPersonData.location}</p>
                  <p className="text-xs text-slate-400 mt-1">状态: {
                    selectedPersonData.status === 'online' ? '在线' : 
                    selectedPersonData.status === 'warning' ? '预警' : '离线'
                  }</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold mb-1">健康监测 (智能手环)</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-slate-800">{selectedPersonData.heartRate || '--'}</p>
                    <p className="text-sm text-slate-500 mb-1">bpm</p>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    selectedPersonData.heartRate === 0 ? 'text-slate-400' :
                    selectedPersonData.heartRate > 90 ? 'text-orange-500' : 'text-emerald-500'
                  }`}>
                    {selectedPersonData.heartRate === 0 ? '未连接' : selectedPersonData.heartRate > 90 ? '心率偏高' : '心率正常'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold mb-1">设备电量</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-slate-800">{selectedPersonData.battery}</p>
                    <p className="text-sm text-slate-500 mb-1">%</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                    <div className={`h-1.5 rounded-full ${
                      selectedPersonData.battery > 20 ? 'bg-emerald-500' : 'bg-red-500'
                    }`} style={{ width: `${selectedPersonData.battery}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
              请在左侧列表中选择人员查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationMap;
