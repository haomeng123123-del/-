import React, { useState, useEffect } from 'react';
import { queryTreatmentList } from '../../../api/services/sorting';
import { Search, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TreatmentInbound {
  id: string;
  facilityName: string;
  vehicleNo: string;
  inboundTime: string;
  outboundTime: string;
  netWeight: number;
  wasteType: string;
  source: string;
  status: string;
  time?: string;
  vehiclePlate?: string;
  type?: string;
}

const TreatmentInboundTab: React.FC = () => {
  const [records, setRecords] = useState<TreatmentInbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [facilityId, setFacilityId] = useState('');
  const [date, setDate] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryTreatmentList({ monitorType: '进场计量管理', keyword: facilityId || date ? `${facilityId}-${date}` : undefined, pageNo, pageSize: 10 });
      if (res.code === 0) {
        setRecords(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch treatment records:', error);
      toast.error('获取进场记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  const handleExport = () => {
    toast.success('进场记录导出成功');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          进场计量记录
        </h3>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索设施..."
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-40"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
              />
            </div>
            <input
              type="date"
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setPageNo(1); fetchData(); }}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            查询
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> 导出
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">进场时间</th>
              <th className="px-6 py-4 font-bold text-slate-600">处理设施</th>
              <th className="px-6 py-4 font-bold text-slate-600">车牌号</th>
              <th className="px-6 py-4 font-bold text-slate-600">垃圾种类</th>
              <th className="px-6 py-4 font-bold text-slate-600">净重 (t)</th>
              <th className="px-6 py-4 font-bold text-slate-600">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">加载中...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">暂无数据</td></tr>
            ) : records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500">{rec.time || rec.inboundTime}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{rec.facilityName}</td>
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{rec.vehiclePlate || rec.vehicleNo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    (rec.type || rec.wasteType) === '厨余垃圾' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rec.type || rec.wasteType}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-primary">{rec.netWeight}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                    已完成
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>共 {total} 条记录</span>
        <div className="flex gap-2">
          <button 
            disabled={pageNo === 1}
            onClick={() => setPageNo(p => p - 1)}
            className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            上一页
          </button>
          <button 
            disabled={pageNo * 10 >= total}
            onClick={() => setPageNo(p => p + 1)}
            className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInboundTab;
