export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type CaseStatus = 'pending' | 'processing' | 'resolved' | 'closed';
export type VehicleStatus = '作业中' | '待机' | '离线' | '巡查中';

export interface Vehicle {
  id: string;
  plateNo: string;
  type: string;
  location: string;
  status: VehicleStatus;
  consumption: string;
  loadRate: number;
  engineTemp: number;
  lat: number;
  lng: number;
}

export interface Case {
  id: string;
  title: string;
  type: string;
  description: string;
  priority: Priority;
  status: CaseStatus;
  location: string;
  locationName: string;
  reportTime: string;
  reporter: string;
  source: string;
  coordinates: string;
  grid: string;
  suggestedHandler: string;
  evidenceImages: string[];
}

export interface PublicToilet {
  id: string;
  name: string;
  location: string;
  status: '运行中' | '深度清洁中' | '耗材不足' | '需维护';
  envIndex: number;
  lastClean: string;
  lat: number;
  lng: number;
  nh3: number;
  h2s: number;
  paperStock: number;
  soapStock: number;
}

export interface RouteEfficiency {
  routeId: string;
  vehiclePlate: string;
  coveredPoints: string;
  expectedLoad: number;
  efficiency: number;
  status: string;
}

export interface VehicleTrack {
  id: string;
  vehicleId: string;
  plateNo: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export interface VehicleOperation {
  id: string;
  vehicleId: string;
  plateNo: string;
  driver: string;
  startTime: string;
  endTime: string;
  workArea: string;
  status: '进行中' | '已完成' | '异常';
  mileage: number;
}

export interface VehicleVideo {
  id: string;
  vehicleId: string;
  plateNo: string;
  channel: string;
  status: '在线' | '离线';
  url: string;
}

export interface VehicleAlarm {
  id: string;
  vehicleId: string;
  plateNo: string;
  alarmType: '超速' | '偏离路线' | '疲劳驾驶' | '设备故障';
  alarmTime: string;
  level: '严重' | '一般' | '轻微';
  status: '未处理' | '已处理';
  location: string;
}

export interface ElectronicFence {
  id: string;
  name: string;
  type: '禁行区' | '作业区' | '限速区';
  points: { lat: number; lng: number }[];
  status: '启用' | '停用';
  description: string;
}

export interface VehicleStats {
  totalVehicles: number;
  onlineVehicles: number;
  workingVehicles: number;
  totalMileage: number;
  totalAlarms: number;
  fuelConsumption: number;
}
