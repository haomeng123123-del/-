import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryToiletMapList } from '../../api/services/facility';
import { ToiletMapPoint } from '../../types/facility';
import { MapPin, AlertTriangle, WifiOff, Search, Info, Phone, Clock, User, Navigation } from 'lucide-react';

const ToiletMap: React.FC = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState<ToiletMapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToilet, setSelectedToilet] = useState<ToiletMapPoint | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await queryToiletMapList({});
        setPoints(res.data);
      } catch (error) {
        console.error('Failed to fetch map points:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  const filteredPoints = points.filter(p => 
    p.toiletName.includes(searchTerm) || p.location.includes(searchTerm)
  );

  if (loading) return <div className="p-8 text-center text-slate-500">加载地图数据中...</div>;

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      {/* 左侧列表面板 */}
      <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索公厕名称或地址..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPoints.map(point => (
            <div 
              key={point.toiletId}
              onClick={() => setSelectedToilet(point)}
              className={`p-3 rounded-2xl cursor-pointer transition-all ${
                selectedToilet?.toiletId === point.toiletId 
                ? 'bg-primary/10 border-primary/20' 
                : 'hover:bg-slate-50 border-transparent'
              } border`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{point.toiletName}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  point.status === 'normal' ? 'bg-emerald-100 text-emerald-600' :
                  point.status === 'alarm' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {point.status === 'normal' ? '在线' : point.status === 'alarm' ? '报警' : '离线'}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{point.location}</p>
              <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                <span>异味: <span className="text-slate-700 font-bold">{point.odorLevel}</span></span>
                <span>客流: <span className="text-slate-700 font-bold">{point.passengerFlow}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 中间地图区域 */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 opacity-20" style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* 模拟地图点位 */}
        {filteredPoints.map((point) => (
          <div 
            key={point.toiletId}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            style={{ 
              left: `${(point.longitude - 121.36) * 1000}%`, 
              top: `${(point.latitude - 31.17) * 1000}%` 
            }}
            onClick={() => setSelectedToilet(point)}
          >
            <div className={`p-2 rounded-full shadow-lg transition-transform hover:scale-110 ${
              point.status === 'normal' ? 'bg-emerald-500' :
              point.status === 'alarm' ? 'bg-red-500' : 'bg-slate-400'
            } text-white ${selectedToilet?.toiletId === point.toiletId ? 'ring-4 ring-primary/30 scale-125' : ''}`}>
              {point.status === 'normal' && <MapPin className="w-4 h-4" />}
              {point.status === 'alarm' && <AlertTriangle className="w-4 h-4" />}
              {point.status === 'offline' && <WifiOff className="w-4 h-4" />}
            </div>
          </div>
        ))}

        {/* 图例 */}
        <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-lg flex gap-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-slate-600">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[10px] text-slate-600">报警</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <span className="text-[10px] text-slate-600">离线</span>
          </div>
        </div>
      </div>

      {/* 右侧详情面板 */}
      {selectedToilet && (
        <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-6 bg-slate-50/50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900">{selectedToilet.toiletName}</h3>
              <button 
                onClick={() => setSelectedToilet(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              selectedToilet.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
              selectedToilet.status === 'alarm' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                selectedToilet.status === 'normal' ? 'bg-emerald-500' :
                selectedToilet.status === 'alarm' ? 'bg-red-500' : 'bg-slate-500'
              }`}></div>
              {selectedToilet.status === 'normal' ? '运行中' : selectedToilet.status === 'alarm' ? '异常报警' : '设备离线'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-3 h-3" /> 基本信息
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">详细地址</p>
                    <p className="text-sm text-slate-700">{selectedToilet.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">负责人</p>
                    <p className="text-sm text-slate-700">{selectedToilet.contact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">联系电话</p>
                    <p className="text-sm text-slate-700">{selectedToilet.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">开放时间</p>
                    <p className="text-sm text-slate-700">{selectedToilet.openTime}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> 实时监测
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-400 mb-1">异味浓度</p>
                  <p className="text-lg font-bold text-slate-900">{selectedToilet.odorLevel}<span className="text-xs font-normal text-slate-400 ml-1">ppm</span></p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-400 mb-1">今日客流</p>
                  <p className="text-lg font-bold text-slate-900">{selectedToilet.passengerFlow}<span className="text-xs font-normal text-slate-400 ml-1">人次</span></p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">配套设施</h4>
              <div className="flex flex-wrap gap-2">
                {selectedToilet.facilities.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px]">{f}</span>
                ))}
              </div>
            </section>

            <button 
              onClick={() => navigate(`/facility/monitor?id=${selectedToilet.toiletId}`)}
              className="w-full py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              查看实时监控
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToiletMap;
