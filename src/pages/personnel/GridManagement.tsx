import React, { useState } from 'react';
import { Search, Plus, Layers, Users, Edit3, Trash2 } from 'lucide-react';

const GridManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedGrid, setSelectedGrid] = useState<number | null>(1);
  const [showToast, setShowToast] = useState('');

  const gridList = [
    { id: 1, name: '静安寺-01区', type: '重点保洁区', area: '1.2 km²', personnelCount: 12, vehicleCount: 3, desc: '重点保洁区域，包含主要商业街和交通枢纽。' },
    { id: 2, name: '南京西路-核心段', type: '商业街区', area: '0.8 km²', personnelCount: 18, vehicleCount: 5, desc: '人流量密集的商业核心地段，需要高频次保洁。' },
    { id: 3, name: '延安中路-绿地', type: '公园绿地', area: '2.5 km²', personnelCount: 8, vehicleCount: 2, desc: '大型城市绿地，主要负责落叶清扫和垃圾桶清理。' },
  ];

  const filteredList = gridList.filter(grid => 
    grid.name.includes(search) || grid.type.includes(search)
  );

  const selectedGridData = gridList.find(g => g.id === selectedGrid);

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="h-full flex gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      {/* Left Panel: Grid List */}
      <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black font-headline text-slate-900">作业网格管理</h2>
            <button onClick={() => handleAction('新建网格')} className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
              placeholder="搜索网格名称..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredList.map((grid) => (
            <div
              key={grid.id}
              onClick={() => setSelectedGrid(grid.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedGrid === grid.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800 text-sm">{grid.name}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">{grid.type}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-3">
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>{grid.area}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{grid.personnelCount} 人</span>
                </div>
              </div>
            </div>
          ))}
          {filteredList.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-4">
              没有找到匹配的网格
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map & Grid Details */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Map View */}
        <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Background" 
            className="w-full h-full object-cover opacity-60 grayscale"
            referrerPolicy="no-referrer"
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button onClick={() => handleAction('开启多边形绘制工具')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50" title="绘制多边形">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('删除选中的网格图形')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50" title="删除选中">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Simulated Grid Polygon */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polygon 
              points="200,200 400,150 500,300 300,400" 
              fill={selectedGrid === 1 ? "rgba(37, 99, 235, 0.4)" : "rgba(37, 99, 235, 0.2)"} 
              stroke="#2563eb" 
              strokeWidth={selectedGrid === 1 ? "3" : "2"} 
              className="transition-all"
            />
            <polygon 
              points="550,250 700,200 750,400 600,450" 
              fill={selectedGrid === 2 ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.2)"} 
              stroke="#10b981" 
              strokeWidth={selectedGrid === 2 ? "3" : "2"} 
              className="transition-all"
            />
          </svg>
          
          {/* Grid Label */}
          {selectedGridData && (
            <div className="absolute top-[250px] left-[350px] -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow text-xs font-bold text-blue-700 border border-blue-200">
                {selectedGridData.name}
              </div>
            </div>
          )}
        </div>

        {/* Grid Details Panel */}
        {selectedGridData ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedGridData.name}</h3>
              <p className="text-sm text-slate-500">{selectedGridData.desc}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold mb-1">面积</p>
                <p className="text-xl font-black text-slate-800">{selectedGridData.area.replace(' km²', '')} <span className="text-sm font-medium text-slate-500">km²</span></p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold mb-1">关联人员</p>
                <p className="text-xl font-black text-slate-800">{selectedGridData.personnelCount} <span className="text-sm font-medium text-slate-500">人</span></p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold mb-1">关联车辆</p>
                <p className="text-xl font-black text-slate-800">{selectedGridData.vehicleCount} <span className="text-sm font-medium text-slate-500">辆</span></p>
              </div>
            </div>
            <div className="border-l border-slate-100 pl-6 flex gap-2">
              <button onClick={() => handleAction(`编辑网格信息: ${selectedGridData.name}`)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm">
                编辑信息
              </button>
              <button onClick={() => handleAction(`人员排班: ${selectedGridData.name}`)} className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-container transition-colors text-sm shadow-md">
                人员排班
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
            请在左侧列表中选择网格查看详情
          </div>
        )}
      </div>
    </div>
  );
};

export default GridManagement;
