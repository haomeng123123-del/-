import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CollectionPoint from './transfer/CollectionPoint';
import StationManagement from './transfer/StationManagement';
import Measurement from './transfer/Measurement';
import Operation from './transfer/Operation';
import Video from './transfer/Video';
import Statistics from './transfer/Statistics';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
    {title} (建设中)
  </div>
);

const Transfer: React.FC = () => {
  return (
    <div className="h-[calc(100vh-128px)]">
      <Routes>
        <Route path="/" element={<CollectionPoint />} />
        <Route path="/stations" element={<StationManagement />} />
        <Route path="/measurement" element={<Measurement />} />
        <Route path="/operation" element={<Operation />} />
        <Route path="/video" element={<Video />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<Navigate to="/transfer" replace />} />
      </Routes>
    </div>
  );
};

export default Transfer;
