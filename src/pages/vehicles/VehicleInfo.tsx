import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Navigation, Video } from 'lucide-react';
import { queryVehicles } from '../../api/services/sanitation';
import { Vehicle } from '../../types/sanitation';

const VehicleInfo: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicles({ pageNo: 1, pageSize: 50, plateNo: search });
        setVehicles(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
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
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆信息管理</h1>
          <p className="text-slate-500 mt-1">管理环卫车辆档案与基本信息</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-info-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button 
            className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 font-bold text-sm"
            data-testid="vehicle-info-btn-add"
          >
            <Plus className="w-4 h-4" />
            新增车辆
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="vehicle-info-table-list">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-sm">车牌号</th>
                <th className="p-4 font-bold text-slate-500 text-sm">车辆类型</th>
                <th className="p-4 font-bold text-slate-500 text-sm">当前状态</th>
                <th className="p-4 font-bold text-slate-500 text-sm">当前位置</th>
                <th className="p-4 font-bold text-slate-500 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">加载中...</td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">暂无数据</td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{v.plateNo}</td>
                    <td className="p-4 text-slate-600">{v.type}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        v.status === '作业中' ? 'bg-blue-100 text-blue-700' :
                        v.status === '待机' ? 'bg-amber-100 text-amber-700' :
                        v.status === '离线' ? 'bg-slate-100 text-slate-600' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{v.location}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => navigate('/vehicles/track', { state: { plateNo: v.plateNo } })} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="轨迹回放" data-testid={`vehicle-info-btn-track-${v.id}`}>
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate('/vehicles/video', { state: { plateNo: v.plateNo } })} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="实时视频" data-testid={`vehicle-info-btn-video-${v.id}`}>
                        <Video className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="编辑" data-testid={`vehicle-info-btn-edit-${v.id}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除" data-testid={`vehicle-info-btn-delete-${v.id}`}>
                        <Trash2 className="w-4 h-4" />
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

export default VehicleInfo;
