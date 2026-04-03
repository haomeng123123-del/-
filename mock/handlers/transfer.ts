import { ApiResponse, PageParams, PageResult } from '../../src/types/api';
import { CollectionPointWeight, TransferStationStat, VehicleMeasurementRecord, EquipmentOperationRecord, VideoCamera } from '../../src/types/transfer';
import { collectionPointWeights, transferStationStats, vehicleMeasurementRecords, equipmentOperationRecords, videoCameras, drainageRecords, flowCorrelations } from '../data/transfer';

export function mockQueryCollectionPointWeights(params: PageParams & { pointName?: string }): ApiResponse<PageResult<CollectionPointWeight>> {
  let filtered = collectionPointWeights;
  if (params.pointName) {
    filtered = filtered.filter(item => item.pointName.includes(params.pointName!));
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

export function mockQueryTransferStationStats(): ApiResponse<TransferStationStat[]> {
  return {
    code: 0,
    message: 'success',
    data: transferStationStats
  };
}

export function mockQueryVehicleMeasurementRecords(params: PageParams & { plateNo?: string; stationId?: string }): ApiResponse<PageResult<VehicleMeasurementRecord>> {
  let filtered = vehicleMeasurementRecords;
  if (params.plateNo) {
    filtered = filtered.filter(item => item.plateNo.includes(params.plateNo!));
  }
  if (params.stationId) {
    filtered = filtered.filter(item => item.stationName.includes(params.stationId!));
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

export function mockQueryEquipmentOperationRecords(params: PageParams & { equipmentType?: string; stationId?: string }): ApiResponse<PageResult<EquipmentOperationRecord>> {
  let filtered = equipmentOperationRecords;
  if (params.equipmentType) {
    filtered = filtered.filter(item => item.equipmentType === params.equipmentType);
  }
  if (params.stationId) {
    filtered = filtered.filter(item => item.stationName.includes(params.stationId!));
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

export function mockQueryVideoCameras(params: PageParams & { stationId?: string }): ApiResponse<PageResult<VideoCamera>> {
  let filtered = videoCameras;
  if (params.stationId) {
    filtered = filtered.filter(item => item.stationName.includes(params.stationId!));
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

export function mockQueryDrainageRecords(params: PageParams & { stationId?: string }): ApiResponse<PageResult<any>> {
  let filtered = drainageRecords;
  if (params.stationId) {
    filtered = filtered.filter(item => item.stationName.includes(params.stationId!));
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

export function mockQueryFlowCorrelations(): ApiResponse<any[]> {
  return {
    code: 0,
    message: 'success',
    data: flowCorrelations
  };
}

export function mockQueryTransferStatistics(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: {
      totalWeight: 125840.5,
      monthlyWeight: 12584.2,
      dailyAverage: 419.5,
      stationCount: 15,
      regionalStats: [
        { region: '普陀区', weight: 4500, percentage: 35.7 },
        { region: '徐汇区', weight: 3800, percentage: 30.2 },
        { region: '长宁区', weight: 2500, percentage: 19.8 },
        { region: '静安区', weight: 1784.2, percentage: 14.3 }
      ],
      monthlyTrend: [
        { month: '1月', weight: 11200 },
        { month: '2月', weight: 10500 },
        { month: '3月', weight: 12584.2 }
      ],
      equipmentUtilization: [
        { name: '压缩机', rate: 88.5 },
        { name: '除臭系统', rate: 95.2 },
        { name: '地磅', rate: 98.8 },
        { name: '监控系统', rate: 99.5 }
      ]
    }
  };
}
