import { ApiResponse } from '../../src/types/api';
import { 
  Inspector, Schedule, Patrol, Warning, SupervisionTask 
} from '../../src/types/cases';
import { 
  inspectorsData, schedulesData, patrolsData, warningsData, supervisionTasksData 
} from '../data/cases';

export function mockQueryInspectors(keyword?: string): ApiResponse<{ list: Inspector[]; total: number }> {
  let filtered = [...inspectorsData];
  if (keyword) {
    filtered = filtered.filter(i => 
      i.name.includes(keyword) || 
      i.phone.includes(keyword) || 
      i.area.includes(keyword)
    );
  }
  return { code: 0, message: 'success', data: { list: filtered, total: filtered.length } };
}

export function mockAddInspector(data: Partial<Inspector>): ApiResponse<Inspector> {
  const newInspector: Inspector = {
    ...data as any,
    id: `I${String(inspectorsData.length + 1).padStart(3, '0')}`,
    status: 'offline',
    lastActive: '-'
  };
  inspectorsData.unshift(newInspector);
  return { code: 0, message: 'success', data: newInspector };
}

export function mockUpdateInspector(data: Inspector): ApiResponse<Inspector> {
  const index = inspectorsData.findIndex(i => i.id === data.id);
  if (index > -1) {
    inspectorsData[index] = { ...inspectorsData[index], ...data };
    return { code: 0, message: 'success', data: inspectorsData[index] };
  }
  return { code: 1, message: 'not found', data: null as any };
}

export function mockDeleteInspector(id: string): ApiResponse<null> {
  const index = inspectorsData.findIndex(i => i.id === id);
  if (index > -1) inspectorsData.splice(index, 1);
  return { code: 0, message: 'success', data: null };
}

export function mockQuerySchedules(keyword?: string): ApiResponse<{ list: Schedule[]; total: number }> {
  let filtered = [...schedulesData];
  if (keyword) {
    filtered = filtered.filter(s => 
      s.inspector.includes(keyword) || 
      s.area.includes(keyword) || 
      s.shift.includes(keyword)
    );
  }
  return { code: 0, message: 'success', data: { list: filtered, total: filtered.length } };
}

export function mockAddSchedule(data: Partial<Schedule>): ApiResponse<Schedule> {
  const newSchedule: Schedule = {
    ...data as any,
    id: `S${String(schedulesData.length + 1).padStart(3, '0')}`,
    status: 'pending'
  };
  schedulesData.unshift(newSchedule);
  return { code: 0, message: 'success', data: newSchedule };
}

export function mockUpdateSchedule(data: Schedule): ApiResponse<Schedule> {
  const index = schedulesData.findIndex(i => i.id === data.id);
  if (index > -1) {
    schedulesData[index] = { ...schedulesData[index], ...data };
    return { code: 0, message: 'success', data: schedulesData[index] };
  }
  return { code: 1, message: 'not found', data: null as any };
}

export function mockDeleteSchedule(id: string): ApiResponse<null> {
  const index = schedulesData.findIndex(i => id === id);
  if (index > -1) schedulesData.splice(index, 1);
  return { code: 0, message: 'success', data: null };
}

export function mockQueryPatrols(keyword?: string): ApiResponse<{ list: Patrol[]; total: number }> {
  let filtered = [...patrolsData];
  if (keyword) {
    filtered = filtered.filter(p => 
      p.route.includes(keyword) || 
      p.inspector.includes(keyword)
    );
  }
  return { code: 0, message: 'success', data: { list: filtered, total: filtered.length } };
}

export function mockAddPatrol(data: Partial<Patrol>): ApiResponse<Patrol> {
  const newPatrol: Patrol = {
    ...data as any,
    id: `P${String(patrolsData.length + 1).padStart(3, '0')}`,
    progress: 0,
    status: 'in_progress',
    startTime: new Date().toLocaleString()
  };
  patrolsData.unshift(newPatrol);
  return { code: 0, message: 'success', data: newPatrol };
}

export function mockUpdatePatrol(data: Patrol): ApiResponse<Patrol> {
  const index = patrolsData.findIndex(i => i.id === data.id);
  if (index > -1) {
    patrolsData[index] = { ...patrolsData[index], ...data };
    return { code: 0, message: 'success', data: patrolsData[index] };
  }
  return { code: 1, message: 'not found', data: null as any };
}

export function mockDeletePatrol(id: string): ApiResponse<null> {
  const index = patrolsData.findIndex(i => i.id === id);
  if (index > -1) patrolsData.splice(index, 1);
  return { code: 0, message: 'success', data: null };
}

export function mockQueryWarnings(keyword?: string): ApiResponse<{ list: Warning[]; total: number }> {
  let filtered = [...warningsData];
  if (keyword) {
    filtered = filtered.filter(w => 
      w.type.includes(keyword) || 
      w.inspector.includes(keyword)
    );
  }
  return { code: 0, message: 'success', data: { list: filtered, total: filtered.length } };
}

export function mockUpdateWarning(data: Warning): ApiResponse<Warning> {
  const index = warningsData.findIndex(i => i.id === data.id);
  if (index > -1) {
    warningsData[index] = { ...warningsData[index], ...data };
    return { code: 0, message: 'success', data: warningsData[index] };
  }
  return { code: 1, message: 'not found', data: null as any };
}

export function mockDeleteWarning(id: string): ApiResponse<null> {
  const index = warningsData.findIndex(i => i.id === id);
  if (index > -1) warningsData.splice(index, 1);
  return { code: 0, message: 'success', data: null };
}

export function mockQuerySupervisionTasks(params: { type: string; keyword?: string }): ApiResponse<{ list: SupervisionTask[]; total: number }> {
  const { type, keyword } = params;
  let filtered = [...supervisionTasksData];
  
  if (type === 'dispatch') {
    filtered = filtered.filter(t => ['dispatched', 'draft'].includes(t.status));
  } else if (type === 'feedback') {
    filtered = filtered.filter(t => ['pending_feedback', 'feedback_submitted'].includes(t.status));
  } else if (type === 'review') {
    filtered = filtered.filter(t => ['pending_review', 'reviewed_passed', 'reviewed_rejected'].includes(t.status));
  }

  if (keyword) {
    filtered = filtered.filter(t => 
      t.name.includes(keyword) || 
      t.assignee.includes(keyword)
    );
  }

  return { code: 0, message: 'success', data: { list: filtered, total: filtered.length } };
}

export function mockAddSupervisionTask(data: Partial<SupervisionTask>): ApiResponse<SupervisionTask> {
  const newTask: SupervisionTask = {
    ...data as any,
    id: `T${String(supervisionTasksData.length + 1).padStart(3, '0')}`,
    status: 'draft'
  };
  supervisionTasksData.unshift(newTask);
  return { code: 0, message: 'success', data: newTask };
}

export function mockUpdateSupervisionTask(data: SupervisionTask): ApiResponse<SupervisionTask> {
  const index = supervisionTasksData.findIndex(i => i.id === data.id);
  if (index > -1) {
    supervisionTasksData[index] = { ...supervisionTasksData[index], ...data };
    return { code: 0, message: 'success', data: supervisionTasksData[index] };
  }
  return { code: 1, message: 'not found', data: null as any };
}

export function mockDeleteSupervisionTask(id: string): ApiResponse<null> {
  const index = supervisionTasksData.findIndex(i => i.id === id);
  if (index > -1) supervisionTasksData.splice(index, 1);
  return { code: 0, message: 'success', data: null };
}
