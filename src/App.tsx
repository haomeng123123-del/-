/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Facility from './pages/Facility';
import Cases from './pages/Cases';
import DataPlatform from './pages/DataPlatform';
import Personnel from './pages/Personnel';
import Transfer from './pages/Transfer';
import Disposal from './pages/Disposal';
import Sorting from './pages/Sorting';
import PlatformSupport from './pages/PlatformSupport';
import SystemSettings from './pages/SystemSettings';

import Comprehensive from './pages/Comprehensive';
import BigData from './pages/BigData';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400">
    {title} (建设中)
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/comprehensive" replace />} />
          <Route path="comprehensive/*" element={<Comprehensive />} />
          <Route path="bigdata/*" element={<BigData />} />
          <Route path="personnel/*" element={<Personnel />} />
          <Route path="vehicles/*" element={<Vehicles />} />
          <Route path="transfer/*" element={<Transfer />} />
          <Route path="facility/*" element={<Facility />} />
          <Route path="disposal/*" element={<Disposal />} />
          <Route path="sorting/*" element={<Sorting />} />
          <Route path="cases/*" element={<Cases />} />
          <Route path="data/*" element={<DataPlatform />} />
          <Route path="platform/*" element={<PlatformSupport />} />
          <Route path="settings/*" element={<SystemSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
