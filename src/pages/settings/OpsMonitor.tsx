import React from 'react';
import { Activity, Server, Database, Globe, Cpu, Zap, AlertTriangle, CheckCircle2, Clock, RefreshCcw, ChevronRight } from 'lucide-react';

const OpsMonitor: React.FC = () => {
  const services = [
    { name: 'API 网关', status: 'online', latency: '24ms', uptime: '99.99%', load: 12 },
    { name: '核心服务', status: 'online', latency: '45ms', uptime: '99.95%', load: 28 },
    { name: '数据库集群', status: 'online', latency: '5ms', uptime: '100%', load: 15 },
    { name: '缓存服务', status: 'online', latency: '1ms', uptime: '100%', load: 8 },
    { name: '视频流服务', status: 'online', latency: '120ms', uptime: '99.8%', load: 42 },
    { name: '物联网接入', status: 'warning', latency: '350ms', uptime: '98.5%', load: 75 },
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">正常</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CPU 使用率</p>
            <p className="text-3xl font-black text-slate-800 mt-1">24.5%</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '24.5%' }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">正常</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">内存 使用率</p>
            <p className="text-3xl font-black text-slate-800 mt-1">62.8%</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '62.8%' }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">正常</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">磁盘 使用率</p>
            <p className="text-3xl font-black text-slate-800 mt-1">45.2%</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45.2%' }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">警告</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">网络 带宽</p>
            <p className="text-3xl font-black text-slate-800 mt-1">850Mbps</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              服务状态监控
            </h3>
            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{service.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">响应时间: {service.latency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">可用率</p>
                      <p className="text-sm font-bold text-slate-700">{service.uptime}</p>
                    </div>
                    <div className="w-32">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">负载 {service.load}%</p>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${service.load > 70 ? 'bg-orange-500' : 'bg-primary'}`} style={{ width: `${service.load}%` }} />
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              最近运维告警
            </h3>
            <button className="text-xs font-bold text-primary hover:underline">查看历史</button>
          </div>
          <div className="p-6 space-y-6">
            {[
              { time: '10:15:22', level: 'high', msg: '物联网接入服务负载过高 (75%)', status: 'active' },
              { time: '09:45:10', level: 'medium', msg: '数据库集群节点 03 响应延迟增加', status: 'resolved' },
              { time: '08:30:05', level: 'low', msg: '视频流服务证书即将到期 (15天)', status: 'active' },
              { time: '07:12:48', level: 'high', msg: '核心服务内存占用异常波动', status: 'resolved' },
            ].map((alarm, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-1 flex-shrink-0 rounded-full ${alarm.level === 'high' ? 'bg-red-500' : alarm.level === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${alarm.level === 'high' ? 'text-red-500' : alarm.level === 'medium' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {alarm.level === 'high' ? '严重告警' : alarm.level === 'medium' ? '一般告警' : '提示告警'}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">{alarm.time}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-1">{alarm.msg}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${alarm.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {alarm.status === 'active' ? '待处理' : '已解决'}
                    </span>
                    <button className="text-[10px] font-bold text-primary hover:underline">详情</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>一键健康检查</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsMonitor;
