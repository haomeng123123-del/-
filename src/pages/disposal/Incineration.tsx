import React, { useEffect, useState } from 'react';
import { queryMeasurementList, queryMeasurementStats, queryIncinerationEnvData, queryVideoList } from '../../api/services/disposal';
import { MeasurementRecord, MeasurementStats, IncinerationEnvData, VideoCamera } from '../../types/disposal';
import { Scale, Video, Wind } from 'lucide-react';
import { motion } from 'motion/react';

import MeasurementTab from './components/MeasurementTab';
import VideoTab from './components/VideoTab';
import IncinerationMonitorTab from './components/IncinerationMonitorTab';

const Incineration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'measurement' | 'video' | 'monitor'>('measurement');
  
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [stats, setStats] = useState<MeasurementStats | null>(null);
  const [envData, setEnvData] = useState<IncinerationEnvData | null>(null);
  const [cameras, setCameras] = useState<VideoCamera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, statsRes, envRes, videoRes] = await Promise.all([
          queryMeasurementList({ plantType: 'incineration', pageNo: 1, pageSize: 50 }),
          queryMeasurementStats({ plantType: 'incineration' }),
          queryIncinerationEnvData({ plantId: 'I001' }),
          queryVideoList({ plantType: 'incineration' })
        ]);
        setRecords(recordsRes.data.list);
        setStats(statsRes.data);
        setEnvData(envRes.data);
        setCameras(videoRes.data);
      } catch (error) {
        console.error('Failed to fetch incineration data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats || !envData) return <div className="p-8 text-center text-slate-500">加载焚烧厂数据中...</div>;

  const tabs = [
    { id: 'measurement', label: '焚烧厂垃圾计量管理', icon: Scale },
    { id: 'monitor', label: '焚烧厂环保指标管理', icon: Wind },
    { id: 'video', label: '焚烧厂视频监控', icon: Video },
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
          <MeasurementTab records={records} stats={stats} plantTypeLabel="焚烧厂" />
        )}
        {activeTab === 'video' && (
          <VideoTab cameras={cameras} plantTypeLabel="焚烧厂" />
        )}
        {activeTab === 'monitor' && (
          <IncinerationMonitorTab envData={envData} onNavigateToVideo={() => setActiveTab('video')} />
        )}
      </motion.div>
    </div>
  );
};

export default Incineration;
