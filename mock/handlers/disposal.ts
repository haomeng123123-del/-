import { ApiResponse } from '../../src/types/api';
import { MeasurementReq, MeasurementStatsReq, PlantMonitorReq, KitchenProcessReq, VideoReq } from '../../src/types/disposal';
import { measurementRecords, measurementStats, landfillMonitorData, incinerationEnvData, kitchenProcessData, videoCameras } from '../data/disposal';

export function mockQueryMeasurementList(params: MeasurementReq): ApiResponse<any> {
  const { plantName, vehiclePlate, pageNo, pageSize } = params;
  let filtered = measurementRecords;
  if (plantName) {
    filtered = filtered.filter(item => item.plantName.includes(plantName));
  }
  if (vehiclePlate) {
    filtered = filtered.filter(item => item.vehiclePlate.includes(vehiclePlate));
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

export function mockQueryMeasurementStats(params: MeasurementStatsReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: measurementStats
  };
}

export function mockQueryLandfillMonitorData(params: PlantMonitorReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: landfillMonitorData
  };
}

export function mockQueryIncinerationEnvData(params: PlantMonitorReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: incinerationEnvData
  };
}

export function mockQueryKitchenProcessData(params: KitchenProcessReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: kitchenProcessData
  };
}

export function mockQueryVideoList(params: VideoReq): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: videoCameras
  };
}
