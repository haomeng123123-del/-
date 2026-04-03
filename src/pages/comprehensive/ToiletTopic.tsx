import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bath, Users, Activity, AlertTriangle, Map, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const toilets = [
  { id: 'T001', name: '静安寺广场公厕', status: '正常', flow: 1250, odor: '优', cleaner: '王阿姨', score: 98 },
  { id: 'T002', name: '南京西路地铁站公厕', status: '拥挤', flow: 3420, odor: '良', cleaner: '李师傅', score: 92 },
  { id: 'T003', name: '人民公园北门公厕', status: '臭气超标', flow: 850, odor: '差', cleaner: '张阿姨', score: 75 },
  { id: 'T004', name: '外滩观景台公厕', status: '维护中', flow: 0, odor: '-', cleaner: '-', score: '-' },
];

const flowData = [
  { time: '06:00', value: 120 },
  { time: '09:00', value: 450 },
  { time: '12:00', value: 890 },
  { time: '15:00', value: 650 },
  { time: '18:00', value: 920 },
  { time: '21:00', value: 340 },
];

const ToiletTopic: React.FC = () => {
  const [selectedToilet, setSelectedToilet] = useState(toilets[0]);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">智慧公厕专题</h1>
        <p className="text-slate-500 mt-1">公厕运行数据、客流监测与臭气报警全局监测</p>
      </header>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/facility')}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
              <Bath className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">公厕总数</p>
              <p className="text-3xl font-black text-slate-800 font-headline">320</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/facility/monitor')}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">今日总客流</p>
              <p className="text-3xl font-black text-slate-800 font-headline">12.5<span className="text-sm font-normal">万</span></p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/facility/monitor')}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">臭气超标预警</p>
              <p className="text-3xl font-black text-slate-800 font-headline">5</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/facility/inspection')}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">平均检查评分</p>
              <p className="text-3xl font-black text-slate-800 font-headline">94.2</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-100 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative h-[400px] cursor-pointer group" onClick={() => navigate('/facility')}>
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              alt="Map Background" 
              className="w-full h-full object-cover opacity-60 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40 group-hover:bg-white transition-colors">
              <h4 className="font-bold text-slate-800 mb-2">公厕状态分布</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> 正常 (280)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 拥挤 (25)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> 臭气超标 (5)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> 维护中 (10)</div>
              </div>
            </div>
            {/* Markers */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer"></div>
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-pointer animate-pulse"></div>
            <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer animate-ping"></div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">公厕客流量分析</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[400px]">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">公厕列表</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {toilets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedToilet(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedToilet.id === t.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-primary/30'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{t.name}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${t.status === '正常' ? 'bg-emerald-50 text-emerald-600' : t.status === '臭气超标' ? 'bg-red-50 text-red-600' : t.status === '拥挤' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>客流: {t.flow}</span>
                    <span>臭气: <span className={t.odor === '差' ? 'text-red-500 font-bold' : ''}>{t.odor}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              {selectedToilet.name} 详情
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">保洁员</span>
                <span className="font-bold">{selectedToilet.cleaner}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">例行检查评分</span>
                <span className="font-bold text-emerald-400">{selectedToilet.score}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm">氨气浓度</span>
                <span className={`font-bold ${selectedToilet.odor === '差' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedToilet.odor === '差' ? '2.5 mg/m³ (超标)' : '0.2 mg/m³'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">硫化氢浓度</span>
                <span className={`font-bold ${selectedToilet.odor === '差' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedToilet.odor === '差' ? '0.08 mg/m³ (超标)' : '0.01 mg/m³'}
                </span>
              </div>
            </div>
            {selectedToilet.status === '臭气超标' && (
              <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors animate-pulse">
                下发除臭通风任务
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToiletTopic;
