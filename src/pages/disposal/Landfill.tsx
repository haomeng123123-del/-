import React, { useEffect, useState } from 'react';
import { queryMeasurementList, queryMeasurementStats, queryLandfillMonitorData, queryVideoList } from '../../api/services/disposal';
import { MeasurementRecord, MeasurementStats, LandfillMonitorData, VideoCamera } from '../../types/disposal';
import { Scale, Video, Activity } from 'lucide-react';
import { motion } from 'motion/react';

import MeasurementTab from './components/MeasurementTab';
import VideoTab from './components/VideoTab';
import LandfillMonitorTab from './components/LandfillMonitorTab';

const Landfill: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'measurement' | 'video' | 'monitor'>('measurement');
  
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [stats, setStats] = useState<MeasurementStats | null>(null);
  const [monitorData, setMonitorData] = useState<LandfillMonitorData | null>(null);
  const [cameras, setCameras] = useState<VideoCamera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, statsRes, monitorRes, videoRes] = await Promise.all([
          queryMeasurementList({ plantType: 'landfill', pageNo: 1, pageSize: 50 }),
          queryMeasurementStats({ plantType: 'landfill' }),
          queryLandfillMonitorData({ plantId: 'L001' }),
          queryVideoList({ plantType: 'landfill' })
        ]);
        setRecords(recordsRes.data.list);
        setStats(statsRes.data);
        setMonitorData(monitorRes.data);
        setCameras(videoRes.data);
      } catch (error) {
        console.error('Failed to fetch landfill data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats || !monitorData) return <div className="p-8 text-center text-slate-500">加载填埋场数据中...</div>;

  const tabs = [
    { id: 'measurement', label: '填埋场垃圾计量管理', icon: Scale },
    { id: 'monitor', label: '填埋场监测数据展示', icon: Activity },
    { id: 'video', label: '填埋场视频监控管理', icon: Video },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'measurement' && (
          <MeasurementTab records={records} stats={stats} plantTypeLabel="填埋场" />
        )}
        {activeTab === 'video' && (
          <VideoTab cameras={cameras} plantTypeLabel="填埋场" />
        )}
        {activeTab === 'monitor' && (
          <LandfillMonitorTab monitorData={monitorData} onNavigateToVideo={() => setActiveTab('video')} />
        )}
      </motion.div>
    </div>
  );
};

export default Landfill;
