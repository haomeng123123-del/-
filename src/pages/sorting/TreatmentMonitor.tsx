import React, { useState, useEffect } from 'react';
import { Search, Download, Scale, Video, FileText, PlayCircle } from 'lucide-react';
import { queryTreatmentList } from '../../api/services/sorting';
import { TreatmentRecord } from '../../types/sorting';
import Modal from '../../components/common/Modal';

const monitorTypes = [
  { id: '进场计量管理', icon: Scale },
  { id: '视频监控管理', icon: Video },
];

const TreatmentMonitor: React.FC = () => {
  const [activeType, setActiveType] = useState('进场计量管理');
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<TreatmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TreatmentRecord | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryTreatmentList({ monitorType: activeType, keyword, pageNo: 1, pageSize: 10 });
      setRecords(res.data.list);
    } catch (error) {
      console.error('Failed to fetch treatment monitor list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: TreatmentRecord) => {
    setSelectedRecord(record);
    if (activeType === '视频监控管理') {
      setIsVideoModalOpen(true);
    } else {
      setIsDetailModalOpen(true);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar for Monitor Types */}
      <div className="w-64 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">监管模块</h3>
        <div className="space-y-1">
          {monitorTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                data-testid={`sorting-treatment-btn-type-${type.id}`}
                onClick={() => setActiveType(type.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeType === type.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                data-testid="sorting-treatment-input-search"
                placeholder="搜索处理设施或车牌号..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
              />
            </div>
            <button onClick={fetchData} data-testid="sorting-treatment-btn-search" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              查询
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="sorting-treatment-btn-export" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400">加载中...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white">
                  <th className="p-4">编号</th>
                  <th className="p-4">处理设施名称</th>
                  <th className="p-4">收运车辆</th>
                  <th className="p-4">垃圾类型</th>
                  <th className="p-4">进场重量(kg)</th>
                  <th className="p-4">进场时间</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">{record.id}</td>
                    <td className="p-4 font-bold text-slate-900">{record.facilityName}</td>
                    <td className="p-4 text-slate-600">{record.vehiclePlate}</td>
                    <td className="p-4 text-slate-600">{record.wasteType}</td>
                    <td className="p-4 text-slate-600">{record.weight}</td>
                    <td className="p-4 text-slate-600">{record.entryTime}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        record.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetails(record)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={activeType === '视频监控管理' ? '查看监控' : '详情'}>
                          {activeType === '视频监控管理' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="进场计量详情"
        footer={
          <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors">关闭</button>
        }
      >
        {selectedRecord && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-400 mb-1">处理设施名称</span>
                <span className="font-bold text-slate-900">{selectedRecord.facilityName}</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">收运车辆</span>
                <span className="font-bold text-slate-900">{selectedRecord.vehiclePlate}</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">垃圾类型</span>
                <span className="font-bold text-slate-900">{selectedRecord.wasteType}</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">进场重量</span>
                <span className="font-bold text-slate-900">{selectedRecord.weight} kg</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">进场时间</span>
                <span className="font-bold text-slate-900">{selectedRecord.entryTime}</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">状态</span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold inline-block ${
                  selectedRecord.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedRecord.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Video Player Modal */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="视频监控"
        width="max-w-4xl"
        footer={
          <button onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors">关闭</button>
        }
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="block text-xs text-slate-400 mb-1">监控点位</span>
                <span className="font-bold text-slate-900">{selectedRecord.facilityName} - 入口监控</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-1">当前状态</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  在线
                </span>
              </div>
            </div>
            
            {/* Mock Video Player */}
            <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white transition-colors cursor-pointer" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/80 text-xs font-mono">
                <span>LIVE</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TreatmentMonitor;
