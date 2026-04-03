import axios from '../axios';
import { ApiResponse, PageParams, PageResult } from '../../types/api';
import { CollectionPointWeight, TransferStationStat, VehicleMeasurementRecord, EquipmentOperationRecord, VideoCamera, DrainageRecord, FlowCorrelation, TransferStatistics } from '../../types/transfer';
import { mockQueryCollectionPointWeights, mockQueryTransferStationStats, mockQueryVehicleMeasurementRecords, mockQueryEquipmentOperationRecords, mockQueryVideoCameras, mockQueryDrainageRecords, mockQueryFlowCorrelations, mockQueryTransferStatistics } from '../../../mock/handlers/transfer';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function queryCollectionPointWeights(params: PageParams & { pointName?: string }): Promise<ApiResponse<PageResult<CollectionPointWeight>>> {
  if (USE_MOCK) return mockQueryCollectionPointWeights(params);
  return axios.post('/api/transfer/collection-point/weight/list', params);
}

export async function queryTransferStationStats(): Promise<ApiResponse<TransferStationStat[]>> {
  if (USE_MOCK) return mockQueryTransferStationStats();
  return axios.post('/api/transfer/station/stats');
}

export async function queryVehicleMeasurementRecords(params: PageParams & { plateNo?: string; stationId?: string }): Promise<ApiResponse<PageResult<VehicleMeasurementRecord>>> {
  if (USE_MOCK) return mockQueryVehicleMeasurementRecords(params);
  return axios.post('/api/transfer/measurement/vehicle-records', params);
}

export async function queryEquipmentOperationRecords(params: PageParams & { equipmentType?: string; stationId?: string }): Promise<ApiResponse<PageResult<EquipmentOperationRecord>>> {
  if (USE_MOCK) return mockQueryEquipmentOperationRecords(params);
  return axios.post('/api/transfer/operation/equipment-records', params);
}

export async function queryVideoCameras(params: PageParams & { stationId?: string }): Promise<ApiResponse<PageResult<VideoCamera>>> {
  if (USE_MOCK) return mockQueryVideoCameras(params);
  return axios.post('/api/transfer/video/list', params);
}

export async function queryDrainageRecords(params: PageParams & { stationId?: string }): Promise<ApiResponse<PageResult<DrainageRecord>>> {
  if (USE_MOCK) return mockQueryDrainageRecords(params);
  return axios.post('/api/transfer/operation/drainage-records', params);
}

export async function queryFlowCorrelations(): Promise<ApiResponse<FlowCorrelation[]>> {
  if (USE_MOCK) return mockQueryFlowCorrelations();
  return axios.post('/api/transfer/measurement/flow-correlation');
}

export async function queryTransferStatistics(): Promise<ApiResponse<TransferStatistics>> {
  if (USE_MOCK) return mockQueryTransferStatistics();
  return axios.post('/api/transfer/statistics');
}
