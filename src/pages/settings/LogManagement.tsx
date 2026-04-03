import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database, Shield, User, Key, Lock, FileText } from 'lucide-react';
import { queryLogs } from '../../api/services/platform';
import { SystemLog } from '../../types/platform';

const LogManagement: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryLogs({});
      setLogs(res.data.list);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="搜索用户名/操作内容" className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
            </div>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              导出日志
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4" />
              清理日志
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">操作时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">操作用户</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">操作内容</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所属模块</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IP地址</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">加载中...</td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.time}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.action}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {item.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status === 'success' ? '成功' : '失败'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
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

export default LogManagement;
