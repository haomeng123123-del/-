import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, Calendar, MapPin, Navigation, Video } from 'lucide-react';
import { queryVehicleOperations } from '../../api/services/sanitation';
import { VehicleOperation } from '../../types/sanitation';

const VehicleOperationPage: React.FC = () => {
  const [operations, setOperations] = useState<VehicleOperation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicleOperations({ pageNo: 1, pageSize: 50, plateNo: search });
        setOperations(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicle operations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆作业监控</h1>
          <p className="text-slate-500 mt-1">监控车辆作业状态与完成情况</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-operation-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="vehicle-operation-table-list">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-sm">车牌号</th>
                <th className="p-4 font-bold text-slate-500 text-sm">驾驶员</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业区域</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业时间</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业里程</th>
                <th className="p-4 font-bold text-slate-500 text-sm">状态</th>
                <th className="p-4 font-bold text-slate-500 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">加载中...</td>
                </tr>
              ) : operations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">暂无数据</td>
                </tr>
              ) : (
                operations.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{o.plateNo}</td>
                    <td className="p-4 text-slate-600">{o.driver}</td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {o.workArea}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(o.startTime).toLocaleTimeString()} - {new Date(o.endTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono">{o.mileage} km</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        o.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                        o.status === '已完成' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => navigate('/vehicles/track')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="轨迹回放" data-testid={`vehicle-op-btn-track-${o.id}`}>
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate('/vehicles/video')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="实时视频" data-testid={`vehicle-op-btn-video-${o.id}`}>
                        <Video className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleOperationPage;
