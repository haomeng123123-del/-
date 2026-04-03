import axios from '../axios';
import { ApiResponse } from '../../types/api';
import { 
  MapReq, MonitorReq, AttendanceReq, InspectionReq,
  DisposalFacility, DisposalMonitorData, DisposalRecord, MaintenanceRecord,
  MaintenancePlan, FaultAlarm,
  SortingPoint, SortingGuide, SortingRecord
} from '../../types/facility';
import { 
  mockQueryToiletMapList, 
  mockQueryToiletMonitorData, 
  mockQueryCleaningAttendance, 
  mockQueryInspectionRecords, 
  mockQueryFacilitySummaryStats,
  mockQueryCleaningShifts,
  mockQueryCleaningStaff,
  mockQueryDisposalFacilities,
  mockQueryDisposalMonitor,
  mockQueryDisposalRecords,
  mockQueryMaintenanceRecords,
  mockQueryMaintenancePlans,
  mockQueryFaultAlarms,
  mockQuerySortingPoints,
  mockQuerySortingGuides,
  mockQuerySortingRecords,
  mockQuerySortingStats
} from '../../../mock/handlers/facility';

export async function queryToiletMapList(params: MapReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryToiletMapList(params);
  }
  return axios.post('/api/facility/map/list', params);
}

export async function queryToiletMonitorData(params: MonitorReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryToiletMonitorData(params);
  }
  return axios.post('/api/facility/monitor/data', params);
}

export async function queryCleaningAttendance(params: AttendanceReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCleaningAttendance(params);
  }
  return axios.post('/api/facility/cleaning/attendance/list', params);
}

export async function queryCleaningShifts(): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCleaningShifts();
  }
  return axios.post('/api/facility/cleaning/shifts/list');
}

export async function queryCleaningStaff(): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCleaningStaff();
  }
  return axios.post('/api/facility/cleaning/staff/list');
}

export async function queryInspectionRecords(params: InspectionReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryInspectionRecords(params);
  }
  return axios.post('/api/facility/inspection/list', params);
}

export async function queryFacilitySummaryStats(): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryFacilitySummaryStats();
  }
  return axios.post('/api/facility/statistics/summary');
}

export async function queryDisposalFacilities(): Promise<ApiResponse<DisposalFacility[]>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryDisposalFacilities();
  }
  return axios.post('/api/facility/disposal/list');
}

export async function queryDisposalMonitor(facilityId: string): Promise<ApiResponse<DisposalMonitorData>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryDisposalMonitor(facilityId);
  }
  return axios.post('/api/facility/disposal/monitor', { facilityId });
}

export async function queryDisposalRecords(params: { pageNo: number; pageSize: number; facilityId?: string }): Promise<ApiResponse<{ total: number; list: DisposalRecord[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryDisposalRecords(params);
  }
  return axios.post('/api/facility/disposal/records', params);
}

export async function queryMaintenanceRecords(params: { pageNo: number; pageSize: number; facilityId?: string }): Promise<ApiResponse<{ total: number; list: MaintenanceRecord[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryMaintenanceRecords(params);
  }
  return axios.post('/api/facility/disposal/maintenance', params);
}

export async function queryMaintenancePlans(): Promise<ApiResponse<MaintenancePlan[]>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryMaintenancePlans();
  }
  return axios.post('/api/facility/disposal/maintenance/plans');
}

export async function queryFaultAlarms(): Promise<ApiResponse<FaultAlarm[]>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryFaultAlarms();
  }
  return axios.post('/api/facility/disposal/fault/alarms');
}

// 垃圾分类系统 API
export async function querySortingPoints(params: { name?: string; type?: string }): Promise<ApiResponse<SortingPoint[]>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySortingPoints(params);
  }
  return axios.post('/api/facility/sorting/points', params);
}

export async function querySortingGuides(params: { category?: string; keyword?: string }): Promise<ApiResponse<SortingGuide[]>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySortingGuides(params);
  }
  return axios.post('/api/facility/sorting/guides', params);
}

export async function querySortingRecords(params: { pageNo: number; pageSize: number; pointId?: string }): Promise<ApiResponse<{ list: SortingRecord[]; total: number }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySortingRecords(params);
  }
  return axios.post('/api/facility/sorting/records', params);
}

export async function querySortingStats(): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySortingStats();
  }
  return axios.post('/api/facility/sorting/statistics');
}
