import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OperationMap from './personnel/OperationMap';
import PersonnelInfo from './personnel/PersonnelInfo';
import RealtimeTrack from './personnel/RealtimeTrack';
import HistoryTrack from './personnel/HistoryTrack';
import GridManagement from './personnel/GridManagement';
import PersonnelStatistics from './personnel/PersonnelStatistics';

const Personnel: React.FC = () => {
  return (
    <div className="h-[calc(100vh-128px)]">
      <Routes>
        <Route path="/" element={<OperationMap />} />
        <Route path="/info" element={<PersonnelInfo />} />
        <Route path="/track-realtime" element={<RealtimeTrack />} />
        <Route path="/track-history" element={<HistoryTrack />} />
        <Route path="/grid" element={<GridManagement />} />
        <Route path="/statistics" element={<PersonnelStatistics />} />
        <Route path="*" element={<Navigate to="/personnel" replace />} />
      </Routes>
    </div>
  );
};

export default Personnel;
