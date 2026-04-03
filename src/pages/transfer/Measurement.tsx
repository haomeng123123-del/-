import React, { useState, useEffect } from 'react';
import { Scale, Truck, Activity, Search, Download, ArrowRight, Building2, Filter, X, ChevronLeft, ChevronRight, Video, Settings } from 'lucide-react';
import { queryVehicleMeasurementRecords, queryFlowCorrelations } from '../../api/services/transfer';
import { VehicleMeasurementRecord, FlowCorrelation } from '../../types/transfer';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Measurement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStation = searchParams.get('stationId') || '';
  
  const [records, setRecords] = useState<VehicleMeasurementRecord[]>([]);
  const [correlations, setCorrelations] = useState<FlowCorrelation[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStation, setSelectedStation] = useState(initialStation);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;
  const [selectedRecord, setSelectedRecord] = useState<VehicleMeasurementRecord | null>(null);

  useEffect(() => {
    queryVehicleMeasurementRecords({ 
      pageNo, 
      pageSize,
      plateNo: search,
      stationId: selectedStation || undefined
    }).then(res => {
      if (res.code === 0) {
        setRecords(res.data.list);
        setTotal(res.data.total);
      }
    });
    queryFlowCorrelations().then(res => {
      if (res.code === 0) setCorrelations(res.data);
    });
  }, [search, selectedStation, pageNo]);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedStation(val);
    setPageNo(1);
    if (val) {
      setSearchParams({ stationId: val });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">垃圾计量管理</h1>
          <p className="text-slate-500 mt-1">地磅数据在线采集与收运全过程关联展示</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none"
              value={selectedStation}
              onChange={handleStationChange}
            >
              <option value="">全部转运站</option>
              {Array.from({ length: 15 }).map((_, i) => (
                <option key={i} value={`转运站${i + 1}`}>转运站{i + 1}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索车牌号..."
              value={search}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Scale className="w-5 h-5" />
            手动录入
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">今日累计进站车次</p>
            <p className="text-3xl font-black text-slate-800 font-headline">1,452</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">今日累计称重 (吨)</p>
            <p className="text-3xl font-black text-slate-800 font-headline">4,285.6</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">地磅设备在线率</p>
            <p className="text-3xl font-black text-slate-800 font-headline">98.5%</p>
          </div>
        </div>
      </div>

      {/* Flow Correlation View */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          收运全过程关联展示
        </h3>
        <div className="relative h-[200px] flex items-center justify-between px-12">
          {/* Source Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">产生源 (区域)</div>
            {['普陀区', '徐汇区', '长宁区', '静安区'].map(region => (
              <div key={region} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                {region}
              </div>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-px bg-slate-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-1 border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 shadow-sm">
                  收运过程
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">转运设施</div>
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs text-primary font-bold">全区转运站</p>
                <p className="text-lg font-black text-primary">15 座</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-px bg-slate-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-1 border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 shadow-sm">
                  外运处置
                </div>
              </div>
            </div>
          </div>

          {/* Target Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">处置终端</div>
            {['焚烧厂A', '焚烧厂C', '填埋场B'].map(target => (
              <div key={target} className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-sm font-bold text-emerald-700 shadow-sm">
                {target}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">车辆进站明细表</h3>
          <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
            <Download className="w-4 h-4" /> 导出 Excel
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-bold">流水号</th>
                <th className="p-4 font-bold">车牌号</th>
                <th className="p-4 font-bold">转运站</th>
                <th className="p-4 font-bold">进站时间</th>
                <th className="p-4 font-bold">出站时间</th>
                <th className="p-4 font-bold text-right">毛重(吨)</th>
                <th className="p-4 font-bold text-right">皮重(吨)</th>
                <th className="p-4 font-bold text-right">净重(吨)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr 
                  key={row.recordId} 
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedRecord(row)}
                >
                  <td className="p-4 font-mono text-sm text-slate-600">{row.recordId}</td>
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{row.plateNo}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="p-4 text-sm text-slate-600">{row.stationName}</td>
                  <td className="p-4 text-sm text-slate-600">{row.entryTime}</td>
                  <td className="p-4 text-sm text-slate-600">{row.exitTime}</td>
                  <td className="p-4 text-right font-mono text-slate-600">{row.grossWeight}</td>
                  <td className="p-4 text-right font-mono text-slate-600">{row.tareWeight}</td>
                  <td className="p-4 text-right font-bold text-emerald-600">{row.netWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            共 <span className="font-bold text-slate-700">{total}</span> 条记录
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pageNo === 1}
              onClick={() => setPageNo(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600 font-medium px-2">
              {pageNo} / {totalPages || 1}
            </span>
            <button 
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pageNo === totalPages || totalPages === 0}
              onClick={() => setPageNo(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">计量记录详情</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{selectedRecord.recordId}</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">车牌号</p>
                  <p className="text-lg font-bold text-slate-800">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{selectedRecord.plateNo}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">转运站</p>
                  <p className="text-base font-medium text-slate-700">{selectedRecord.stationName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">进站时间</p>
                  <p className="text-base font-mono text-slate-700">{selectedRecord.entryTime}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">出站时间</p>
                  <p className="text-base font-mono text-slate-700">{selectedRecord.exitTime}</p>
                </div>
              </div>
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">毛重 (吨)</p>
                  <p className="text-xl font-mono text-slate-700">{selectedRecord.grossWeight}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">皮重 (吨)</p>
                  <p className="text-xl font-mono text-slate-700">{selectedRecord.tareWeight}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">净重 (吨)</p>
                  <p className="text-3xl font-black text-emerald-600">{selectedRecord.netWeight}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/video?stationId=${selectedRecord.stationName}`)}
                  >
                    <Video className="w-4 h-4" /> 监控抓拍
                  </button>
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/operation?stationId=${selectedRecord.stationName}`)}
                  >
                    <Settings className="w-4 h-4" /> 站内设备
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Measurement;
