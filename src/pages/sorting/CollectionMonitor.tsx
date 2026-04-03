import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Edit, Trash2, Map, Calendar, FileText, BarChart2 } from 'lucide-react';
import { queryCollectionList, addCollectionPlan } from '../../api/services/sorting';
import { CollectionRecord } from '../../types/sorting';
import Modal from '../../components/common/Modal';

const monitorTypes = [
  { id: '实时监测', icon: Map },
  { id: '收运计划', icon: Calendar },
  { id: '收运记录', icon: FileText },
  { id: '汇总统计', icon: BarChart2 },
];

const CollectionMonitor: React.FC = () => {
  const [activeType, setActiveType] = useState('实时监测');
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CollectionRecord | null>(null);

  // Form State
  const [planData, setPlanData] = useState({ pointName: '', vehiclePlate: '', wasteType: '厨余垃圾', time: '' });

  useEffect(() => {
    fetchData();
  }, [activeType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryCollectionList({ monitorType: activeType, keyword, pageNo: 1, pageSize: 10 });
      setRecords(res.data.list);
    } catch (error) {
      console.error('Failed to fetch collection monitor list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    setPlanData({ pointName: '', vehiclePlate: '', wasteType: '厨余垃圾', time: '' });
    setIsAddPlanModalOpen(true);
  };

  const submitPlan = async () => {
    try {
      await addCollectionPlan(planData);
      alert('新增计划成功');
      setIsAddPlanModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add plan:', error);
      alert('新增计划失败');
    }
  };

  const handleViewDetails = (record: CollectionRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
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
                data-testid={`sorting-collection-btn-type-${type.id}`}
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
                data-testid="sorting-collection-input-search"
                placeholder="搜索收集点或车牌号..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
              />
            </div>
            <button onClick={fetchData} data-testid="sorting-collection-btn-search" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              查询
            </button>
          </div>
          <div className="flex items-center gap-2">
            {activeType === '收运计划' && (
              <button onClick={handleAddPlan} data-testid="sorting-collection-btn-add" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors">
                <Plus className="w-4 h-4" />
                新增计划
              </button>
            )}
            <button data-testid="sorting-collection-btn-export" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
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
                  <th className="p-4">收集点名称</th>
                  <th className="p-4">收运车辆</th>
                  <th className="p-4">垃圾类型</th>
                  <th className="p-4">收运重量(kg)</th>
                  <th className="p-4">收运时间</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">{record.id}</td>
                    <td className="p-4 font-bold text-slate-900">{record.pointName}</td>
                    <td className="p-4 text-slate-600">{record.vehiclePlate}</td>
                    <td className="p-4 text-slate-600">{record.wasteType}</td>
                    <td className="p-4 text-slate-600">{record.weight}</td>
                    <td className="p-4 text-slate-600">{record.collectionTime}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        record.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetails(record)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="详情">
                          <FileText className="w-4 h-4" />
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

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddPlanModalOpen}
        onClose={() => setIsAddPlanModalOpen(false)}
        title="新增收运计划"
        footer={
          <>
            <button onClick={() => setIsAddPlanModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors">取消</button>
            <button onClick={submitPlan} className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors">确定</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">收集点名称</label>
            <input type="text" value={planData.pointName} onChange={e => setPlanData({...planData, pointName: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入收集点名称" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">收运车辆</label>
            <input type="text" value={planData.vehiclePlate} onChange={e => setPlanData({...planData, vehiclePlate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入车牌号" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">垃圾类型</label>
              <select value={planData.wasteType} onChange={e => setPlanData({...planData, wasteType: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="厨余垃圾">厨余垃圾</option>
                <option value="可回收物">可回收物</option>
                <option value="有害垃圾">有害垃圾</option>
                <option value="其他垃圾">其他垃圾</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">计划时间</label>
              <input type="datetime-local" value={planData.time} onChange={e => setPlanData({...planData, time: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="收运详情"
        footer={
          <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors">关闭</button>
        }
      >
        {selectedRecord && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-400 mb-1">收集点名称</span>
                <span className="font-bold text-slate-900">{selectedRecord.pointName}</span>
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
                <span className="block text-slate-400 mb-1">收运重量</span>
                <span className="font-bold text-slate-900">{selectedRecord.weight} kg</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">收运时间</span>
                <span className="font-bold text-slate-900">{selectedRecord.collectionTime}</span>
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
    </div>
  );
};

export default CollectionMonitor;
