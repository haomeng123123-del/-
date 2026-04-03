import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Building2, Trash2, Bath, Factory, ArrowRight } from 'lucide-react';

const facilities = [
  { id: 'F001', name: '长宁区第一转运站', type: '转运站', region: '长宁区', status: '正常', capacity: '500吨/日', address: '长宁区天山路100号', path: '/transfer/stations' },
  { id: 'F002', name: '静安区中心公厕', type: '公厕', region: '静安区', status: '正常', capacity: '2000人次/日', address: '静安区南京西路200号', path: '/facility' },
  { id: 'F003', name: '徐汇区垃圾收集点A', type: '收集点', region: '徐汇区', status: '满溢', capacity: '50桶', address: '徐汇区淮海中路300号', path: '/transfer' },
  { id: 'F004', name: '浦东新区焚烧厂', type: '焚烧厂', region: '浦东新区', status: '正常', capacity: '2000吨/日', address: '浦东新区张江路400号', path: '/disposal/incineration' },
  { id: 'F005', name: '闵行区填埋场', type: '填埋场', region: '闵行区', status: '维护中', capacity: '1000吨/日', address: '闵行区七莘路500号', path: '/disposal' },
];

const summary = [
  { type: '转运站', count: 45, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', path: '/transfer/stations' },
  { type: '公厕', count: 320, icon: Bath, color: 'text-teal-500', bg: 'bg-teal-50', path: '/facility' },
  { type: '收集点', count: 1250, icon: Trash2, color: 'text-orange-500', bg: 'bg-orange-50', path: '/transfer' },
  { type: '焚烧厂', count: 4, icon: Factory, color: 'text-red-500', bg: 'bg-red-50', path: '/disposal/incineration' },
];

const FacilityTopic: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('全部');
  const navigate = useNavigate();

  const filteredFacilities = facilities.filter(f => 
    (selectedType === '全部' || f.type === selectedType) &&
    f.name.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">环卫设施专题</h1>
        <p className="text-slate-500 mt-1">环卫设施地图空间联动与全局监测</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summary.map((item) => (
          <div 
            key={item.type} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group" 
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 ${item.bg} ${item.color} rounded-2xl`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{item.type}</p>
                <p className="text-3xl font-black text-slate-800 font-headline">{item.count}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Map Section */}
        <div className="lg:w-[60%] relative bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Background" 
            className="w-full h-full object-cover opacity-60 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
            <h4 className="font-bold text-slate-800 mb-2">设施空间分布</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> 转运站</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-500"></span> 公厕</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 收集点</div>
            </div>
          </div>
          {/* Simulated Markers */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce cursor-pointer" onClick={() => navigate('/transfer/stations')}></div>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-teal-500 rounded-full border-2 border-white shadow-lg cursor-pointer" onClick={() => navigate('/facility')}></div>
          <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-pointer" onClick={() => navigate('/transfer')}></div>
        </div>

        {/* List Section */}
        <div className="lg:w-[40%] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">设施清单列表</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
                  placeholder="搜索设施名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <button className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-100">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['全部', '转运站', '公厕', '收集点', '焚烧厂', '填埋场'].map(type => (
                <button 
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${selectedType === type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredFacilities.map(f => (
              <div 
                key={f.id} 
                className="p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(f.path)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{f.name}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${f.status === '正常' ? 'bg-emerald-50 text-emerald-600' : f.status === '满溢' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                    {f.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {f.address}</p>
                  <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span> 类型: {f.type} | 容量: {f.capacity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityTopic;
