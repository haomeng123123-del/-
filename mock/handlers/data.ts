import { ApiResponse, PageResult } from '../../src/types/api';
import { Facility, Department, BidSection, Enterprise, VehicleInfo, PersonnelInfo, WorkReport, FacilityQuery, WorkReportQuery } from '../../src/types/data';
import { facilities, departments, bidSections, enterprises, vehicles, personnel, workReports } from '../data/data';

// --- Facility Management ---

export function mockQueryFacilities(params: FacilityQuery): ApiResponse<PageResult<Facility>> {
  let filtered = facilities;
  if (params.name) {
    filtered = filtered.filter(f => f.name.includes(params.name!));
  }
  if (params.type) {
    filtered = filtered.filter(f => f.type === params.type);
  }
  if (params.status) {
    filtered = filtered.filter(f => f.status === params.status);
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

export function mockAddFacility(data: Facility): ApiResponse<null> {
  facilities.unshift({ ...data, id: `F${Date.now()}`, lastUpdate: new Date().toISOString().split('T')[0] });
  return { code: 0, message: 'success', data: null };
}

export function mockUpdateFacility(data: Facility): ApiResponse<null> {
  const index = facilities.findIndex(f => f.id === data.id);
  if (index !== -1) {
    facilities[index] = { ...data, lastUpdate: new Date().toISOString().split('T')[0] };
  }
  return { code: 0, message: 'success', data: null };
}

export function mockDeleteFacility(id: string): ApiResponse<null> {
  const index = facilities.findIndex(f => f.id === id);
  if (index !== -1) {
    facilities.splice(index, 1);
  }
  return { code: 0, message: 'success', data: null };
}

// --- Resource Management ---

export function mockQueryDepartments(): ApiResponse<Department[]> {
  return { code: 0, message: 'success', data: departments };
}

export function mockQueryBidSections(): ApiResponse<BidSection[]> {
  return { code: 0, message: 'success', data: bidSections };
}

export function mockQueryEnterprises(): ApiResponse<Enterprise[]> {
  return { code: 0, message: 'success', data: enterprises };
}

export function mockQueryVehicles(params: any): ApiResponse<PageResult<VehicleInfo>> {
  return {
    code: 0,
    message: 'success',
    data: {
      total: vehicles.length,
      list: vehicles.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockQueryPersonnel(params: any): ApiResponse<PageResult<PersonnelInfo>> {
  return {
    code: 0,
    message: 'success',
    data: {
      total: personnel.length,
      list: personnel.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize)
    }
  };
}

export function mockAddResource(type: string, data: any): ApiResponse<null> {
  const list = type === 'department' ? departments :
               type === 'bid_section' ? bidSections :
               type === 'enterprise' ? enterprises :
               type === 'vehicle' ? vehicles :
               personnel;
  list.unshift({ ...data, id: `${type.charAt(0).toUpperCase()}${Date.now()}` });
  return { code: 0, message: 'success', data: null };
}

export function mockUpdateResource(type: string, data: any): ApiResponse<null> {
  const list = type === 'department' ? departments :
               type === 'bid_section' ? bidSections :
               type === 'enterprise' ? enterprises :
               type === 'vehicle' ? vehicles :
               personnel;
  const index = list.findIndex((item: any) => item.id === data.id);
  if (index !== -1) {
    list[index] = { ...data };
  }
  return { code: 0, message: 'success', data: null };
}

export function mockDeleteResource(type: string, id: string): ApiResponse<null> {
  const list = type === 'department' ? departments :
               type === 'bid_section' ? bidSections :
               type === 'enterprise' ? enterprises :
               type === 'vehicle' ? vehicles :
               personnel;
  const index = list.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    list.splice(index, 1);
  }
  return { code: 0, message: 'success', data: null };
}

// --- Work Reporting ---

export function mockQueryWorkReports(params: WorkReportQuery): ApiResponse<PageResult<WorkReport>> {
  let filtered = workReports;
  if (params.title) {
    filtered = filtered.filter(r => r.title.includes(params.title!));
  }
  if (params.type) {
    filtered = filtered.filter(r => r.type === params.type);
  }
  if (params.status) {
    filtered = filtered.filter(r => r.status === params.status);
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

export function mockAddWorkReport(data: WorkReport): ApiResponse<null> {
  workReports.unshift({ ...data, id: `R${Date.now()}`, reportTime: new Date().toLocaleString(), status: 'pending' });
  return { code: 0, message: 'success', data: null };
}

export function mockAuditWorkReport(id: string, status: 'approved' | 'rejected', remarks?: string): ApiResponse<null> {
  const index = workReports.findIndex(r => r.id === id);
  if (index !== -1) {
    workReports[index].status = status;
    workReports[index].auditTime = new Date().toLocaleString();
    workReports[index].auditor = '当前用户';
    workReports[index].remarks = remarks;
  }
  return { code: 0, message: 'success', data: null };
}

export function mockDeleteWorkReport(id: string): ApiResponse<null> {
  const index = workReports.findIndex(r => r.id === id);
  if (index !== -1) {
    workReports.splice(index, 1);
  }
  return { code: 0, message: 'success', data: null };
}
