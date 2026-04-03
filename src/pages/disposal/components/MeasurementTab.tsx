import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scale, Search, Filter, Eye, X, Download } from 'lucide-react';
import { MeasurementRecord, MeasurementStats } from '../../../types/disposal';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface MeasurementTabProps {
  records: MeasurementRecord[];
  stats: MeasurementStats;
  plantTypeLabel: string;
}

const MeasurementTab: React.FC<MeasurementTabProps> = ({ records, stats, plantTypeLabel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MeasurementRecord | null>(null);

  const handleExport = () => {
    toast.success('报表导出成功');
  };

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Scale className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">今日进场总车次</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalVehicles} <span className="text-sm font-normal text-slate-500">次</span></p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Scale className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">今日进场总垃圾量</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalWeight} <span className="text-sm font-normal text-slate-500">吨</span></p>
          </div>
        </div>
      </div>

      {/* 垃圾计量统计图表 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">各{plantTypeLabel}进场垃圾量</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byPlant}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="weight" name="垃圾量 (吨)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 进场明细列表 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900">{plantTypeLabel}进场明细报表</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索车牌号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">进场时间</th>
                <th className="p-4">{plantTypeLabel}名称</th>
                <th className="p-4">车牌号</th>
                <th className="p-4">毛重(吨)</th>
                <th className="p-4">皮重(吨)</th>
                <th className="p-4">净重(吨)</th>
                <th className="p-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {records.filter(r => r.vehiclePlate.includes(searchTerm)).map((record) => (
                <tr key={record.recordId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600">{record.inTime}</td>
                  <td className="p-4 font-bold text-slate-900">{record.plantName}</td>
                  <td className="p-4 text-slate-600">{record.vehiclePlate}</td>
                  <td className="p-4 text-slate-600">{record.grossWeight}</td>
                  <td className="p-4 text-slate-600">{record.tareWeight}</td>
                  <td className="p-4 font-bold text-emerald-600">{record.netWeight}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">计量记录详情</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-1">记录ID</p>
                    <p className="font-bold text-slate-900">{selectedRecord.recordId}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-1">车牌号</p>
                    <p className="font-bold text-slate-900">{selectedRecord.vehiclePlate}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-1">{plantTypeLabel}名称</p>
                    <p className="font-bold text-slate-900">{selectedRecord.plantName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-1">进场时间</p>
                    <p className="font-bold text-slate-900">{selectedRecord.inTime}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-1">出场时间</p>
                    <p className="font-bold text-slate-900">{selectedRecord.outTime}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-sm text-emerald-600 mb-1">净重 (吨)</p>
                    <p className="font-black text-emerald-700 text-xl">{selectedRecord.netWeight}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <div className="flex-1 p-4 border border-slate-100 rounded-2xl text-center">
                    <p className="text-sm text-slate-500 mb-1">毛重</p>
                    <p className="font-bold text-slate-900">{selectedRecord.grossWeight} 吨</p>
                  </div>
                  <div className="flex-1 p-4 border border-slate-100 rounded-2xl text-center">
                    <p className="text-sm text-slate-500 mb-1">皮重</p>
                    <p className="font-bold text-slate-900">{selectedRecord.tareWeight} 吨</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeasurementTab;
