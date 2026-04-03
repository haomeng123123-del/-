import React, { useState } from 'react';
import { Search, Calendar, Settings, Play, Pause } from 'lucide-react';

const HistoryTrack: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<number | null>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [speed, setSpeed] = useState('1.0x');
  const [date, setDate] = useState('2023-10-25');
  const [showToast, setShowToast] = useState('');

  const personnelList = [
    { id: 1, name: '张建国', role: '清扫工' },
    { id: 2, name: '李明', role: '巡查员' },
    { id: 4, name: '赵铁柱', role: '清运司机' },
  ];

  const filteredList = personnelList.filter(person => 
    person.name.includes(search) || person.role.includes(search)
  );

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setProgress(percentage);
  };

  const startHour = 8;
  const endHour = 18;
  const totalSeconds = (endHour - startHour) * 3600;
  const currentSeconds = (progress / 100) * totalSeconds;
  const currentH = Math.floor(startHour + currentSeconds / 3600);
  const currentM = Math.floor((currentSeconds % 3600) / 60);
  const currentS = Math.floor(currentSeconds % 60);
  const timeString = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}:${currentS.toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      {/* Left Panel: Personnel Selection & Controls */}
      <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black font-headline text-slate-900 mb-4">历史轨迹回放</h2>
          <div className="relative mb-4">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
              placeholder="搜索人员..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <div className="relative">
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                  {person.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{person.name}</h4>
                  <span className="text-xs text-slate-500">{person.role}</span>
                </div>
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

      {/* Right Panel: Map & Playback Controls */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Background" 
            className="w-full h-full object-cover opacity-60 grayscale"
            referrerPolicy="no-referrer"
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button onClick={() => handleAction('打开地图设置')} className="bg-white p-2 rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50" title="设置">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Simulated Track Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path 
              d="M 200 500 L 300 400 L 400 450 L 500 300 L 600 350 L 700 200" 
              fill="none" 
              stroke="#2563eb" 
              strokeWidth="4" 
              className="opacity-60"
            />
            {/* Stop Markers */}
            <circle cx="200" cy="500" r="6" fill="#ef4444" />
            <circle cx="400" cy="450" r="6" fill="#f59e0b" />
            <circle cx="700" cy="200" r="6" fill="#ef4444" />
          </svg>

          {/* Simulated Moving Marker */}
          {selectedPerson && (
            <div className="absolute top-[300px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-slate-800 mb-1 border border-slate-200 whitespace-nowrap">
                {timeString}
              </div>
              <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-container transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 font-bold mb-2">
              <span>08:00:00</span>
              <span className="text-primary">{timeString}</span>
              <span>18:00:00</span>
            </div>
            <div 
              className="w-full bg-slate-200 h-2 rounded-full relative cursor-pointer"
              onClick={handleProgressChange}
            >
              <div className="bg-primary h-2 rounded-full pointer-events-none transition-all duration-75" style={{ width: `${progress}%` }}></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow pointer-events-none transition-all duration-75" style={{ left: `${progress}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600">倍速</span>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            >
              <option value="1.0x">1.0x</option>
              <option value="2.0x">2.0x</option>
              <option value="4.0x">4.0x</option>
              <option value="8.0x">8.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTrack;
