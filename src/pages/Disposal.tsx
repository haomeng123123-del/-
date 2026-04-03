import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

import Landfill from './disposal/Landfill';
import Incineration from './disposal/Incineration';
import KitchenWaste from './disposal/KitchenWaste';

const Disposal: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes('incineration')) return '焚烧厂运行监管子系统';
    if (location.pathname.includes('kitchen-waste')) return '餐厨垃圾处置管理';
    return '填埋场运行监管子系统';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">{getTitle()}</h1>
        <p className="text-slate-500 mt-1">终端处置场全流程运行监管</p>
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
          <Route index element={<Landfill />} />
          <Route path="incineration" element={<Incineration />} />
          <Route path="kitchen-waste" element={<KitchenWaste />} />
          <Route path="*" element={<Navigate to="/disposal" replace />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default Disposal;
