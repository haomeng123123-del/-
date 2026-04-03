import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart3,
  Camera,
  Maximize2,
  Settings,
  FolderTree,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Mock Data ---

const KPIS = [
  { title: '接入视频总数', value: '1,245', unit: '路', icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-50', path: '/comprehensive/video' },
  { title: '设备在线率', value: '98.5%', unit: '', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50', path: '/comprehensive/video' },
  { title: '今日AI告警', value: '156', unit: '次', icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-50', path: '/bigdata' },
  { title: '存储使用率', value: '72%', unit: '', icon: BarChart3, color: 'text-indigo-500', bgColor: 'bg-indigo-50', path: '/comprehensive/video' },
];

const CAMERA_TREE = [
  {
    id: 'nanshan',
    name: '南山区',
    type: 'district',
    expanded: true,
    children: [
      {
        id: 'ns-transfer',
        name: '转运站监控',
        type: 'category',
        expanded: true,
        children: [
          { id: 'cam-001', name: '南山中心站-卸料大厅01', status: 'online', isAI: true },
          { id: 'cam-002', name: '南山中心站-卸料大厅02', status: 'online', isAI: true },
          { id: 'cam-003', name: '南山中心站-出入口', status: 'online', isAI: false },
        ]
      },
      {
        id: 'ns-toilet',
        name: '公厕监控',
        type: 'category',
        expanded: false,
        children: [
          { id: 'cam-004', name: '科技园公厕-外围', status: 'online', isAI: false },
          { id: 'cam-005', name: '深圳湾公园公厕-外围', status: 'offline', isAI: false },
        ]
      }
    ]
  },
  {
    id: 'futian',
    name: '福田区',
    type: 'district',
    expanded: false,
    children: [
      {
        id: 'ft-transfer',
        name: '转运站监控',
        type: 'category',
        expanded: false,
        children: [
          { id: 'cam-006', name: '梅林转运站-卸料大厅', status: 'online', isAI: true },
        ]
      }
    ]
  }
];

// --- Components ---

const TreeNode: React.FC<{ node: any, level?: number, onSelect: (node: any) => void }> = ({ node, level = 0, onSelect }) => {
  const [expanded, setExpanded] = useState(node.expanded || false);
  const isLeaf = !node.children;

  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-2 px-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors",
          level === 0 ? "font-medium text-slate-800" : "text-slate-600 text-sm"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => {
          if (!isLeaf) setExpanded(!expanded);
          if (isLeaf) onSelect(node);
        }}
      >
        {!isLeaf && (
          <span className="mr-1.5 text-slate-400">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {isLeaf && (
          <span className="mr-2">
            <Camera className={cn("w-4 h-4", node.status === 'online' ? 'text-blue-500' : 'text-slate-300')} />
          </span>
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {isLeaf && node.isAI && (
          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-medium border border-indigo-100">AI</span>
        )}
      </div>
      {expanded && !isLeaf && (
        <div>
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function VideoTopic() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<1 | 4 | 9>(4);
  const [activeFeeds, setActiveFeeds] = useState<any[]>([
    { id: 'cam-001', name: '南山中心站-卸料大厅01', status: 'online', isAI: true },
    { id: 'cam-002', name: '南山中心站-卸料大厅02', status: 'online', isAI: true },
    null,
    null
  ]);

  const handleSelectCamera = (camera: any) => {
    // Find first empty slot
    const emptyIndex = activeFeeds.findIndex(feed => feed === null);
    if (emptyIndex !== -1) {
      const newFeeds = [...activeFeeds];
      newFeeds[emptyIndex] = camera;
      setActiveFeeds(newFeeds);
    }
  };

  const handleRemoveFeed = (index: number) => {
    const newFeeds = [...activeFeeds];
    newFeeds[index] = null;
    setActiveFeeds(newFeeds);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {KPIS.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(kpi.path)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className={cn("p-3 rounded-xl", kpi.bgColor, kpi.color)}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{kpi.title}</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                  <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Left Panel: Camera Tree */}
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">设备列表</h2>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <FolderTree className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索设备名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {CAMERA_TREE.map(node => (
              <TreeNode key={node.id} node={node} onSelect={handleSelectCamera} />
            ))}
          </div>
        </div>

        {/* Center: Video Grid */}
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm font-medium">视图布局</span>
              <div className="flex bg-slate-800 rounded-lg p-1">
                {[1, 4, 9].map(l => (
                  <button
                    key={l}
                    onClick={() => {
                      setLayout(l as 1 | 4 | 9);
                      // Adjust active feeds array size
                      const newFeeds = [...activeFeeds];
                      if (newFeeds.length < l) {
                        while (newFeeds.length < l) newFeeds.push(null);
                      } else if (newFeeds.length > l) {
                        newFeeds.splice(l);
                      }
                      setActiveFeeds(newFeeds);
                    }}
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                      layout === l ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {l}分屏
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className={cn(
            "flex-1 p-2 grid gap-2",
            layout === 1 ? "grid-cols-1" : layout === 4 ? "grid-cols-2" : "grid-cols-3"
          )}>
            {activeFeeds.map((feed, index) => (
              <div 
                key={index} 
                className="bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden group flex items-center justify-center"
              >
                {feed ? (
                  <>
                    <Video className="w-12 h-12 text-slate-800" />
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium drop-shadow-md">{feed.name}</span>
                        {feed.isAI && (
                          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-medium border border-indigo-500/30">AI 分析中</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemoveFeed(index)}
                        className="text-slate-300 hover:text-white"
                      >
                        关闭
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-700 flex flex-col items-center">
                    <Camera className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">从左侧选择设备播放</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
