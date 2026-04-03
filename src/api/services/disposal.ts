import axios from '../axios';
import { ApiResponse } from '../../types/api';
import { MeasurementReq, MeasurementStatsReq, PlantMonitorReq, KitchenProcessReq, VideoReq } from '../../types/disposal';
import { mockQueryMeasurementList, mockQueryMeasurementStats, mockQueryLandfillMonitorData, mockQueryIncinerationEnvData, mockQueryKitchenProcessData, mockQueryVideoList } from '../../../mock/handlers/disposal';

export async function queryMeasurementList(params: MeasurementReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryMeasurementList(params);
  }
  return axios.post('/api/disposal/measurement/list', params);
}

export async function queryMeasurementStats(params: MeasurementStatsReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryMeasurementStats(params);
  }
  return axios.post('/api/disposal/measurement/stats', params);
}

export async function queryLandfillMonitorData(params: PlantMonitorReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryLandfillMonitorData(params);
  }
  return axios.post('/api/disposal/landfill/monitor', params);
}

export async function queryIncinerationEnvData(params: PlantMonitorReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryIncinerationEnvData(params);
  }
  return axios.post('/api/disposal/incineration/env-indicators', params);
}

export async function queryKitchenProcessData(params: KitchenProcessReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryKitchenProcessData(params);
  }
  return axios.post('/api/disposal/kitchen/process-indicators', params);
}

export async function queryVideoList(params: VideoReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryVideoList(params);
  }
  return axios.post('/api/disposal/video/list', params);
}
