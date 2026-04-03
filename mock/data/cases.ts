import { Case } from '../../src/types/sanitation';

export interface Inspector {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: 'online' | 'offline';
  lastActive: string;
}

export interface Schedule {
  id: string;
  date: string;
  shift: string;
  inspector: string;
  area: string;
  status: 'active' | 'pending';
}

export interface Patrol {
  id: string;
  route: string;
  inspector: string;
  progress: number;
  startTime: string;
  status: 'in_progress' | 'completed';
}

export interface Warning {
  id: string;
  type: string;
  inspector: string;
  time: string;
  level: 'high' | 'medium' | 'low';
  status: 'unhandled' | 'handled';
}

export interface SupervisionTask {
  id: string;
  name: string;
  assignee: string;
  deadline?: string;
  submitTime?: string;
  status: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

export let inspectorsData: Inspector[] = [
  { id: 'I001', name: '张建国', phone: '13800138001', area: '朝阳区一网格', status: 'online', lastActive: '2026-03-30 14:20:00' },
  { id: 'I002', name: '李明', phone: '13900139002', area: '朝阳区二网格', status: 'offline', lastActive: '2026-03-30 09:15:00' },
  { id: 'I003', name: '王强', phone: '13700137003', area: '海淀区一网格', status: 'online', lastActive: '2026-03-30 14:25:00' },
  { id: 'I004', name: '赵四', phone: '13600136004', area: '东城区一网格', status: 'online', lastActive: '2026-03-30 14:30:00' },
  { id: 'I005', name: '刘能', phone: '13500135005', area: '西城区一网格', status: 'offline', lastActive: '2026-03-29 16:45:00' },
  { id: 'I006', name: '孙美玲', phone: '13400134006', area: '丰台区三网格', status: 'online', lastActive: '2026-03-30 15:10:00' },
  { id: 'I007', name: '周大为', phone: '13300133007', area: '石景山二网格', status: 'online', lastActive: '2026-03-30 15:05:00' },
  { id: 'I008', name: '吴小莉', phone: '13200132008', area: '通州区一网格', status: 'offline', lastActive: '2026-03-30 11:30:00' },
];

export let schedulesData: Schedule[] = [
  { id: 'S001', date: '2026-03-30', shift: '早班 (08:00-16:00)', inspector: '张建国', area: '朝阳区一网格', status: 'active' },
  { id: 'S002', date: '2026-03-30', shift: '晚班 (16:00-00:00)', inspector: '李明', area: '朝阳区二网格', status: 'pending' },
  { id: 'S003', date: '2026-03-31', shift: '早班 (08:00-16:00)', inspector: '王强', area: '海淀区一网格', status: 'pending' },
  { id: 'S004', date: '2026-03-31', shift: '晚班 (16:00-00:00)', inspector: '赵四', area: '东城区一网格', status: 'pending' },
  { id: 'S005', date: '2026-04-01', shift: '早班 (08:00-16:00)', inspector: '孙美玲', area: '丰台区三网格', status: 'pending' },
  { id: 'S006', date: '2026-04-01', shift: '中班 (12:00-20:00)', inspector: '周大为', area: '石景山二网格', status: 'pending' },
];

export let patrolsData: Patrol[] = [
  { id: 'P001', route: '朝阳路线A', inspector: '张建国', progress: 80, startTime: '2026-03-30 08:30:00', status: 'in_progress' },
  { id: 'P002', route: '朝阳路线B', inspector: '李明', progress: 100, startTime: '2026-03-29 16:30:00', status: 'completed' },
  { id: 'P003', route: '海淀路线A', inspector: '王强', progress: 45, startTime: '2026-03-30 10:00:00', status: 'in_progress' },
  { id: 'P004', route: '东城巡查线', inspector: '赵四', progress: 20, startTime: '2026-03-30 14:00:00', status: 'in_progress' },
  { id: 'P005', route: '西城重点区', inspector: '刘能', progress: 100, startTime: '2026-03-29 09:00:00', status: 'completed' },
];

export let warningsData: Warning[] = [
  { id: 'W001', type: '偏离路线', inspector: '张建国', time: '2026-03-30 10:15:00', level: 'high', status: 'unhandled' },
  { id: 'W002', type: '长时间停留', inspector: '王强', time: '2026-03-30 11:20:00', level: 'medium', status: 'handled' },
  { id: 'W003', type: '设备离线', inspector: '李明', time: '2026-03-30 09:15:00', level: 'high', status: 'unhandled' },
  { id: 'W004', type: '未按时签到', inspector: '孙美玲', time: '2026-03-30 08:05:00', level: 'low', status: 'handled' },
  { id: 'W005', type: '电量过低', inspector: '周大为', time: '2026-03-30 14:45:00', level: 'medium', status: 'unhandled' },
];

export let supervisionTasksData: SupervisionTask[] = [
  { id: 'T001', name: '朝阳区重点区域卫生复查', assignee: '张建国', deadline: '2026-03-31 18:00:00', status: 'dispatched', priority: 'high' },
  { id: 'T002', name: '海淀区违规广告牌清理核实', assignee: '王强', deadline: '2026-04-01 12:00:00', status: 'draft', priority: 'medium' },
  { id: 'T003', name: '丰台区占道经营专项巡查', assignee: '李明', deadline: '2026-03-30 20:00:00', status: 'dispatched', priority: 'urgent' },
  { id: 'T004', name: '东城区垃圾分类桶站检查', assignee: '赵四', submitTime: '2026-03-30 14:30:00', status: 'pending_feedback', priority: 'medium' },
  { id: 'T005', name: '西城区路面破损修复确认', assignee: '刘能', submitTime: '2026-03-29 16:45:00', status: 'pending_review', priority: 'high' },
  { id: 'T006', name: '石景山区绿化带补种验收', assignee: '孙七', submitTime: '2026-03-28 10:20:00', status: 'reviewed_passed', priority: 'low' },
  { id: 'T007', name: '通州区共享单车乱停放整治', assignee: '周八', submitTime: '2026-03-29 09:15:00', status: 'reviewed_rejected', priority: 'medium' },
  { id: 'T008', name: '大兴区公厕卫生达标抽查', assignee: '郑九', deadline: '2026-04-02 10:00:00', status: 'dispatched', priority: 'medium' },
  { id: 'T009', name: '门头沟区河道垃圾清理督办', assignee: '冯十', submitTime: '2026-03-30 16:00:00', status: 'pending_review', priority: 'urgent' },
];
