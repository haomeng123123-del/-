import React, { useState, useEffect } from 'react';
import { Cpu, Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database, Shield, Share2 } from 'lucide-react';
import { queryIoTDevices, queryIoTAlarms } from '../../api/services/platform';
import { IoTDevice, IoTAlarm } from '../../types/platform';

const IoTPlatform: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('devices');
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [alarms, setAlarms] = useState<IoTAlarm[]>([]);
  const [loading, setLoading] = useState(true);

  const subTabs = [
    { id: 'validation', label: '接入验证', icon: Shield },
    { id: 'devices', label: '设备管理', icon: Cpu },
    { id: 'alarms', label: '报警管理', icon: AlertCircle },
    { id: 'service', label: '对外服务', icon: Share2 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'devices') {
        const res = await queryIoTDevices({});
        setDevices(res.data.list);
      } else if (activeSubTab === 'alarms') {
        const res = await queryIoTAlarms({});
        setAlarms(res.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch IoT data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'offline': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'error': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getAlarmLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="搜索设备名称/ID" className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
            </div>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
              <Plus className="w-4 h-4" />
              新增设备
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {activeSubTab === 'devices' ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">设备名称</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">类型</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">最后心跳</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">位置</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">实时数据</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报警时间</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">设备名称</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报警类型</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">级别</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">报警信息</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                  </>
                )}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">加载中...</td>
                </tr>
              ) : activeSubTab === 'devices' ? (
                devices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {item.type === 'sensor' ? '传感器' : item.type === 'tracker' ? '追踪器' : item.type === 'camera' ? '摄像头' : '地磅'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'online' ? 'bg-emerald-500' : item.status === 'offline' ? 'bg-slate-400' : 'bg-red-500'}`} />
                        {item.status === 'online' ? '在线' : item.status === 'offline' ? '离线' : '异常'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.lastHeartbeat}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(item.data).map(([key, val]) => (
                          <span key={key} className="text-[10px] font-mono bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                alarms.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.time}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.deviceName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.type === 'offline' ? '离线报警' : item.type === 'threshold' ? '阈值报警' : '防拆报警'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getAlarmLevelColor(item.level)}`}>
                        {item.level === 'high' ? '严重' : item.level === 'medium' ? '一般' : '提示'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.message}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {item.status === 'active' ? '未处理' : '已恢复'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default IoTPlatform;
