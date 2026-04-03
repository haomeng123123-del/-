import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, XCircle, Filter, Search, Download, Droplets, X, ArrowRight, Video, Scale } from 'lucide-react';
import { queryEquipmentOperationRecords, queryDrainageRecords } from '../../api/services/transfer';
import { EquipmentOperationRecord, DrainageRecord } from '../../types/transfer';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Operation: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStation = searchParams.get('stationId') || '';

  const [records, setRecords] = useState<EquipmentOperationRecord[]>([]);
  const [drainage, setDrainage] = useState<DrainageRecord[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedStation, setSelectedStation] = useState(initialStation);
  const [activeTab, setActiveTab] = useState<'equipment' | 'drainage'>('equipment');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOperationRecord | null>(null);
  const [selectedDrainage, setSelectedDrainage] = useState<DrainageRecord | null>(null);

  useEffect(() => {
    queryEquipmentOperationRecords({ 
      pageNo: 1, 
      pageSize: 15, 
      equipmentType: typeFilter === 'all' ? undefined : typeFilter,
      stationId: selectedStation || undefined
    }).then(res => {
      if (res.code === 0) setRecords(res.data.list);
    });
    queryDrainageRecords({ 
      pageNo: 1, 
      pageSize: 15,
      stationId: selectedStation || undefined
    }).then(res => {
      if (res.code === 0) setDrainage(res.data.list);
    });
  }, [typeFilter, selectedStation]);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedStation(val);
    if (val) {
      setSearchParams({ stationId: val });
    } else {
      setSearchParams({});
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'normal': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> 正常</span>;
      case 'warning': return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold"><AlertTriangle className="w-3 h-3" /> 预警</span>;
      case 'error': case 'alarm': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3 h-3" /> 故障/报警</span>;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'compressor': return '压缩机';
      case 'deodorizer': return '除尘除臭塔';
      case 'catalysis': return '光氧催化设备';
      default: return type;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">运行监管</h1>
          <p className="text-slate-500 mt-1">转运站设备实时工况与排水指标监测</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none"
              value={selectedStation}
              onChange={handleStationChange}
            >
              <option value="">全部转运站</option>
              {Array.from({ length: 15 }).map((_, i) => (
                <option key={i} value={`转运站${i + 1}`}>转运站{i + 1}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'equipment' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              设备运行
            </button>
            <button 
              onClick={() => setActiveTab('drainage')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'drainage' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              排水监测
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> 压缩机运行状态
          </h4>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-emerald-500">42/45</span>
            <span className="text-xs text-slate-400 mb-1">在线/总数</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '93%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> 除臭系统状态
          </h4>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-emerald-500">15/15</span>
            <span className="text-xs text-slate-400 mb-1">在线/总数</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" /> 排水实时流量
          </h4>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-blue-500">12.5</span>
            <span className="text-xs text-slate-400 mb-1">m³/h</span>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> 今日报警记录
          </h4>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-orange-500">3</span>
            <span className="text-xs text-slate-400 mb-1">条未处理</span>
          </div>
          <div className="mt-4 flex gap-1">
            <span className="w-full h-1.5 bg-red-500 rounded-full"></span>
            <span className="w-full h-1.5 bg-orange-500 rounded-full"></span>
            <span className="w-full h-1.5 bg-orange-500 rounded-full"></span>
            <span className="w-full h-1.5 bg-slate-100 rounded-full"></span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">
            {activeTab === 'equipment' ? '设备运行记录' : '排水监测数据'}
          </h3>
          <div className="flex gap-4">
            {activeTab === 'equipment' && (
              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">全部设备</option>
                <option value="compressor">压缩机</option>
                <option value="deodorizer">除尘除臭塔</option>
                <option value="catalysis">光氧催化设备</option>
              </select>
            )}
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          {activeTab === 'equipment' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-bold">编号</th>
                  <th className="p-4 font-bold">设备名称</th>
                  <th className="p-4 font-bold">类型</th>
                  <th className="p-4 font-bold">所属转运站</th>
                  <th className="p-4 font-bold">记录时间</th>
                  <th className="p-4 font-bold">状态</th>
                  <th className="p-4 font-bold">详情</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row) => (
                  <tr 
                    key={row.recordId} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedEquipment(row)}
                  >
                    <td className="p-4 font-mono text-sm text-slate-600">{row.recordId}</td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      {row.equipmentName}
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="p-4 text-sm text-slate-600">{getTypeLabel(row.equipmentType)}</td>
                    <td className="p-4 text-sm text-slate-600">{row.stationName}</td>
                    <td className="p-4 text-sm text-slate-600">{row.recordTime}</td>
                    <td className="p-4">{getStatusBadge(row.status)}</td>
                    <td className="p-4 text-sm text-slate-500">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="p-4 font-bold">编号</th>
                  <th className="p-4 font-bold">转运站</th>
                  <th className="p-4 font-bold">监测时间</th>
                  <th className="p-4 font-bold text-right">流量(m³/h)</th>
                  <th className="p-4 font-bold text-right">pH值</th>
                  <th className="p-4 font-bold text-right">COD(mg/L)</th>
                  <th className="p-4 font-bold text-right">氨氮(mg/L)</th>
                  <th className="p-4 font-bold">状态</th>
                </tr>
              </thead>
              <tbody>
                {drainage.map((row) => (
                  <tr 
                    key={row.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedDrainage(row)}
                  >
                    <td className="p-4 font-mono text-sm text-slate-600">{row.id}</td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      {row.stationName}
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="p-4 text-sm text-slate-600">{row.time}</td>
                    <td className="p-4 text-right font-mono text-slate-600">{row.flowRate}</td>
                    <td className="p-4 text-right font-mono text-slate-600">{row.ph}</td>
                    <td className="p-4 text-right font-mono text-slate-600">{row.cod}</td>
                    <td className="p-4 text-right font-mono text-slate-600">{row.ammonia}</td>
                    <td className="p-4">{getStatusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedEquipment.equipmentName}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{selectedEquipment.recordId}</p>
              </div>
              <button 
                onClick={() => setSelectedEquipment(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">设备类型</p>
                  <p className="text-base font-medium text-slate-700">{getTypeLabel(selectedEquipment.equipmentType)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">所属转运站</p>
                  <p className="text-base font-medium text-slate-700">{selectedEquipment.stationName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">记录时间</p>
                  <p className="text-base font-mono text-slate-700">{selectedEquipment.recordTime}</p>
                </div>
              </div>
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">当前状态</p>
                  <div className="mt-1">{getStatusBadge(selectedEquipment.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">详细信息</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedEquipment.details}</p>
                </div>
                {selectedEquipment.status !== 'normal' && (
                  <div className="pt-4 border-t border-slate-200">
                    <button className="w-full bg-primary text-white py-2 rounded-xl font-bold hover:bg-primary-container transition-colors">
                      创建维修工单
                    </button>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/video?stationId=${selectedEquipment.stationName}`)}
                  >
                    <Video className="w-4 h-4" /> 监控抓拍
                  </button>
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/measurement?stationId=${selectedEquipment.stationName}`)}
                  >
                    <Scale className="w-4 h-4" /> 计量记录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drainage Detail Modal */}
      {selectedDrainage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedDrainage.stationName} - 排水监测</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{selectedDrainage.id}</p>
              </div>
              <button 
                onClick={() => setSelectedDrainage(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">监测时间</p>
                  <p className="text-base font-mono text-slate-700">{selectedDrainage.time}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">状态</p>
                  <div className="mt-1">{getStatusBadge(selectedDrainage.status)}</div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/video?stationId=${selectedDrainage.stationName}`)}
                  >
                    <Video className="w-4 h-4" /> 监控抓拍
                  </button>
                  <button 
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => navigate(`/transfer/measurement?stationId=${selectedDrainage.stationName}`)}
                  >
                    <Scale className="w-4 h-4" /> 计量记录
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">流量 (m³/h)</p>
                  <p className="text-2xl font-mono text-blue-600">{selectedDrainage.flowRate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">pH值</p>
                  <p className="text-xl font-mono text-slate-700">{selectedDrainage.ph}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">COD (mg/L)</p>
                  <p className="text-xl font-mono text-slate-700">{selectedDrainage.cod}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">氨氮 (mg/L)</p>
                  <p className="text-xl font-mono text-slate-700">{selectedDrainage.ammonia}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operation;
