import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeakageIdentification from './bigdata/LeakageIdentification';
import FlowAnomaly from './bigdata/FlowAnomaly';
import IllegalDumping from './bigdata/IllegalDumping';
import VolumeAnomaly from './bigdata/VolumeAnomaly';
import OdorAlarm from './bigdata/OdorAlarm';
import ContractAnalysis from './bigdata/ContractAnalysis';
import FatigueWarning from './bigdata/FatigueWarning';
import WaterRefill from './bigdata/WaterRefill';
import WeakAreaAnalysis from './bigdata/WeakAreaAnalysis';
import DemoStreet from './bigdata/DemoStreet';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
    {title} (建设中)
  </div>
);

const BigData: React.FC = () => {
  return (
    <div className="h-[calc(100vh-128px)]">
      <Routes>
        <Route path="/" element={<Navigate to="/bigdata/leakage" replace />} />
        <Route path="/leakage" element={<LeakageIdentification />} />
        <Route path="/dumping" element={<IllegalDumping />} />
        <Route path="/flow-anomaly" element={<FlowAnomaly />} />
        <Route path="/volume-anomaly" element={<VolumeAnomaly />} />
        <Route path="/odor-alarm" element={<OdorAlarm />} />
        <Route path="/contract" element={<ContractAnalysis />} />
        <Route path="/fatigue" element={<FatigueWarning />} />
        <Route path="/water-refill" element={<WaterRefill />} />
        <Route path="/weak-area" element={<WeakAreaAnalysis />} />
        <Route path="/demo-street" element={<DemoStreet />} />
        <Route path="*" element={<Navigate to="/bigdata/leakage" replace />} />
      </Routes>
    </div>
  );
};

export default BigData;
