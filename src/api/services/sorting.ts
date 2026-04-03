import axios from '../axios';
import { ApiResponse } from '../../types/api';
import { BasicInfoReq, ReportReq, CollectionMonitorReq, TreatmentMonitorReq } from '../../types/sorting';
import { 
  mockQueryBasicInfoList, mockQueryReportList, mockQueryCollectionList, mockQueryTreatmentList,
  mockAddBasicInfo, mockUpdateBasicInfo, mockDeleteBasicInfo,
  mockAddReport, mockUpdateReport, mockDeleteReport,
  mockAddCollectionPlan
} from '../../../mock/handlers/sorting';

export async function queryBasicInfoList(params: BasicInfoReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryBasicInfoList(params);
  }
  return axios.post('/api/sorting/basic-info/list', params);
}

export async function addBasicInfo(data: any): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddBasicInfo(data);
  }
  return axios.post('/api/sorting/basic-info/add', data);
}

export async function updateBasicInfo(data: any): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateBasicInfo(data);
  }
  return axios.post('/api/sorting/basic-info/update', data);
}

export async function deleteBasicInfo(id: string): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteBasicInfo(id);
  }
  return axios.post('/api/sorting/basic-info/delete', { id });
}

export async function queryReportList(params: ReportReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryReportList(params);
  }
  return axios.post('/api/sorting/report/list', params);
}

export async function addReport(data: any): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddReport(data);
  }
  return axios.post('/api/sorting/report/add', data);
}

export async function updateReport(data: any): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateReport(data);
  }
  return axios.post('/api/sorting/report/update', data);
}

export async function deleteReport(id: string): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteReport(id);
  }
  return axios.post('/api/sorting/report/delete', { id });
}

export async function queryCollectionList(params: CollectionMonitorReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCollectionList(params);
  }
  return axios.post('/api/sorting/collection/list', params);
}

export async function addCollectionPlan(data: any): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddCollectionPlan(data);
  }
  return axios.post('/api/sorting/collection/add', data);
}

export async function queryTreatmentList(params: TreatmentMonitorReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryTreatmentList(params);
  }
  return axios.post('/api/sorting/treatment/list', params);
}
