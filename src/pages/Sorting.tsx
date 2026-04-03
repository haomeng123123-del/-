import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

import BasicInfo from './sorting/BasicInfo';
import OnlineReport from './sorting/OnlineReport';
import CollectionSupervision from './sorting/CollectionSupervision';
import TreatmentSupervision from './sorting/TreatmentSupervision';

const Sorting: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes('report')) return '垃圾分类在线填报';
    if (location.pathname.includes('collection')) return '分类收运监管';
    if (location.pathname.includes('treatment')) return '分类处理监管';
    return '垃圾分类基础信息管理';
  };

  const getDescription = () => {
    if (location.pathname.includes('report')) return '数据填报管理与记录导出';
    if (location.pathname.includes('collection')) return '收运车辆实时监测、计划与记录监管';
    if (location.pathname.includes('treatment')) return '处理设施进场计量与视频监控管理';
    return '小区、居民、运营单位等基础信息维护';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">{getTitle()}</h1>
        <p className="text-slate-500 mt-1">{getDescription()}</p>
      </header>

      {/* Content Area */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[600px]"
      >
        <Routes>
          <Route index element={<BasicInfo />} />
          <Route path="report" element={<OnlineReport />} />
          <Route path="collection" element={<CollectionSupervision />} />
          <Route path="treatment" element={<TreatmentSupervision />} />
          <Route path="*" element={<Navigate to="/sorting" replace />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default Sorting;
