import React from 'react';
import { Truck, Users, Trash2, AlertTriangle, MoreHorizontal, ChevronRight, ArrowRight, Plus, Minus, Locate } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight">环卫固废大数据指挥舱</h1>
          <p className="text-slate-500 font-sans mt-1">实时数据汇总与应急调度系统</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600">系统运行正常</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-sans">最后更新时间</p>
            <p className="text-sm font-bold text-slate-700">2024-05-23 14:30:15</p>
          </div>
        </div>
      </header>

      {/* Top KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-emerald-500 text-xs font-bold">+12% ↑</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">在途作业车辆</p>
          <h3 className="font-headline text-3xl font-bold text-primary mt-1">1,284<span className="text-sm font-normal ml-1">台</span></h3>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-slate-400 text-xs font-bold">稳定</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">一线在岗人员</p>
          <h3 className="font-headline text-3xl font-bold text-primary mt-1">4,520<span className="text-sm font-normal ml-1">人</span></h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-tertiary" />
            </div>
            <span className="text-emerald-500 text-xs font-bold">+5.2% ↑</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">今日收运总量</p>
          <h3 className="font-headline text-3xl font-bold text-primary mt-1">2,841<span className="text-sm font-normal ml-1">吨</span></h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <span className="text-error text-xs font-bold">待处理</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">活动预警工单</p>
          <h3 className="font-headline text-3xl font-bold text-error mt-1">18<span className="text-sm font-normal ml-1">件</span></h3>
        </div>
      </div>

      {/* Main Content Area: Map and Panels */}
      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Interactive Map Section (70%) */}
        <div className="lg:w-[70%] relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
          <div className="absolute inset-0 bg-slate-200">
            <img 
              className="w-full h-full object-cover" 
              alt="Map" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeC1DNNy1WZXtwI4Lg68jtYDdc1ppRJrCs06Q_rqjoDO-dqgWErN3Di47e4-WTS9EMvRkDJAftVG9ChgMg6kjAk6fSLx3F5Pq-0t9M34dnvljBb9DsfdYgbD3NE2bV_JFfIfD-ASR58kWxUJ7rAeU1CuHbgcajcO2CaDifarnzrAaEIrJ9NZvZOYggBJqrbYL5pFfYDvuiSSwIcZh9ipo5kNj1TyfO1xtxyirgjOGQkBnUBgI4S5asJcy9U2w9vWKVoJj8XDrR9U8"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Map Overlay Elements */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-slate-700">垃圾清运车 (842)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                <span className="text-xs font-bold text-slate-700">道路扫路机 (442)</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white flex items-center justify-center">
              <span className="text-xl leading-none">+</span>
            </button>
            <button className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white flex items-center justify-center">
              <span className="text-xl leading-none">-</span>
            </button>
            <button className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Side Intelligence Panel (30%) */}
        <div className="lg:w-[30%] flex flex-col gap-6">
          {/* Efficiency Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wide">运行效率趋势</h4>
              <MoreHorizontal className="text-slate-400 w-5 h-5" />
            </div>
            <div className="space-y-6">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">当前任务完成率</span>
                  <span className="text-xs font-bold text-primary">92%</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-100">
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">平均响应速度 (分钟)</span>
                  <span className="text-xs font-bold text-primary">14.2</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-100">
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-8 h-32 flex items-end gap-1 px-2">
              {/* Bar Chart Simulation */}
              <div className="flex-1 bg-slate-100 rounded-t h-[40%]"></div>
              <div className="flex-1 bg-slate-100 rounded-t h-[60%]"></div>
              <div className="flex-1 bg-primary/40 rounded-t h-[80%]"></div>
              <div className="flex-1 bg-primary rounded-t h-[95%]"></div>
              <div className="flex-1 bg-primary/60 rounded-t h-[70%]"></div>
              <div className="flex-1 bg-slate-100 rounded-t h-[50%]"></div>
              <div className="flex-1 bg-slate-100 rounded-t h-[45%]"></div>
            </div>
          </div>

          {/* Emergency Dispatch Panel */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase">应急调度中心</h4>
            </div>
            <p className="text-slate-400 text-xs">发现 2 个高优先级异常，请立即进行资源重分配。</p>
            <div className="space-y-2">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center group cursor-pointer hover:border-error transition-colors">
                <div>
                  <p className="text-xs font-bold text-white">长宁区废弃物堆积</p>
                  <p className="text-[10px] text-slate-500">建议增派 2 辆清运车</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-error" />
              </div>
            </div>
            <button className="w-full bg-error hover:bg-red-700 py-3 rounded-lg text-sm font-bold transition-colors mt-2">
              全局一键调度
            </button>
          </div>
        </div>
      </div>

      {/* Lower Section: Detailed Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">实时作业流水</h4>
            <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              查看全部 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 font-sans">
                  <th className="px-6 py-4 font-medium">车牌号 / 编号</th>
                  <th className="px-6 py-4 font-medium">作业类型</th>
                  <th className="px-6 py-4 font-medium">当前位置</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">功耗/油耗</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">沪A·8K291</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] rounded font-bold">湿垃圾清运</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">静安区南京西路段</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-600 font-medium">作业中</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-sans text-slate-500">14.2L / 100km</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">沪B·D3042</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] rounded font-bold">高压冲洗</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">徐汇区淮海中路</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-600 font-medium">作业中</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-sans text-slate-500">18.5L / 100km</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">沪A·M8821</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded font-bold">设备检修</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">普陀区金沙江路基地</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-slate-400 font-medium">离线</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-sans text-slate-500">--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6">资源负荷分布</h4>
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Donut Chart Simulation with Conic Gradient */}
            <div className="absolute inset-0 rounded-full border-[12px] border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent border-l-transparent rotate-[45deg]"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-teal-500 border-t-transparent border-b-transparent border-l-transparent rotate-[160deg]"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-primary font-headline">88%</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">平均负荷</p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-xs text-slate-600">中心城区活跃度</span>
              </div>
              <span className="text-xs font-bold">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                <span className="text-xs text-slate-600">郊区网点覆盖</span>
              </div>
              <span className="text-xs font-bold">76.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span className="text-xs text-slate-600">闲置冗余资源</span>
              </div>
              <span className="text-xs font-bold">12.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
