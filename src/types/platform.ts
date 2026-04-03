import { LucideIcon } from 'lucide-react';

export interface VideoAnalysisEvent {
  id: string;
  type: 'illegal_dumping' | 'overflow' | 'unauthorized_parking' | 'littering';
  location: string;
  time: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  imageUrl: string;
  confidence: number;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'tracker' | 'camera' | 'scale';
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: string;
  location: string;
  data: Record<string, any>;
}

export interface IoTAlarm {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'offline' | 'threshold' | 'tamper';
  level: 'low' | 'medium' | 'high';
  time: string;
  status: 'active' | 'resolved';
  message: string;
}

export interface OrgNode {
  id: string;
  name: string;
  type: 'company' | 'department' | 'team';
  children?: OrgNode[];
}

export interface UserInfo {
  id: string;
  username: string;
  realName: string;
  role: string;
  org: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface RoleInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
  ip: string;
  status: 'success' | 'failure';
}
