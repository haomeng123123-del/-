import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { querySortingPoints } from '../../api/services/facility';
import { SortingPoint } from '../../types/facility';
import { Search, Filter, MapPin, Info, Phone, User, Trash2, ChevronRight, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SortingMap: React.FC = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState<SortingPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<SortingPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      try {
        const res = await querySortingPoints({ name: search });
        setPoints(res.data);
      } catch (error) {
        console.error('Failed to fetch sorting points:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [search]);

  const getBinColor = (type: string) => {
    switch (type) {
      case '可回收物': return 'bg-blue-500';
      case '有害垃圾': return 'bg-red-500';
      case '厨余垃圾': return 'bg-green-600';
      case '其他垃圾': return 'bg-slate-600';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex gap-6">
      {/* 左侧列表 */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索分类点..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">分类点列表</h3>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500 uppercase tracking-wider">
              {points.length} 个点位
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">加载中...</div>
            ) : points.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">未找到匹配点位</div>
            ) : (
              points.map(point => (
                <button
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`w-full p-4 rounded-2xl text-left transition-all group ${
                    selectedPoint?.id === point.id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider ${
                      selectedPoint?.id === point.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {point.type}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedPoint?.id === point.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </div>
                  <h4 className="font-bold text-sm mb-1 truncate">{point.name}</h4>
                  <p className={`text-[10px] truncate ${selectedPoint?.id === point.id ? 'text-white/60' : 'text-slate-400'}`}>
                    {point.address}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 右侧地图区域 */}
      <div className="flex-1 relative bg-slate-100 rounded-[40px] overflow-hidden border border-slate-200 shadow-inner group">
        {/* 模拟地图背景 */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 to-transparent" />
        
        {/* 模拟网格线 */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05 }} />

        {/* 地图标记 */}
        {points.map(point => (
          <motion.button
            key={point.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            onClick={() => setSelectedPoint(point)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group/marker"
            style={{ 
              left: `${((point.lng - 120.1) * 1000) % 100}%`, 
              top: `${((point.lat - 30.2) * 1000) % 100}%` 
            }}
          >
            <div className={`p-2 rounded-full shadow-lg transition-all ${
              selectedPoint?.id === point.id ? 'bg-primary text-white scale-125 ring-4 ring-primary/20' : 'bg-white text-slate-600 hover:bg-slate-900 hover:text-white'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none border border-slate-100">
              {point.name}
            </div>
          </motion.button>
        ))}

        {/* 详情浮层 */}
        <AnimatePresence>
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-6 top-6 bottom-6 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-20"
            >
              <div className="p-6 border-b border-slate-50 relative">
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Trash2 className="w-3 h-3" /> {selectedPoint.type}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedPoint.name}</h3>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {selectedPoint.address}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* 垃圾桶状态 */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">分类桶实时状态</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPoint.bins.map(bin => (
                      <div key={bin.type} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-600">{bin.type}</span>
                          <span className={`text-[10px] font-bold ${bin.status > 80 ? 'text-red-500' : 'text-slate-400'}`}>
                            {bin.status}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${bin.status}%` }}
                            className={`h-full ${getBinColor(bin.type)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 管理信息 */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">管理信息</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">责任人</p>
                          <p className="text-sm font-bold text-slate-900">{selectedPoint.manager}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">联系电话</p>
                          <p className="text-sm font-bold text-slate-900">{selectedPoint.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => navigate(`/sorting/records?pointId=${selectedPoint.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <Navigation className="w-4 h-4" /> 查看投放记录
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 地图控制 */}
        <div className="absolute left-6 bottom-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold">+</button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold">-</button>
        </div>
      </div>
    </div>
  );
};

export default SortingMap;
