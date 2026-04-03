import { ApiResponse, PageParams, PageResult } from '../../src/types/api';
import { Vehicle, Case, PublicToilet, RouteEfficiency, VehicleTrack, VehicleOperation, VehicleVideo, VehicleAlarm, ElectronicFence, VehicleStats } from '../../src/types/sanitation';
import { vehicles, cases, toilets, routes, vehicleTracks, vehicleOperations, vehicleVideos, vehicleAlarms, electronicFences, vehicleStats } from '../data/sanitation';

export function mockQueryVehicles(params: PageParams & { plateNo?: string }): ApiResponse<PageResult<Vehicle>> {
  let filtered = vehicles;
  if (params.plateNo) {
    filtered = filtered.filter(v => v.plateNo.includes(params.plateNo!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryVehicleTracks(params: PageParams & { plateNo?: string }): ApiResponse<PageResult<VehicleTrack>> {
  let filtered = vehicleTracks;
  if (params.plateNo) {
    filtered = filtered.filter(t => t.plateNo.includes(params.plateNo!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryVehicleOperations(params: PageParams & { plateNo?: string }): ApiResponse<PageResult<VehicleOperation>> {
  let filtered = vehicleOperations;
  if (params.plateNo) {
    filtered = filtered.filter(o => o.plateNo.includes(params.plateNo!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryVehicleVideos(params: PageParams & { plateNo?: string }): ApiResponse<PageResult<VehicleVideo>> {
  let filtered = vehicleVideos;
  if (params.plateNo) {
    filtered = filtered.filter(v => v.plateNo.includes(params.plateNo!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryVehicleAlarms(params: PageParams & { plateNo?: string }): ApiResponse<PageResult<VehicleAlarm>> {
  let filtered = vehicleAlarms;
  if (params.plateNo) {
    filtered = filtered.filter(a => a.plateNo.includes(params.plateNo!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryElectronicFences(params: PageParams & { name?: string }): ApiResponse<PageResult<ElectronicFence>> {
  let filtered = electronicFences;
  if (params.name) {
    filtered = filtered.filter(f => f.name.includes(params.name!));
  }
  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      list: filtered.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryVehicleStats(): ApiResponse<VehicleStats> {
  return {
    code: 0,
    message: 'success',
    data: vehicleStats
  };
}

export function mockQueryCases(params: PageParams & { status?: string; keyword?: string }): ApiResponse<PageResult<Case>> {
  const { pageNo = 1, pageSize = 10, keyword, status } = params;
  let filtered = [...cases];

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status === status);
  }

  if (keyword) {
    filtered = filtered.filter(item => 
      item.id.toLowerCase().includes(keyword.toLowerCase()) || 
      item.title.toLowerCase().includes(keyword.toLowerCase()) || 
      item.location.toLowerCase().includes(keyword.toLowerCase()) ||
      item.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const total = filtered.length;
  const list = filtered.slice((pageNo - 1) * pageSize, pageNo * pageSize);

  return {
    code: 0,
    message: 'success',
    data: { list, total }
  };
}

export function mockAddCase(data: Partial<Case>): ApiResponse<Case> {
  const newCase: Case = {
    id: `CASE${Date.now()}`,
    title: data.title || '新案件',
    type: data.type || '暴露垃圾',
    location: data.location || '',
    locationName: data.locationName || data.location || '',
    description: data.description || '',
    priority: data.priority || 'medium',
    status: 'pending',
    reportTime: new Date().toISOString(),
    reporter: data.reporter || '系统管理员',
    source: data.source || '系统上报',
    coordinates: data.coordinates || '116.40, 39.90',
    grid: data.grid || '默认网格',
    suggestedHandler: data.suggestedHandler || '待分配',
    evidenceImages: data.evidenceImages || [],
    ...data,
  } as Case;
  cases.unshift(newCase);
  return {
    code: 0,
    message: 'success',
    data: newCase
  };
}

export function mockUpdateCase(data: Partial<Case>): ApiResponse<Case> {
  const index = cases.findIndex(item => item.id === data.id);
  if (index !== -1) {
    cases[index] = { ...cases[index], ...data };
    return {
      code: 0,
      message: 'success',
      data: cases[index]
    };
  }
  return {
    code: 10002,
    message: '案件不存在',
    data: null as any
  };
}

export function mockQueryToilets(): ApiResponse<PublicToilet[]> {
  return {
    code: 0,
    message: 'success',
    data: toilets
  };
}

export function mockQueryRoutes(): ApiResponse<RouteEfficiency[]> {
  return {
    code: 0,
    message: 'success',
    data: routes
  };
}
