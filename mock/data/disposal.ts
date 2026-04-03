import { MeasurementRecord, MeasurementStats, LandfillMonitorData, IncinerationEnvData, KitchenProcessData, VideoCamera } from '../../src/types/disposal';

export const measurementRecords: MeasurementRecord[] = Array.from({ length: 50 }).map((_, i) => ({
  recordId: `M${(i + 1).toString().padStart(4, '0')}`,
  plantName: ['老港填埋场', '黎明焚烧厂', '浦东餐厨厂'][i % 3],
  vehiclePlate: `沪A${Math.floor(Math.random() * 90000 + 10000)}`,
  grossWeight: Number((Math.random() * 10 + 15).toFixed(2)),
  tareWeight: Number((Math.random() * 2 + 4).toFixed(2)),
  netWeight: Number((Math.random() * 8 + 11).toFixed(2)),
  inTime: `2023-10-27 0${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
  outTime: `2023-10-27 0${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`
}));

export const measurementStats: MeasurementStats = {
  totalVehicles: 350,
  totalWeight: 3500.5,
  byPlant: [
    { name: '老港填埋场', vehicles: 200, weight: 2000.0 },
    { name: '黎明填埋场', vehicles: 150, weight: 1500.5 }
  ]
};

export const landfillMonitorData: LandfillMonitorData = {
  leachateLevel: 2.5,
  gasConcentration: { methane: 1.2, h2s: 0.05 },
  alarms: [
    { time: '10:00', type: '甲烷浓度偏高', level: 'warning' }
  ]
};

export const incinerationEnvData: IncinerationEnvData = {
  emissions: { so2: 15.2, nox: 45.5, co: 8.0, hcl: 5.1, dust: 2.3 },
  equipmentStatus: 'normal',
  alarms: []
};

export const kitchenProcessData: KitchenProcessData = {
  equipmentStatus: 'normal',
  products: {
    oil: 15.2,
    gas: 500.0,
    solidWaste: 45.0
  },
  parameters: {
    temperature: 60,
    pressure: 1.4,
    ph: 7.0,
    moisture: 80
  },
  alarms: [
    { time: '10:00', type: '温度异常', level: 'warning' }
  ]
};

export const videoCameras: VideoCamera[] = Array.from({ length: 10 }).map((_, i) => ({
  cameraId: `C${(i + 1).toString().padStart(3, '0')}`,
  cameraName: ['地磅入口监控', '卸料大厅监控', '渗滤液处理区监控', '焚烧炉监控'][i % 4],
  location: ['主入口', 'A区', 'B区', 'C区'][i % 4],
  status: Math.random() > 0.8 ? 'offline' : 'online',
  streamUrl: `http://example.com/stream/c${i + 1}`
}));
