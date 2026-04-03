import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, AlertTriangle, Search, Filter, ArrowRight, Truck, Building2, Factory, ExternalLink } from 'lucide-react';

const anomalies = [
  { id: 'A001', plateNo: '沪A·8K291', route: '长宁区天山路 -> 浦东焚烧厂', expected: '浦东焚烧厂', actual: '闵行填埋场', time: '2024-05-23 11:20', status: '待核实', weight: '5.2吨' },
  { id: 'A002', plateNo: '沪B·D3042', route: '徐汇区淮海路 -> 徐汇转运站', expected: '徐汇转运站', actual: '未知区域', time: '2024-05-23 10:05', status: '已报警', weight: '3.8吨' },
  { id: 'A003', plateNo: '沪A·M8821', route: '静安区南京路 -> 静安转运站', expected: '静安转运站', actual: '静安转运站', time: '2024-05-23 09:15', status: '正常', weight: '4.5吨' },
];

const FlowAnomaly: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0]);

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">垃圾流向监控和异常识别</h1>
        <p className="text-slate-500 mt-1">全链条流向追踪与异常去向智能预警</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Map & Flow Chain */}
        <div className="lg:w-[65%] flex flex-col gap-6">
          <div className="bg-slate-100 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative flex-1">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              alt="Map Background" 
              className="w-full h-full object-cover opacity-60 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40">
              <h4 className="font-bold text-slate-800 mb-2">流向异常统计</h4>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">今日异常车次</p>
                  <p className="text-2xl font-black text-orange-600">12</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">涉及垃圾量</p>
                  <p className="text-2xl font-black text-red-600">45.8<span className="text-sm font-normal">吨</span></p>
                </div>
              </div>
            </div>
            
            {/* Simulated Route on Map */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 200 300 Q 400 200 600 400" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
              <circle cx="200" cy="300" r="8" fill="#3b82f6" />
              <circle cx="600" cy="400" r="8" fill="#ef4444" />
            </svg>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-48 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">流向链条详情 - {selectedAnomaly.plateNo}</h3>
              <button 
                onClick={() => navigate('/comprehensive/collection')}
                className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
              >
                查看车辆轨迹 <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-8 relative mt-4">
              <div className="absolute top-1/2 left-16 right-16 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-16 right-[30%] h-1 bg-emerald-500 -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-[70%] right-16 h-1 bg-red-500 stroke-dasharray-4 -translate-y-1/2 z-0 border-t-2 border-dashed border-red-500"></div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-4 border-white shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">收集点</p>
                <p className="text-[10px] text-slate-500">10:15</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">中转站 (预期)</p>
                <p className="text-[10px] text-slate-500">11:00</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center border-4 border-white shadow-md animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-red-600">异常去向</p>
                <p className="text-[10px] text-slate-500">{selectedAnomaly.actual}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Anomaly List */}
        <div className="lg:w-[35%] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">异常记录列表</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
                  placeholder="搜索车牌号或路线..."
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <button className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-100">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {anomalies.map(a => (
              <div 
                key={a.id} 
                onClick={() => setSelectedAnomaly(a)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedAnomaly.id === a.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-primary/30'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{a.plateNo}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${a.status === '待核实' ? 'bg-orange-50 text-orange-600' : a.status === '已报警' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {a.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-slate-400" /> 预期: {a.expected}</p>
                  <p className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-red-500" /> 实际: <span className="font-bold text-red-600">{a.actual}</span></p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100/50">
                    <span className="text-xs text-slate-400">{a.time}</span>
                    <span className="text-xs font-bold text-slate-700">载重: {a.weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowAnomaly;
