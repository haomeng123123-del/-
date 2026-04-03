import axios from '../axios';
import { ApiResponse, PageResult } from '../../types/api';
import { Facility, Department, BidSection, Enterprise, VehicleInfo, PersonnelInfo, WorkReport, FacilityQuery, WorkReportQuery } from '../../types/data';
import { 
  mockQueryFacilities, mockAddFacility, mockUpdateFacility, mockDeleteFacility,
  mockQueryDepartments, mockQueryBidSections, mockQueryEnterprises, mockQueryVehicles, mockQueryPersonnel,
  mockAddResource, mockUpdateResource, mockDeleteResource,
  mockQueryWorkReports, mockAddWorkReport, mockAuditWorkReport, mockDeleteWorkReport
} from '../../../mock/handlers/data';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// --- Facility Management ---

export async function queryFacilities(params: FacilityQuery): Promise<ApiResponse<PageResult<Facility>>> {
  if (USE_MOCK) return mockQueryFacilities(params);
  return axios.post('/api/data/facility/list', params);
}

export async function addFacility(data: Facility): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockAddFacility(data);
  return axios.post('/api/data/facility/add', data);
}

export async function updateFacility(data: Facility): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockUpdateFacility(data);
  return axios.post('/api/data/facility/update', data);
}

export async function deleteFacility(id: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockDeleteFacility(id);
  return axios.post('/api/data/facility/delete', { id });
}

// --- Resource Management ---

export async function queryDepartments(): Promise<ApiResponse<Department[]>> {
  if (USE_MOCK) return mockQueryDepartments();
  return axios.post('/api/data/resource/department/list');
}

export async function queryBidSections(): Promise<ApiResponse<BidSection[]>> {
  if (USE_MOCK) return mockQueryBidSections();
  return axios.post('/api/data/resource/bid-section/list');
}

export async function queryEnterprises(): Promise<ApiResponse<Enterprise[]>> {
  if (USE_MOCK) return mockQueryEnterprises();
  return axios.post('/api/data/resource/enterprise/list');
}

export async function queryVehicles(params: any): Promise<ApiResponse<PageResult<VehicleInfo>>> {
  if (USE_MOCK) return mockQueryVehicles(params);
  return axios.post('/api/data/resource/vehicle/list', params);
}

export async function queryPersonnel(params: any): Promise<ApiResponse<PageResult<PersonnelInfo>>> {
  if (USE_MOCK) return mockQueryPersonnel(params);
  return axios.post('/api/data/resource/personnel/list', params);
}

export async function addResource(type: string, data: any): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockAddResource(type, data);
  return axios.post(`/api/data/resource/${type}/add`, data);
}

export async function updateResource(type: string, data: any): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockUpdateResource(type, data);
  return axios.post(`/api/data/resource/${type}/update`, data);
}

export async function deleteResource(type: string, id: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockDeleteResource(type, id);
  return axios.post(`/api/data/resource/${type}/delete`, { id });
}

// --- Work Reporting ---

export async function queryWorkReports(params: WorkReportQuery): Promise<ApiResponse<PageResult<WorkReport>>> {
  if (USE_MOCK) return mockQueryWorkReports(params);
  return axios.post('/api/data/report/list', params);
}

export async function addWorkReport(data: WorkReport): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockAddWorkReport(data);
  return axios.post('/api/data/report/add', data);
}

export async function auditWorkReport(id: string, status: 'approved' | 'rejected', remarks?: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockAuditWorkReport(id, status, remarks);
  return axios.post('/api/data/report/audit', { id, status, remarks });
}

export async function deleteWorkReport(id: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) return mockDeleteWorkReport(id);
  return axios.post('/api/data/report/delete', { id });
}
