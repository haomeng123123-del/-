import React, { useState } from 'react';
import { Search, MapPin, Activity } from 'lucide-react';

const RealtimeTrack: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<number | null>(1);
  const [showToast, setShowToast] = useState('');

  const personnelList = [
    { id: 1, name: '张建国', role: '清扫工', status: 'online', speed: '3.2 km/h' },
    { id: 2, name: '李明', role: '巡查员', status: 'online', speed: '12.5 km/h' },
    { id: 4, name: '赵铁柱', role: '清运司机', status: 'warning', speed: '45.0 km/h' },
  ];

  const filteredList = personnelList.filter(person => 
    person.name.includes(search) || person.role.includes(search)
  );

  const selectedPersonData = personnelList.find(p => p.id === selectedPerson);

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="h-full flex gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      {/* Left Panel: Personnel Selection */}
      <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black font-headline text-slate-900 mb-4">实时轨迹监控</h2>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
              placeholder="搜索人员..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredList.map((person) => (
            <div
              key={person.id}
              onClick={() => setSelectedPerson(person.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedPerson === person.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    {person.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{person.name}</h4>
                    <span className="text-xs text-slate-500">{person.role}</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1 ${person.status === 'online' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                <Activity className="w-3 h-3" />
                <span>实时速度: {person.speed}</span>
              </div>
            </div>
          ))}
          {filteredList.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-4">
              没有找到匹配的人员
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Map Background" 
          className="w-full h-full object-cover opacity-60 grayscale"
          referrerPolicy="no-referrer"
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={() => handleAction('已开启视角跟随')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50" title="跟随点位">
            <MapPin className="w-4 h-4 text-primary" />
          </button>
        </div>

        {/* Simulated Track Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path 
            d="M 300 400 Q 400 350 500 300 T 700 200" 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="4" 
            strokeDasharray="8 4"
            className="opacity-60"
          />
        </svg>

        {/* Simulated Moving Marker */}
        {selectedPersonData && (
          <div className="absolute top-[300px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-slate-800 mb-1 border border-slate-200 whitespace-nowrap">
              {selectedPersonData.name} ({selectedPersonData.speed})
            </div>
            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
              selectedPersonData.status === 'online' ? 'bg-blue-600' : 'bg-orange-500'
            }`}>
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeTrack;
