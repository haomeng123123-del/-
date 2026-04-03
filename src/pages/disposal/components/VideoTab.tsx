import React, { useState } from 'react';
import { Video, Search, MapPin, PlayCircle, X, Camera as CameraIcon, Video as VideoIcon } from 'lucide-react';
import { VideoCamera } from '../../../types/disposal';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface VideoTabProps {
  cameras: VideoCamera[];
  plantTypeLabel: string;
}

const VideoTab: React.FC<VideoTabProps> = ({ cameras, plantTypeLabel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<VideoCamera | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const filteredCameras = cameras.filter(c => 
    c.cameraName.includes(searchTerm) || c.location.includes(searchTerm)
  );

  const handleSnapshot = () => {
    toast.success('抓拍成功', {
      description: '图片已保存至本地'
    });
  };

  const handleRecording = () => {
    if (isRecording) {
      toast.success('录像已停止', {
        description: '视频已保存至本地'
      });
    } else {
      toast.info('开始录像');
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 视频监控列表 */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-[600px]">
          <h3 className="text-lg font-bold text-slate-900 mb-4">实时监控视频清单</h3>
          
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`搜索${plantTypeLabel}或点位...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredCameras.map((camera) => (
              <div 
                key={camera.cameraId} 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedCamera?.cameraId === camera.cameraId 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-slate-50 border-slate-100 hover:border-primary/20 hover:shadow-sm'
                }`}
                onClick={() => camera.status === 'online' && setSelectedCamera(camera)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${camera.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{camera.cameraName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {camera.location}
                    </p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
            ))}
            {filteredCameras.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                未找到匹配的监控点位
              </div>
            )}
          </div>
        </div>

        {/* 视频播放区域 */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">视频播放查看</h3>
            <div className="flex items-center gap-3">
              {selectedCamera && (
                <>
                  <button 
                    onClick={handleSnapshot}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    title="抓拍"
                  >
                    <CameraIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleRecording}
                    className={`p-2 rounded-xl transition-colors ${
                      isRecording 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                    }`}
                    title={isRecording ? "停止录像" : "开始录像"}
                  >
                    <VideoIcon className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    实时画面
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center">
            {selectedCamera ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <PlayCircle className="w-16 h-16 mb-4 text-slate-600" />
                <p className="font-medium text-slate-400">正在播放: {selectedCamera.cameraName}</p>
                <p className="text-sm mt-2">{selectedCamera.location}</p>
                {/* 模拟视频画面 */}
                <div className="absolute top-4 left-4 text-white/50 text-xs font-mono flex flex-col gap-2">
                  <span>{new Date().toLocaleString()}</span>
                  {isRecording && (
                    <span className="flex items-center gap-2 text-red-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      REC
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 text-white/50 text-xs">
                  {plantTypeLabel}监控系统
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>请在左侧选择要查看的监控点位</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTab;
