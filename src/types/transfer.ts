export interface CollectionPointWeight {
  id: string;
  pointName: string;
  date: string;
  weight: number;
  region: string;
}

export interface TransferStationStat {
  stationId: string;
  stationName: string;
  todayTrips: number;
  todayWeight: number;
  region: string;
}

export interface VehicleMeasurementRecord {
  recordId: string;
  plateNo: string;
  stationName: string;
  entryTime: string;
  exitTime: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
}

export interface EquipmentOperationRecord {
  recordId: string;
  equipmentName: string;
  equipmentType: 'compressor' | 'deodorizer' | 'catalysis';
  stationName: string;
  status: 'normal' | 'warning' | 'error';
  recordTime: string;
  details: string;
}

export interface VideoCamera {
  cameraId: string;
  cameraName: string;
  stationName: string;
  status: 'online' | 'offline';
  streamUrl: string;
}

export interface DrainageRecord {
  id: string;
  stationName: string;
  time: string;
  flowRate: number; // m3/h
  ph: number;
  cod: number; // mg/L
  ammonia: number; // mg/L
  status: 'normal' | 'warning' | 'alarm';
}

export interface FlowCorrelation {
  source: string;
  target: string;
  value: number;
}

export interface TransferStatistics {
  totalWeight: number;
  monthlyWeight: number;
  dailyAverage: number;
  stationCount: number;
  regionalStats: { region: string; weight: number; percentage: number }[];
  monthlyTrend: { month: string; weight: number }[];
  equipmentUtilization: { name: string; rate: number }[];
}
