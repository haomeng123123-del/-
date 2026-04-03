import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, CheckCircle, Clock, Navigation, Video } from 'lucide-react';
import { queryVehicleAlarms } from '../../api/services/sanitation';
import { VehicleAlarm } from '../../types/sanitation';

const VehicleAlarmPage: React.FC = () => {
  const [alarms, setAlarms] = useState<VehicleAlarm[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await queryVehicleAlarms({ pageNo: 1, pageSize: 50, plateNo: search });
        setAlarms(res.data.list);
      } catch (error) {
        console.error('Failed to fetch vehicle alarms:', error);
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
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">车辆报警管理</h1>
          <p className="text-slate-500 mt-1">处理车辆异常报警信息</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="vehicle-alarm-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="vehicle-alarm-table-list">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-sm">报警时间</th>
                <th className="p-4 font-bold text-slate-500 text-sm">车牌号</th>
                <th className="p-4 font-bold text-slate-500 text-sm">报警类型</th>
                <th className="p-4 font-bold text-slate-500 text-sm">报警级别</th>
                <th className="p-4 font-bold text-slate-500 text-sm">发生位置</th>
                <th className="p-4 font-bold text-slate-500 text-sm">状态</th>
                <th className="p-4 font-bold text-slate-500 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">加载中...</td>
                </tr>
              ) : alarms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">暂无数据</td>
                </tr>
              ) : (
                alarms.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(a.alarmTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{a.plateNo}</td>
                    <td className="p-4 text-slate-600 font-medium">{a.alarmType}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        a.level === '严重' ? 'bg-red-100 text-red-700' :
                        a.level === '一般' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {a.level}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{a.location}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        a.status === '未处理' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => navigate('/vehicles/track')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="轨迹回放" data-testid={`vehicle-alarm-btn-track-${a.id}`}>
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate('/vehicles/video')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="实时视频" data-testid={`vehicle-alarm-btn-video-${a.id}`}>
                        <Video className="w-4 h-4" />
                      </button>
                      {a.status === '未处理' ? (
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="处理" data-testid={`vehicle-alarm-btn-resolve-${a.id}`}>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-bold p-2">已处理</span>
                      )}
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

export default VehicleAlarmPage;
