import { PageParams, PageResult } from './api';

// --- Facility Management ---

export interface Facility {
  id: string;
  name: string;
  type: 'toilet' | 'collection_point' | 'transfer_station' | 'rest_room' | 'disposal_site' | 'sorting_collection' | 'sorting_treatment';
  address: string;
  manager: string;
  contact: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdate: string;
}

export interface FacilityQuery extends PageParams {
  name?: string;
  type?: string;
  status?: string;
}

// --- Resource Management ---

export interface Department {
  id: string;
  name: string;
  parentName: string;
  manager: string;
  phone: string;
}

export interface BidSection {
  id: string;
  name: string;
  area: number; // square meters
  enterprise: string;
  manager: string;
}

export interface Enterprise {
  id: string;
  name: string;
  type: string;
  manager: string;
  phone: string;
}

export interface VehicleInfo {
  id: string;
  plateNo: string;
  type: string;
  enterprise: string;
  status: 'online' | 'offline' | 'maintenance';
}

export interface PersonnelInfo {
  id: string;
  name: string;
  gender: string;
  age: number;
  position: string;
  enterprise: string;
  phone: string;
}

// --- Work Reporting ---

export interface WorkReport {
  id: string;
  title: string;
  type: 'daily' | 'bid_section' | 'solid_waste' | 'kitchen_waste' | 'construction';
  unit: string;
  reporter: string;
  reportTime: string;
  status: 'pending' | 'approved' | 'rejected';
  auditTime?: string;
  auditor?: string;
  remarks?: string;
}

export interface WorkReportQuery extends PageParams {
  title?: string;
  type?: string;
  status?: string;
}
