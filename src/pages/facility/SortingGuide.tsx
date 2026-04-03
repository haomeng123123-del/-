import React, { useEffect, useState } from 'react';
import { querySortingGuides } from '../../api/services/facility';
import { SortingGuide } from '../../types/facility';
import { Search, Filter, Info, Trash2, ChevronRight, X, AlertCircle, CheckCircle2, HelpCircle, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SortingGuidePage: React.FC = () => {
  const [guides, setGuides] = useState<SortingGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedGuide, setSelectedGuide] = useState<SortingGuide | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const res = await querySortingGuides({ category, keyword: search });
        setGuides(res.data);
      } catch (error) {
        console.error('Failed to fetch sorting guides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [search, category]);

  const categories = [
    { name: '全部', color: 'bg-slate-900', icon: <LayoutGrid className="w-4 h-4" />, desc: '查看所有垃圾分类指南' },
    { name: '可回收物', color: 'bg-blue-500', icon: <Trash2 className="w-4 h-4" />, desc: '适宜回收利用的生活垃圾' },
    { name: '有害垃圾', color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" />, desc: '对人体健康或自然环境造成直接或潜在危害' },
    { name: '厨余垃圾', color: 'bg-green-600', icon: <CheckCircle2 className="w-4 h-4" />, desc: '易腐烂的、含有机质的生活垃圾' },
    { name: '其他垃圾', color: 'bg-slate-600', icon: <HelpCircle className="w-4 h-4" />, desc: '除上述类别之外的其他生活垃圾' },
  ];

  return (
    <div className="space-y-8">
      {/* 顶部搜索 */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
        <div className="relative bg-white p-2 rounded-[32px] shadow-2xl border border-slate-100 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索垃圾名称，如：报纸、电池、剩菜..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-transparent border-none rounded-2xl text-lg focus:ring-0 placeholder:text-slate-300"
            />
          </div>
          <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
            搜索
          </button>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name === '全部' ? '' : cat.name)}
            className={`p-6 rounded-[32px] text-left transition-all relative overflow-hidden group ${
              (category === cat.name || (cat.name === '全部' && !category)) ? 'ring-4 ring-primary/20 scale-105' : 'hover:bg-white hover:shadow-xl hover:-translate-y-1'
            } ${cat.color} text-white`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
              {cat.icon}
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                {cat.icon}
              </div>
              <h3 className="text-xl font-black mb-2">{cat.name}</h3>
              <p className="text-xs text-white/80 leading-relaxed">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 结果列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {guides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedGuide(guide)}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${
                  categories.find(c => c.name === guide.category)?.color
                }`}>
                  {guide.category}
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{guide.name}</h4>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{guide.description}</p>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">投放建议</p>
                <div className="flex flex-wrap gap-2">
                  {guide.tips.map((tip, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!loading && guides.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">未找到相关垃圾</h3>
          <p className="text-sm text-slate-400 mt-2">换个关键词试试吧，或者看看热门分类</p>
        </div>
      )}

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuide(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className={`h-32 ${categories.find(c => c.name === selectedGuide.category)?.color} flex items-center justify-center text-white relative`}>
                <div className="absolute top-4 right-4">
                  <button onClick={() => setSelectedGuide(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                  {categories.find(c => c.name === selectedGuide.category)?.icon}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${
                    categories.find(c => c.name === selectedGuide.category)?.color
                  }`}>
                    {selectedGuide.category}
                  </span>
                  <h3 className="text-3xl font-black text-slate-900">{selectedGuide.name}</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">物品描述</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedGuide.description}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">投放建议与要求</p>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedGuide.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm text-slate-700 font-medium">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm"><Info className="w-5 h-5" /></div>
                    <div>
                      <p className="text-xs font-bold text-blue-900 mb-1">温馨提示</p>
                      <p className="text-[10px] text-blue-700 leading-relaxed">
                        请确保垃圾分类投放，保持环境整洁。如有疑问，可咨询社区志愿者或拨打服务热线。
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedGuide(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortingGuidePage;
