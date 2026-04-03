import React, { useState } from 'react';
import { Server, Monitor, Layout, Search, Plus, Edit, Trash2, Download, Upload, Filter, CheckCircle2, AlertCircle, Clock, Activity, ChevronRight, Database, Shield, Share2, Video, Map } from 'lucide-react';

const VideoUnified: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('platform');

  const subTabs = [
    { id: 'platform', label: '视频平台设计', icon: Server },
    { id: 'client', label: '客户端功能设计', icon: Monitor },
  ];

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
        {activeSubTab === 'platform' && (
          <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">接入网关</h3>
                <p className="text-sm text-slate-500 leading-relaxed">支持 GB/T 28181, RTSP, ONVIF 等多种协议接入，实现海量视频资源的统一汇聚与管理。</p>
                <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-primary">
                  <span>在线节点: 12</span>
                  <span>负载: 24%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">存储中心</h3>
                <p className="text-sm text-slate-500 leading-relaxed">提供分布式云存储，支持历史视频回放、录像计划管理及关键视频永久保存。</p>
                <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-emerald-600">
                  <span>存储容量: 256TB</span>
                  <span>已用: 68%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">分发引擎</h3>
                <p className="text-sm text-slate-500 leading-relaxed">支持多终端分发，包括 Web, App, 大屏等，提供低延迟、高并发的流媒体服务。</p>
                <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-blue-600">
                  <span>并发路数: 128</span>
                  <span>带宽: 450Mbps</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                平台拓扑结构
              </h3>
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-white/50">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">拓扑图加载中...</p>
                  <p className="text-xs text-slate-300 mt-1">正在连接视频汇聚中心</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'client' && (
          <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">核心功能模块</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: '多路实时预览', desc: '支持 1/4/9/16 分屏预览，支持云台控制与预置位调用。', icon: Monitor },
                    { title: '历史录像回放', desc: '支持按时间、按事件检索回放，支持多倍速播放与抓拍。', icon: Clock },
                    { title: '智能告警联动', desc: '视频分析结果实时推送，支持弹窗提醒、声光报警。', icon: AlertCircle },
                    { title: '电子地图集成', desc: '在地图上直观展示摄像头分布，支持点击查看实时画面。', icon: Map },
                  ].map((feature) => (
                    <div key={feature.title} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{feature.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold">客户端界面预览</h3>
                  <p className="text-slate-400 text-sm mt-2">基于现代 UI 设计语言，提供极致的操作体验。</p>
                </div>
                <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 relative z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">界面原型加载中...</p>
                  </div>
                </div>
                <div className="flex gap-4 relative z-10">
                  <button className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors">下载 PC 客户端</button>
                  <button className="flex-1 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-colors">下载移动 App</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUnified;
