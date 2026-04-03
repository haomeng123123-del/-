import axios from '../axios';
import { ApiResponse } from '../../types/api';
import { 
  CollectionRouteReq, 
  CollectionRecordReq, 
  TrashBinReq, 
  CollectionPlanReq, 
  MechanizationReq 
} from '../../types/collection';
import { 
  mockQueryCollectionRoutes, 
  mockQueryCollectionRecords, 
  mockQueryTrashBins,
  mockQueryCollectionPlans,
  mockQueryCollectionStatistics,
  mockQueryMechanizationRecords
} from '../../../mock/handlers/collection';

export async function queryCollectionRoutes(params: CollectionRouteReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCollectionRoutes(params);
  }
  return axios.post('/api/collection/routes/list', params);
}

export async function queryCollectionRecords(params: CollectionRecordReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCollectionRecords(params);
  }
  return axios.post('/api/collection/records/list', params);
}

export async function queryTrashBins(params: TrashBinReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryTrashBins(params);
  }
  return axios.post('/api/collection/bins/list', params);
}

export async function queryCollectionPlans(params: CollectionPlanReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCollectionPlans(params);
  }
  return axios.post('/api/collection/plans/list', params);
}

export async function queryCollectionStatistics(): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryCollectionStatistics();
  }
  return axios.post('/api/collection/statistics');
}

export async function queryMechanizationRecords(params: MechanizationReq): Promise<ApiResponse<any>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryMechanizationRecords(params);
  }
  return axios.post('/api/collection/mechanization/list', params);
}
