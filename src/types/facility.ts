export interface ToiletMapPoint {
  toiletId: string;
  toiletName: string;
  region: string;
  location: string;
  longitude: number;
  latitude: number;
  status: 'normal' | 'offline' | 'alarm';
  odorLevel: number;
  passengerFlow: number;
  alarmCount: number;
  address: string;
  contact: string;
  phone: string;
  openTime: string;
  facilities: string[];
}

export interface ToiletMonitorData {
  toiletId: string;
  toiletName: string;
  odorTrend: { time: string; value: number }[];
  flowTrend: { time: string; value: number }[];
  alarms: {
    alarmId: string;
    time: string;
    type: string;
    value: string;
    status: 'handled' | 'unhandled';
    description: string;
  }[];
  realtime: {
    odor: number;
    ammonia: number;
    hydrogenSulfide: number;
    temperature: number;
    humidity: number;
    flow: number;
  };
}

export interface CleaningShift {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  staffCount: number;
  description: string;
}

export interface CleaningStaff {
  staffId: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  group: string;
  status: 'active' | 'on_leave' | 'inactive';
}

export interface CleaningAttendance {
  recordId: string;
  staffName: string;
  toiletName: string;
  shift: string;
  clockInTime: string;
  clockOutTime: string;
  status: 'normal' | 'late' | 'early_leave' | 'absent';
  date: string;
}

export interface InspectionRecord {
  inspectionId: string;
  toiletName: string;
  inspector: string;
  inspectionTime: string;
  score: number;
  issues: string;
  status: 'passed' | 'failed' | 'rectifying';
  region: string;
  details: {
    item: string;
    status: 'ok' | 'fail';
    comment: string;
  }[];
}

export interface FacilitySummaryStats {
  byCategory: { name: string; value: number }[];
  byRegion: { name: string; value: number }[];
  byPassengerFlow: { name: string; value: number }[];
  byArea: { name: string; value: number }[];
  bySquatCount: { name: string; value: number }[];
  byOperator: { name: string; value: number }[];
}

export interface MapReq {
  toiletName?: string;
  region?: string;
}

export interface MonitorReq {
  toiletId: string;
  startDate?: string;
  endDate?: string;
}

export interface AttendanceReq {
  staffName?: string;
  date?: string;
  pageNo: number;
  pageSize: number;
}

export interface InspectionReq {
  date?: string;
  region?: string;
  pageNo: number;
  pageSize: number;
}

export interface DisposalFacility {
  id: string;
  name: string;
  type: 'incineration' | 'landfill' | 'kitchen' | 'hazardous';
  status: 'normal' | 'maintenance' | 'alarm';
  address: string;
  capacity: number; // Daily capacity in tons
  currentLoad: number; // Current load in tons
  lat: number;
  lng: number;
  contact: string;
  phone: string;
  region: string;
}

export interface DisposalMonitorData {
  facilityId: string;
  timestamp: string;
  metrics: {
    temperature?: number;
    pressure?: number;
    powerUsage: number;
    waterUsage: number;
    // 填埋场指标
    leachateLevel?: number; // 渗滤液水位
    methaneConcentration?: number; // 甲烷浓度
    // 焚烧厂环保指标
    emissions?: {
      co: number;
      so2: number;
      nox: number;
      dust: number;
      hcl?: number;
      hf?: number;
    };
    // 餐厨处理指标
    sewageTreatment?: number; // 污水处理量
    solidResidue?: number; // 生活废渣量
    wasteOil?: number; // 废油脂量
    resourceProducts?: {
      fertilizer: number;
      biogas: number;
      sludge: number;
    };
  };
}

export interface DisposalRecord {
  recordId: string;
  facilityId: string;
  facilityName: string;
  wasteType: string;
  weight: number;
  source: string;
  time: string;
  operator: string;
}

export interface MaintenanceRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  type: 'routine' | 'repair' | 'upgrade';
  date: string;
  staff: string;
  description: string;
  result: 'success' | 'pending' | 'failed';
}

export interface MaintenancePlan {
  id: string;
  facilityId: string;
  facilityName: string;
  deviceName: string;
  cycle: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastTime: string;
  nextTime: string;
  status: 'active' | 'paused' | 'completed';
}

export interface FaultAlarm {
  id: string;
  facilityId: string;
  facilityName: string;
  deviceName: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  type: 'sensor' | 'mechanical' | 'electrical' | 'network';
  time: string;
  status: 'unhandled' | 'handling' | 'resolved';
  description: string;
}

// 垃圾分类系统
export interface SortingPoint {
  id: string;
  name: string;
  address: string;
  type: '小区' | '商业区' | '公共场所';
  bins: {
    type: '可回收物' | '有害垃圾' | '厨余垃圾' | '其他垃圾';
    status: number; // 满溢度 0-100
  }[];
  lat: number;
  lng: number;
  manager: string;
  phone: string;
}

export interface SortingGuide {
  id: string;
  name: string;
  category: '可回收物' | '有害垃圾' | '厨余垃圾' | '其他垃圾';
  description: string;
  tips: string[];
  imageUrl?: string;
}

export interface SortingRecord {
  id: string;
  pointId: string;
  pointName: string;
  category: string;
  weight: number;
  time: string;
  accuracy: number; // 准确率 0-100
}

export interface SortingStats {
  byCategory: { name: string; value: number }[];
  byAccuracy: { name: string; value: number }[];
  trend: { date: string; weight: number; accuracy: number }[];
  topPoints: { name: string; weight: number; accuracy: number }[];
}
