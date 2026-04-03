import { ApiResponse } from '../../src/types/api';
import { BasicInfoReq, ReportReq, CollectionMonitorReq, TreatmentMonitorReq } from '../../src/types/sorting';
import { basicInfoData, reportData, collectionData, treatmentData } from '../data/sorting';

export function mockQueryBasicInfoList(params: BasicInfoReq): ApiResponse<any> {
  const { infoType, keyword, pageNo, pageSize } = params;
  let filtered = basicInfoData;
  if (infoType) {
    filtered = filtered.filter(item => item.type === infoType);
  }
  if (keyword) {
    filtered = filtered.filter(item => item.name.includes(keyword) || item.manager?.includes(keyword));
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

export function mockAddBasicInfo(data: any): ApiResponse<any> {
  const newRecord = {
    ...data,
    id: `B${String(basicInfoData.length + 1).padStart(3, '0')}`,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  basicInfoData.unshift(newRecord);
  return { code: 0, message: 'success', data: newRecord };
}

export function mockUpdateBasicInfo(data: any): ApiResponse<any> {
  const index = basicInfoData.findIndex(item => item.id === data.id);
  if (index > -1) {
    basicInfoData[index] = { ...basicInfoData[index], ...data };
  }
  return { code: 0, message: 'success', data: null };
}

export function mockDeleteBasicInfo(id: string): ApiResponse<any> {
  const index = basicInfoData.findIndex(item => item.id === id);
  if (index > -1) {
    basicInfoData.splice(index, 1);
  }
  return { code: 0, message: 'success', data: null };
}

export function mockQueryReportList(params: ReportReq): ApiResponse<any> {
  const { status, keyword, pageNo, pageSize } = params;
  let filtered = reportData;
  if (status) {
    filtered = filtered.filter(item => item.status === status);
  }
  if (keyword) {
    filtered = filtered.filter(item => 
      item.reporter.includes(keyword) || 
      item.category.includes(keyword) ||
      item.id.includes(keyword)
    );
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

export function mockAddReport(data: any): ApiResponse<any> {
  const newRecord = {
    ...data,
    id: `R${String(reportData.length + 1).padStart(3, '0')}`,
    submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  reportData.unshift(newRecord);
  return { code: 0, message: 'success', data: newRecord };
}

export function mockUpdateReport(data: any): ApiResponse<any> {
  const index = reportData.findIndex(item => item.id === data.id);
  if (index > -1) {
    reportData[index] = { ...reportData[index], ...data };
  }
  return { code: 0, message: 'success', data: null };
}

export function mockDeleteReport(id: string): ApiResponse<any> {
  const index = reportData.findIndex(item => item.id === id);
  if (index > -1) {
    reportData.splice(index, 1);
  }
  return { code: 0, message: 'success', data: null };
}

export function mockQueryCollectionList(params: CollectionMonitorReq): ApiResponse<any> {
  const { monitorType, keyword, pageNo, pageSize } = params;
  let filtered = collectionData;
  if (keyword) {
    filtered = filtered.filter(item => item.pointName.includes(keyword) || item.vehiclePlate.includes(keyword));
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

export function mockAddCollectionPlan(data: any): ApiResponse<any> {
  const newRecord = {
    ...data,
    id: `C${String(collectionData.length + 1).padStart(3, '0')}`,
    weight: 0,
    collectionTime: data.time.replace('T', ' '),
    status: '待收运'
  };
  collectionData.unshift(newRecord);
  return { code: 0, message: 'success', data: newRecord };
}

export function mockQueryTreatmentList(params: TreatmentMonitorReq): ApiResponse<any> {
  const { monitorType, keyword, pageNo, pageSize } = params;
  let filtered = treatmentData;
  if (keyword) {
    filtered = filtered.filter(item => item.facilityName.includes(keyword) || item.vehiclePlate.includes(keyword));
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
