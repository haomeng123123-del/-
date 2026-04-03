import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryDisposalFacilities } from '../../api/services/facility';
import { DisposalFacility } from '../../types/facility';
import { MapPin, Search, Filter, Info, Phone, User, Navigation, Activity, Trash2, Flame, Recycle, ShieldAlert, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DisposalMap: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<DisposalFacility[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryDisposalFacilities();
        setFacilities(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0].id);
      } catch (error) {
        console.error('Failed to fetch disposal facilities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedFacility = facilities.find(f => f.id === selectedId);
  const filteredFacilities = facilities.filter(f => f.name.includes(searchQuery));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incineration': return <Flame className="w-4 h-4" />;
      case 'landfill': return <Trash2 className="w-4 h-4" />;
      case 'composting': return <Recycle className="w-4 h-4" />;
      case 'hazardous': return <ShieldAlert className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-500';
      case 'maintenance': return 'bg-amber-500';
      case 'alarm': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      {/* 左侧列表 */}
      <div className="w-80 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            终端设施列表
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索设施名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredFacilities.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selectedId === f.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm truncate flex-1">{f.name}</span>
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${selectedId === f.id ? 'bg-white' : getStatusColor(f.status)}`} />
              </div>
              <div className="flex items-center gap-2 text-[10px] opacity-80">
                {getTypeIcon(f.type)}
                <span>{f.type === 'incineration' ? '焚烧发电' : f.type === 'landfill' ? '卫生填埋' : f.type === 'composting' ? '厨余处理' : '危废处理'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 中间地图模拟 */}
      <div className="flex-1 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-inner">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* 模拟地图标记 */}
        {filteredFacilities.map(f => (
          <motion.button
            key={f.id}
            onClick={() => setSelectedId(f.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${(f.lng - 119.8) * 100}%`, top: `${(30.5 - f.lat) * 100}%` }}
            whileHover={{ scale: 1.2 }}
          >
            <div className={`p-2 rounded-full shadow-lg transition-all ${
              selectedId === f.id ? 'bg-primary text-white scale-125' : 'bg-white text-slate-600 group-hover:bg-slate-50'
            }`}>
              {getTypeIcon(f.type)}
            </div>
            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm transition-all ${
              selectedId === f.id ? 'bg-slate-900 text-white opacity-100' : 'bg-white text-slate-600 opacity-0 group-hover:opacity-100'
            }`}>
              {f.name}
            </div>
          </motion.button>
        ))}

        {/* 地图图例 */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">设施图例</p>
          {[
            { label: '焚烧发电', icon: Flame, color: 'text-orange-500' },
            { label: '卫生填埋', icon: Trash2, color: 'text-slate-500' },
            { label: '厨余处理', icon: Recycle, color: 'text-emerald-500' },
            { label: '危废处理', icon: ShieldAlert, color: 'text-red-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-slate-600">
              <item.icon className={`w-3 h-3 ${item.color}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧详情 */}
      <AnimatePresence mode="wait">
        {selectedFacility && (
          <motion.div
            key={selectedFacility.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-80 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6"
          >
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white ${getStatusColor(selectedFacility.status)}`}>
                <Activity className="w-3 h-3" />
                {selectedFacility.status === 'normal' ? '运行中' : selectedFacility.status === 'maintenance' ? '维护中' : '异常告警'}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedFacility.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {selectedFacility.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold mb-1">设计负荷</p>
                <p className="text-lg font-bold text-slate-900">{selectedFacility.capacity}<span className="text-[10px] ml-1">t/d</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold mb-1">当前负荷</p>
                <p className="text-lg font-bold text-primary">{selectedFacility.currentLoad}<span className="text-[10px] ml-1">t/d</span></p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">联系信息</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">负责人</p>
                    <p className="font-bold">{selectedFacility.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">联系电话</p>
                    <p className="font-bold font-mono">{selectedFacility.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(`/disposal/monitor?id=${selectedFacility.id}`)}
                className="py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                实时监控
              </button>
              <button 
                onClick={() => navigate(`/disposal/records?facilityId=${selectedFacility.id}`)}
                className="py-3 bg-slate-100 text-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <ListIcon className="w-4 h-4" />
                处置记录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisposalMap;
