import axios from '../axios';
import { ApiResponse } from '../../types/api';
import { 
  Inspector, Schedule, Patrol, Warning, SupervisionTask 
} from '../../types/cases';
import { 
  mockQueryInspectors, 
  mockQuerySchedules, 
  mockQueryPatrols, 
  mockQueryWarnings, 
  mockQuerySupervisionTasks,
  mockAddInspector,
  mockUpdateInspector,
  mockDeleteInspector,
  mockAddSchedule,
  mockUpdateSchedule,
  mockDeleteSchedule,
  mockAddPatrol,
  mockUpdatePatrol,
  mockDeletePatrol,
  mockUpdateWarning,
  mockDeleteWarning,
  mockAddSupervisionTask,
  mockUpdateSupervisionTask,
  mockDeleteSupervisionTask
} from '../../../mock/handlers/cases';

export async function queryInspectors(keyword?: string): Promise<ApiResponse<{ list: Inspector[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryInspectors(keyword);
  }
  return axios.post('/api/cases/inspectors/list', { keyword });
}

export async function addInspector(data: Partial<Inspector>): Promise<ApiResponse<Inspector>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddInspector(data);
  }
  return axios.post('/api/cases/inspectors/add', data);
}

export async function updateInspector(data: Inspector): Promise<ApiResponse<Inspector>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateInspector(data);
  }
  return axios.post('/api/cases/inspectors/update', data);
}

export async function deleteInspector(id: string): Promise<ApiResponse<null>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteInspector(id);
  }
  return axios.post('/api/cases/inspectors/delete', { id });
}

export async function querySchedules(keyword?: string): Promise<ApiResponse<{ list: Schedule[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySchedules(keyword);
  }
  return axios.post('/api/cases/schedules/list', { keyword });
}

export async function addSchedule(data: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddSchedule(data);
  }
  return axios.post('/api/cases/schedules/add', data);
}

export async function updateSchedule(data: Schedule): Promise<ApiResponse<Schedule>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateSchedule(data);
  }
  return axios.post('/api/cases/schedules/update', data);
}

export async function deleteSchedule(id: string): Promise<ApiResponse<null>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteSchedule(id);
  }
  return axios.post('/api/cases/schedules/delete', { id });
}

export async function queryPatrols(keyword?: string): Promise<ApiResponse<{ list: Patrol[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryPatrols(keyword);
  }
  return axios.post('/api/cases/patrols/list', { keyword });
}

export async function addPatrol(data: Partial<Patrol>): Promise<ApiResponse<Patrol>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddPatrol(data);
  }
  return axios.post('/api/cases/patrols/add', data);
}

export async function updatePatrol(data: Patrol): Promise<ApiResponse<Patrol>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdatePatrol(data);
  }
  return axios.post('/api/cases/patrols/update', data);
}

export async function deletePatrol(id: string): Promise<ApiResponse<null>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeletePatrol(id);
  }
  return axios.post('/api/cases/patrols/delete', { id });
}

export async function queryWarnings(keyword?: string): Promise<ApiResponse<{ list: Warning[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQueryWarnings(keyword);
  }
  return axios.post('/api/cases/warnings/list', { keyword });
}

export async function updateWarning(data: Warning): Promise<ApiResponse<Warning>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateWarning(data);
  }
  return axios.post('/api/cases/warnings/update', data);
}

export async function deleteWarning(id: string): Promise<ApiResponse<null>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteWarning(id);
  }
  return axios.post('/api/cases/warnings/delete', { id });
}

export async function querySupervisionTasks(params: { type: string; keyword?: string }): Promise<ApiResponse<{ list: SupervisionTask[] }>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockQuerySupervisionTasks(params);
  }
  return axios.post('/api/cases/tasks/list', params);
}

export async function addSupervisionTask(data: Partial<SupervisionTask>): Promise<ApiResponse<SupervisionTask>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockAddSupervisionTask(data);
  }
  return axios.post('/api/cases/tasks/add', data);
}

export async function updateSupervisionTask(data: SupervisionTask): Promise<ApiResponse<SupervisionTask>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockUpdateSupervisionTask(data);
  }
  return axios.post('/api/cases/tasks/update', data);
}

export async function deleteSupervisionTask(id: string): Promise<ApiResponse<null>> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockDeleteSupervisionTask(id);
  }
  return axios.post('/api/cases/tasks/delete', { id });
}
