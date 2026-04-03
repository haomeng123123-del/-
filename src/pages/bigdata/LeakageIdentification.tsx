import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, AlertTriangle, Truck, Map, CheckCircle, Search, Filter, PlayCircle } from 'lucide-react';

const records = [
  { id: 'L2024052301', plateNo: '沪A·8K291', time: '2024-05-23 10:15:22', location: '长宁区天山路段', type: '跑冒滴漏', status: '待处理', confidence: '98%' },
  { id: 'L2024052302', plateNo: '沪B·D3042', time: '2024-05-23 09:42:10', location: '徐汇区淮海中路', type: '箱门未关严', status: '已下发任务', confidence: '95%' },
  { id: 'L2024052303', plateNo: '沪A·M8821', time: '2024-05-23 08:15:05', location: '静安区南京西路', type: '违规长时间停留', status: '已核实', confidence: '99%' },
  { id: 'L2024052304', plateNo: '沪C·99211', time: '2024-05-22 16:20:00', location: '浦东新区张江路', type: '偏离轨迹', status: '已处理', confidence: '92%' },
];

const LeakageIdentification: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(records[0]);

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆跑冒滴漏识别处置</h1>
        <p className="text-slate-500 mt-1">基于AI视频分析与传感器数据的违规行为研判</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">接入视频流</p>
            <p className="text-3xl font-black text-slate-800 font-headline">1,245</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">今日识别告警</p>
            <p className="text-3xl font-black text-slate-800 font-headline">24</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">已处置任务</p>
            <p className="text-3xl font-black text-slate-800 font-headline">18</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">涉及车辆数</p>
            <p className="text-3xl font-black text-slate-800 font-headline">15</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Video Analysis & Details */}
        <div className="lg:w-[60%] flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden relative aspect-video border border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=2000" 
              alt="Video Feed" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            {/* AI Bounding Box Overlay */}
            <div className="absolute top-[40%] left-[30%] w-32 h-24 border-2 border-red-500 bg-red-500/20 rounded-lg flex items-start justify-start p-1">
              <span className="bg-red-500 text-white text-[10px] font-bold px-1 rounded">跑冒滴漏 98%</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-white font-bold text-sm">实时 AI 分析中</span>
                </div>
                <h3 className="text-white font-bold text-lg">{selectedRecord.plateNo} - {selectedRecord.type}</h3>
                <p className="text-slate-300 text-sm">{selectedRecord.location} | {selectedRecord.time}</p>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full transition-colors">
                <PlayCircle className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">研判详情与处置</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">箱门开关传感器</p>
                <p className="font-bold text-red-600">异常 (未关严)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">车辆轨迹偏离</p>
                <p className="font-bold text-emerald-600">正常</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">停留时间分析</p>
                <p className="font-bold text-emerald-600">正常 (2分钟)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">AI 综合置信度</p>
                <p className="font-bold text-slate-800">{selectedRecord.confidence}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/comprehensive/cleaning')}
                className="flex-1 bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold transition-colors"
              >
                下发保洁任务
              </button>
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-bold transition-colors">
                误报忽略
              </button>
            </div>
          </div>
        </div>

        {/* Right: Records List */}
        <div className="lg:w-[40%] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">识别记录列表</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
                  placeholder="搜索车牌号..."
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <button className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-100">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {records.map(r => (
              <div 
                key={r.id} 
                onClick={() => setSelectedRecord(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedRecord.id === r.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-primary/30'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{r.plateNo}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${r.status === '待处理' ? 'bg-red-50 text-red-600' : r.status === '已下发任务' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {r.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-orange-500" /> {r.type} (置信度: {r.confidence})</p>
                  <p className="flex items-center gap-2"><Map className="w-3 h-3" /> {r.location}</p>
                  <p className="text-xs text-slate-400 mt-2">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeakageIdentification;
