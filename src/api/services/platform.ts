import axios from '../axios';
import { ApiResponse, PageResult } from '../../types/api';
import { VideoAnalysisEvent, IoTDevice, IoTAlarm, OrgNode, UserInfo, RoleInfo, SystemLog } from '../../types/platform';
import { 
  mockQueryVideoEvents, mockQueryIoTDevices, mockQueryIoTAlarms, 
  mockQueryOrgTree, mockQueryUsers, mockQueryRoles, mockQueryLogs 
} from '../../../mock/handlers/platform';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// --- Video Analysis ---
export async function queryVideoEvents(params: any): Promise<ApiResponse<PageResult<VideoAnalysisEvent>>> {
  if (USE_MOCK) return mockQueryVideoEvents(params);
  return axios.post('/api/platform/video/events', params);
}

// --- IoT Data ---
export async function queryIoTDevices(params: any): Promise<ApiResponse<PageResult<IoTDevice>>> {
  if (USE_MOCK) return mockQueryIoTDevices(params);
  return axios.post('/api/platform/iot/devices', params);
}

export async function queryIoTAlarms(params: any): Promise<ApiResponse<PageResult<IoTAlarm>>> {
  if (USE_MOCK) return mockQueryIoTAlarms(params);
  return axios.post('/api/platform/iot/alarms', params);
}

// --- Config ---
export async function queryOrgTree(): Promise<ApiResponse<OrgNode[]>> {
  if (USE_MOCK) return mockQueryOrgTree();
  return axios.post('/api/settings/org/tree');
}

export async function queryUsers(params: any): Promise<ApiResponse<PageResult<UserInfo>>> {
  if (USE_MOCK) return mockQueryUsers(params);
  return axios.post('/api/settings/users/list', params);
}

export async function queryRoles(): Promise<ApiResponse<RoleInfo[]>> {
  if (USE_MOCK) return mockQueryRoles();
  return axios.post('/api/settings/roles/list');
}

export async function queryLogs(params: any): Promise<ApiResponse<PageResult<SystemLog>>> {
  if (USE_MOCK) return mockQueryLogs(params);
  return axios.post('/api/settings/logs/list', params);
}
