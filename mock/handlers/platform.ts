import { VideoAnalysisEvent, IoTDevice, IoTAlarm, OrgNode, UserInfo, RoleInfo, SystemLog } from '../../src/types/platform';
import { ApiResponse, PageResult } from '../../src/types/api';

// --- Video Analysis ---
export const videoEvents: VideoAnalysisEvent[] = [
  { id: 'VA001', type: 'illegal_dumping', location: '南湖路与滨江路交叉口', time: '2026-03-30 08:30:15', status: 'pending', imageUrl: 'https://picsum.photos/seed/dumping/800/600', confidence: 0.92 },
  { id: 'VA002', type: 'overflow', location: '滨江路垃圾站', time: '2026-03-30 08:45:22', status: 'processing', imageUrl: 'https://picsum.photos/seed/overflow/800/600', confidence: 0.88 },
  { id: 'VA003', type: 'unauthorized_parking', location: '环卫作业车库', time: '2026-03-30 09:10:05', status: 'completed', imageUrl: 'https://picsum.photos/seed/parking/800/600', confidence: 0.95 },
  { id: 'VA004', type: 'littering', location: '南湖公园入口', time: '2026-03-30 09:25:48', status: 'pending', imageUrl: 'https://picsum.photos/seed/littering/800/600', confidence: 0.82 },
];

// --- IoT Data ---
export const iotDevices: IoTDevice[] = [
  { id: 'IOT001', name: '滨江路垃圾桶传感器', type: 'sensor', status: 'online', lastHeartbeat: '2026-03-30 09:50:00', location: '滨江路', data: { fillLevel: 75, battery: 88 } },
  { id: 'IOT002', name: '环卫车 GPS-01', type: 'tracker', status: 'online', lastHeartbeat: '2026-03-30 09:51:12', location: '南湖路', data: { speed: 35, fuel: 62 } },
  { id: 'IOT003', name: '转运站地磅-01', type: 'scale', status: 'offline', lastHeartbeat: '2026-03-30 08:00:00', location: '滨江转运站', data: { weight: 0 } },
  { id: 'IOT004', name: '南湖公园监控-01', type: 'camera', status: 'online', lastHeartbeat: '2026-03-30 09:52:45', location: '南湖公园', data: { fps: 25, bitrate: '4Mbps' } },
];

export const iotAlarms: IoTAlarm[] = [
  { id: 'ALM001', deviceId: 'IOT003', deviceName: '转运站地磅-01', type: 'offline', level: 'high', time: '2026-03-30 08:05:00', status: 'active', message: '设备离线超过 30 分钟' },
  { id: 'ALM002', deviceId: 'IOT001', deviceName: '滨江路垃圾桶传感器', type: 'threshold', level: 'medium', time: '2026-03-30 09:30:00', status: 'resolved', message: '垃圾桶满溢预警' },
];

// --- Config ---
export const orgTree: OrgNode[] = [
  {
    id: 'ORG001',
    name: '智慧环卫集团',
    type: 'company',
    children: [
      {
        id: 'ORG002',
        name: '运营管理部',
        type: 'department',
        children: [
          { id: 'ORG003', name: '清扫一队', type: 'team' },
          { id: 'ORG004', name: '清扫二队', type: 'team' },
        ]
      },
      {
        id: 'ORG005',
        name: '设施维护部',
        type: 'department',
        children: [
          { id: 'ORG006', name: '公厕维护组', type: 'team' },
          { id: 'ORG007', name: '转运站维护组', type: 'team' },
        ]
      },
      { id: 'ORG008', name: '财务部', type: 'department' },
      { id: 'ORG009', name: '人事部', type: 'department' },
    ]
  }
];

export const users: UserInfo[] = [
  { id: 'U001', username: 'admin', realName: '系统管理员', role: '超级管理员', org: '智慧环卫集团', status: 'active', lastLogin: '2026-03-30 08:00:00' },
  { id: 'U002', username: 'zhangsan', realName: '张三', role: '运营主管', org: '运营管理部', status: 'active', lastLogin: '2026-03-30 09:15:00' },
  { id: 'U003', username: 'lisi', realName: '李四', role: '清扫队长', org: '清扫一队', status: 'active', lastLogin: '2026-03-29 17:30:00' },
  { id: 'U004', username: 'wangwu', realName: '王五', role: '维护组长', org: '公厕维护组', status: 'inactive', lastLogin: '2026-03-25 10:00:00' },
];

export const roles: RoleInfo[] = [
  { id: 'R001', name: '超级管理员', code: 'SUPER_ADMIN', description: '拥有系统所有权限', permissions: ['all'] },
  { id: 'R002', name: '运营主管', code: 'OPER_MANAGER', description: '负责运营数据查看与管理', permissions: ['data_view', 'oper_manage'] },
  { id: 'R003', name: '清扫队长', code: 'CLEAN_LEADER', description: '负责队伍作业监管', permissions: ['team_manage', 'track_view'] },
];

export const systemLogs: SystemLog[] = [
  { id: 'L001', user: 'admin', action: '登录系统', module: '系统登录', time: '2026-03-30 08:00:00', ip: '192.168.1.100', status: 'success' },
  { id: 'L002', user: 'zhangsan', action: '修改用户信息', module: '用户管理', time: '2026-03-30 09:20:15', ip: '192.168.1.102', status: 'success' },
  { id: 'L003', user: 'lisi', action: '删除作业记录', module: '作业管理', time: '2026-03-30 09:45:10', ip: '192.168.1.105', status: 'failure' },
];

// --- Handlers ---
export function mockQueryVideoEvents(params: any): ApiResponse<PageResult<VideoAnalysisEvent>> {
  return { code: 0, message: 'success', data: { total: videoEvents.length, list: videoEvents } };
}

export function mockQueryIoTDevices(params: any): ApiResponse<PageResult<IoTDevice>> {
  return { code: 0, message: 'success', data: { total: iotDevices.length, list: iotDevices } };
}

export function mockQueryIoTAlarms(params: any): ApiResponse<PageResult<IoTAlarm>> {
  return { code: 0, message: 'success', data: { total: iotAlarms.length, list: iotAlarms } };
}

export function mockQueryOrgTree(): ApiResponse<OrgNode[]> {
  return { code: 0, message: 'success', data: orgTree };
}

export function mockQueryUsers(params: any): ApiResponse<PageResult<UserInfo>> {
  return { code: 0, message: 'success', data: { total: users.length, list: users } };
}

export function mockQueryRoles(): ApiResponse<RoleInfo[]> {
  return { code: 0, message: 'success', data: roles };
}

export function mockQueryLogs(params: any): ApiResponse<PageResult<SystemLog>> {
  return { code: 0, message: 'success', data: { total: systemLogs.length, list: systemLogs } };
}
