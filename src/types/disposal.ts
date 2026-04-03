export interface MeasurementRecord {
  recordId: string;
  plantName: string;
  vehiclePlate: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  inTime: string;
  outTime: string;
}

export interface MeasurementStats {
  totalVehicles: number;
  totalWeight: number;
  byPlant: { name: string; vehicles: number; weight: number }[];
}

export interface LandfillMonitorData {
  leachateLevel: number;
  gasConcentration: { methane: number; h2s: number };
  alarms: { time: string; type: string; level: 'warning' | 'error' }[];
}

export interface IncinerationEnvData {
  emissions: { so2: number; nox: number; co: number; hcl: number; dust: number };
  equipmentStatus: 'normal' | 'maintenance' | 'fault';
  alarms: { time: string; type: string; level: 'warning' | 'error' }[];
}

export interface KitchenProcessData {
  equipmentStatus: 'normal' | 'maintenance' | 'fault';
  products: {
    oil: number;
    gas: number;
    solidWaste: number;
  };
  parameters: {
    temperature: number;
    pressure: number;
    ph: number;
    moisture: number;
  };
  alarms: { time: string; type: string; level: 'warning' | 'error' }[];
}

export interface VideoCamera {
  cameraId: string;
  cameraName: string;
  location: string;
  status: 'online' | 'offline';
  streamUrl: string;
}

export interface MeasurementReq {
  plantType: 'landfill' | 'incineration' | 'kitchen';
  plantName?: string;
  vehiclePlate?: string;
  startDate?: string;
  endDate?: string;
  pageNo: number;
  pageSize: number;
}

export interface MeasurementStatsReq {
  plantType: 'landfill' | 'incineration' | 'kitchen';
  date?: string;
}

export interface PlantMonitorReq {
  plantId: string;
}

export interface KitchenProcessReq {
  plantId: string;
  date?: string;
}

export interface VideoReq {
  plantType: 'landfill' | 'incineration' | 'kitchen';
  plantId?: string;
}
