import { ApiResponse } from '../../src/types/api';
import { 
  CollectionRouteReq, 
  CollectionRecordReq, 
  TrashBinReq, 
  CollectionPlanReq, 
  MechanizationReq 
} from '../../src/types/collection';
import { 
  collectionRoutes, 
  collectionRecords, 
  trashBins,
  collectionPlans,
  collectionStatistics,
  mechanizationRecords
} from '../data/collection';

export function mockQueryCollectionRoutes(params: CollectionRouteReq): ApiResponse<any> {
  const { routeName, status, pageNo, pageSize } = params;
  let filtered = collectionRoutes;
  if (routeName) {
    filtered = filtered.filter(item => item.routeName.includes(routeName));
  }
  if (status) {
    filtered = filtered.filter(item => item.status === status);
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

export function mockQueryCollectionRecords(params: CollectionRecordReq): ApiResponse<any> {
  const { date, plateNo, pageNo, pageSize } = params;
  let filtered = collectionRecords;
  if (date) {
    filtered = filtered.filter(item => item.startTime.startsWith(date));
  }
  if (plateNo) {
    filtered = filtered.filter(item => item.plateNo.includes(plateNo));
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

export function mockQueryTrashBins(params: TrashBinReq): ApiResponse<any> {
  const { region, status, pageNo, pageSize } = params;
  let filtered = trashBins;
  if (region) {
    filtered = filtered.filter(item => item.region === region);
  }
  if (status) {
    filtered = filtered.filter(item => item.status === status);
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

export function mockQueryCollectionPlans(params: CollectionPlanReq): ApiResponse<any> {
  const { planName, status, pageNo, pageSize } = params;
  let filtered = collectionPlans;
  if (planName) {
    filtered = filtered.filter(item => item.planName.includes(planName));
  }
  if (status) {
    filtered = filtered.filter(item => item.status === status);
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

export function mockQueryCollectionStatistics(): ApiResponse<any> {
  return {
    code: 0,
    message: 'success',
    data: collectionStatistics
  };
}

export function mockQueryMechanizationRecords(params: MechanizationReq): ApiResponse<any> {
  const { region, pageNo, pageSize } = params;
  let filtered = mechanizationRecords;
  if (region) {
    filtered = filtered.filter(item => item.region === region);
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
