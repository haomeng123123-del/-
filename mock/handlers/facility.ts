import { ApiResponse } from '../../src/types/api';
import { MapReq, MonitorReq, AttendanceReq, InspectionReq } from '../../src/types/facility';
import { 
  toiletMapPoints, 
  toiletMonitorData, 
  cleaningAttendances, 
  inspectionRecords, 
  facilitySummaryStats,
  cleaningShifts,
  cleaningStaff,
  disposalFacilities,
  disposalMonitorData,
  disposalRecords,
  maintenanceRecords,
  maintenancePlans,
  faultAlarms,
  sortingPoints,
  sortingGuides,
  sortingRecords,
  sortingStats
} from '../data/facility';

export function mockQueryToiletMapList(params: MapReq): ApiResponse<any> {
  const { toiletName, region } = params;
  let filtered = toiletMapPoints;
  if (toiletName) {
    filtered = filtered.filter(item => item.toiletName.includes(toiletName));
  }
  if (region) {
    filtered = filtered.filter(item => item.region === region);
  }
  return {
    code: 0,
    message: 'success',
    data: filtered
  };
}

export function mockQueryToiletMonitorData(params: MonitorReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: toiletMonitorData
  };
}

export function mockQueryCleaningAttendance(params: AttendanceReq): ApiResponse<any> {
  const { staffName, date, pageNo, pageSize } = params;
  let filtered = cleaningAttendances;
  if (staffName) {
    filtered = filtered.filter(item => item.staffName.includes(staffName));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    }
  };
}

export function mockQueryCleaningShifts(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: cleaningShifts
  };
}

export function mockQueryCleaningStaff(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: cleaningStaff
  };
}

export function mockQueryInspectionRecords(params: InspectionReq): ApiResponse<any> {
  const { date, region, pageNo, pageSize } = params;
  let filtered = inspectionRecords;
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    }
  };
}

export function mockQueryFacilitySummaryStats(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: facilitySummaryStats
  };
}

export function mockQueryDisposalFacilities(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: disposalFacilities
  };
}

export function mockQueryDisposalMonitor(facilityId: string): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: disposalMonitorData[facilityId] || disposalMonitorData['DF001']
  };
}

export function mockQueryDisposalRecords(params: any): ApiResponse<any> {
  const { pageNo, pageSize, facilityId } = params;
  let filtered = disposalRecords;
  if (facilityId) {
    filtered = filtered.filter(item => item.facilityId === facilityId);
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    }
  };
}

export function mockQueryMaintenanceRecords(params: any): ApiResponse<any> {
  const { pageNo, pageSize, facilityId } = params;
  let filtered = maintenanceRecords;
  if (facilityId) {
    filtered = filtered.filter(item => item.facilityId === facilityId);
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    }
  };
}

export function mockQueryMaintenancePlans(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: maintenancePlans
  };
}

export function mockQueryFaultAlarms(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: faultAlarms
  };
}

// 垃圾分类 Mock Handlers
export function mockQuerySortingPoints(params: { name?: string; type?: string }): ApiResponse<any> {
  let filtered = [...sortingPoints];
  if (params.name) {
    filtered = filtered.filter(p => p.name.includes(params.name!));
  }
  if (params.type) {
    filtered = filtered.filter(p => p.type === params.type);
  }
  return { code: 0, message: 'success', data: filtered };
}

export function mockQuerySortingGuides(params: { category?: string; keyword?: string }): ApiResponse<any> {
  let filtered = [...sortingGuides];
  if (params.category) {
    filtered = filtered.filter(g => g.category === params.category);
  }
  if (params.keyword) {
    filtered = filtered.filter(g => g.name.includes(params.keyword!) || g.description.includes(params.keyword!));
  }
  return { code: 0, message: 'success', data: filtered };
}

export function mockQuerySortingRecords(params: { pageNo: number; pageSize: number; pointId?: string }): ApiResponse<any> {
  const { pageNo, pageSize, pointId } = params;
  let filtered = [...sortingRecords];
  if (pointId) {
    filtered = filtered.filter(r => r.pointId === pointId);
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    }
  };
}

export function mockQuerySortingStats(): ApiResponse<any> {
  return { code: 0, message: 'success', data: sortingStats };
}
