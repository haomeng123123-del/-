import axios from '../axios';
import { ApiResponse, PageParams, PageResult } from '../../types/api';
import { Vehicle, Case, PublicToilet, RouteEfficiency, VehicleTrack, VehicleOperation, VehicleVideo, VehicleAlarm, ElectronicFence, VehicleStats } from '../../types/sanitation';
import { mockQueryVehicles, mockQueryCases, mockQueryToilets, mockQueryRoutes, mockQueryVehicleTracks, mockQueryVehicleOperations, mockQueryVehicleVideos, mockQueryVehicleAlarms, mockQueryElectronicFences, mockQueryVehicleStats, mockAddCase, mockUpdateCase } from '../../../mock/handlers/sanitation';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function queryVehicles(params: PageParams & { plateNo?: string }): Promise<ApiResponse<PageResult<Vehicle>>> {
  if (USE_MOCK) return mockQueryVehicles(params);
  return axios.post('/api/sanitation/vehicle/list', params);
}

export async function queryVehicleTracks(params: PageParams & { plateNo?: string }): Promise<ApiResponse<PageResult<VehicleTrack>>> {
  if (USE_MOCK) return mockQueryVehicleTracks(params);
  return axios.post('/api/sanitation/vehicle/track/list', params);
}

export async function queryVehicleOperations(params: PageParams & { plateNo?: string }): Promise<ApiResponse<PageResult<VehicleOperation>>> {
  if (USE_MOCK) return mockQueryVehicleOperations(params);
  return axios.post('/api/sanitation/vehicle/operation/list', params);
}

export async function queryVehicleVideos(params: PageParams & { plateNo?: string }): Promise<ApiResponse<PageResult<VehicleVideo>>> {
  if (USE_MOCK) return mockQueryVehicleVideos(params);
  return axios.post('/api/sanitation/vehicle/video/list', params);
}

export async function queryVehicleAlarms(params: PageParams & { plateNo?: string }): Promise<ApiResponse<PageResult<VehicleAlarm>>> {
  if (USE_MOCK) return mockQueryVehicleAlarms(params);
  return axios.post('/api/sanitation/vehicle/alarm/list', params);
}

export async function queryElectronicFences(params: PageParams & { name?: string }): Promise<ApiResponse<PageResult<ElectronicFence>>> {
  if (USE_MOCK) return mockQueryElectronicFences(params);
  return axios.post('/api/sanitation/vehicle/fence/list', params);
}

export async function queryVehicleStats(): Promise<ApiResponse<VehicleStats>> {
  if (USE_MOCK) return mockQueryVehicleStats();
  return axios.post('/api/sanitation/vehicle/stats');
}

export async function queryCases(params: PageParams & { status?: string; keyword?: string }): Promise<ApiResponse<PageResult<Case>>> {
  if (USE_MOCK) return mockQueryCases(params);
  return axios.post('/api/sanitation/case/list', params);
}

export async function addCase(data: Partial<Case>): Promise<ApiResponse<Case>> {
  if (USE_MOCK) return mockAddCase(data);
  return axios.post('/api/sanitation/case/add', data);
}

export async function updateCase(data: Partial<Case>): Promise<ApiResponse<Case>> {
  if (USE_MOCK) return mockUpdateCase(data);
  return axios.post('/api/sanitation/case/update', data);
}

export async function queryToilets(): Promise<ApiResponse<PublicToilet[]>> {
  if (USE_MOCK) return mockQueryToilets();
  return axios.post('/api/sanitation/toilet/list');
}

export async function queryRoutes(): Promise<ApiResponse<RouteEfficiency[]>> {
  if (USE_MOCK) return mockQueryRoutes();
  return axios.post('/api/sanitation/route/list');
}
