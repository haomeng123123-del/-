import React, { useState } from 'react';
import { Search, Download, Calendar, MapPin, Truck, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionRecord {
  id: string;
  date: string;
  pointName: string;
  vehiclePlate: string;
  company: string;
  type: string;
  weight: number;
  status: string;
}

const CollectionRecordsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('point'); // point, vehicle, region, company, community, station
  const [date, setDate] = useState('');
  const [keyword, setKeyword] = useState('');

  const tabs = [
    { id: 'point', label: '收集点每日记录', icon: MapPin },
    { id: 'vehicle', label: '车辆每日记录', icon: Truck },
    { id: 'region', label: '区域收运记录', icon: MapPin },
    { id: 'company', label: '运营单位记录', icon: Building2 },
    { id: 'community', label: '小区每日记录', icon: Building2 },
    { id: 'station', label: '转运站每日记录', icon: Building2 },
  ];

  const mockRecords: CollectionRecord[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `REC${(i + 1).toString().padStart(4, '0')}`,
    date: `2023-10-27 0${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
    pointName: ['世纪大道收集点', '陆家嘴收集点', '张江高科收集点', '徐家汇收集点'][i % 4],
    vehiclePlate: `沪A${Math.floor(Math.random() * 90000 + 10000)}`,
    company: ['浦东环卫', '徐汇环卫', '静安环卫'][i % 3],
    type: ['厨余垃圾', '其他垃圾', '可回收物', '有害垃圾'][i % 4],
    weight: Number((Math.random() * 5 + 1).toFixed(2)),
    status: 'completed',
  }));

  const handleExport = () => {
    toast.success('导出任务已提交');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-16rem)]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto shrink-0 p-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">记录分类</h3>
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-w-0">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索名称或车牌号..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
              查询
            </button>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" /> 导出记录
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-bottom border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">记录编号</th>
                <th className="px-6 py-4 font-bold text-slate-600">收运时间</th>
                <th className="px-6 py-4 font-bold text-slate-600">
                  {activeTab === 'point' ? '收集点' : activeTab === 'vehicle' ? '车牌号' : activeTab === 'company' ? '运营单位' : '名称'}
                </th>
                <th className="px-6 py-4 font-bold text-slate-600">垃圾种类</th>
                <th className="px-6 py-4 font-bold text-slate-600">重量 (t)</th>
                <th className="px-6 py-4 font-bold text-slate-600">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{rec.id}</td>
                  <td className="px-6 py-4 text-slate-900">{rec.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {activeTab === 'point' ? rec.pointName : activeTab === 'vehicle' ? rec.vehiclePlate : activeTab === 'company' ? rec.company : rec.pointName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      rec.type === '厨余垃圾' ? 'bg-emerald-100 text-emerald-700' : 
                      rec.type === '其他垃圾' ? 'bg-slate-100 text-slate-700' : 
                      rec.type === '可回收物' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {rec.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-primary">{rec.weight}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      已完成
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollectionRecordsTab;
