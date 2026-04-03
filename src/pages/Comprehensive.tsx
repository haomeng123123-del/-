import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacilityTopic from './comprehensive/FacilityTopic';
import CleaningTopic from './comprehensive/CleaningTopic';
import ToiletTopic from './comprehensive/ToiletTopic';
import CollectionTopic from './comprehensive/CollectionTopic';
import TransferTopic from './comprehensive/TransferTopic';
import InspectionTopic from './comprehensive/InspectionTopic';
import VideoTopic from './comprehensive/VideoTopic';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
    {title} (建设中)
  </div>
);

const Comprehensive: React.FC = () => {
  return (
    <div className="h-[calc(100vh-128px)]">
      <Routes>
        <Route path="/" element={<Navigate to="/comprehensive/facility" replace />} />
        <Route path="/facility" element={<FacilityTopic />} />
        <Route path="/cleaning" element={<CleaningTopic />} />
        <Route path="/toilet" element={<ToiletTopic />} />
        <Route path="/collection" element={<CollectionTopic />} />
        <Route path="/transfer" element={<TransferTopic />} />
        <Route path="/inspection" element={<InspectionTopic />} />
        <Route path="/video" element={<VideoTopic />} />
        <Route path="*" element={<Navigate to="/comprehensive/facility" replace />} />
      </Routes>
    </div>
  );
};

export default Comprehensive;
