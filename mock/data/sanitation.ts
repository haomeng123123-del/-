import { Vehicle, Case, PublicToilet, RouteEfficiency, VehicleTrack, VehicleOperation, VehicleVideo, VehicleAlarm, ElectronicFence, VehicleStats, Priority, CaseStatus } from '../../src/types/sanitation';

export const vehicles: Vehicle[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `V${100 + i}`,
  plateNo: `沪A·${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
  type: i % 3 === 0 ? '湿垃圾清运' : i % 3 === 1 ? '高压冲洗' : '设备检修',
  location: ['静安区南京西路段', '徐汇区淮海中路', '普陀区金沙江路基地', '长宁区延安西路'][i % 4],
  status: ['作业中', '待机', '离线', '巡查中'][i % 4] as any,
  consumption: `${(10 + Math.random() * 10).toFixed(1)}L / 100km`,
  loadRate: Math.floor(Math.random() * 100),
  engineTemp: Math.floor(70 + Math.random() * 20),
  lat: 31.23 + Math.random() * 0.05,
  lng: 121.47 + Math.random() * 0.05,
}));

export const vehicleTracks: VehicleTrack[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `TRK-${i}`,
  vehicleId: vehicles[i % vehicles.length].id,
  plateNo: vehicles[i % vehicles.length].plateNo,
  lat: 31.23 + Math.random() * 0.05,
  lng: 121.47 + Math.random() * 0.05,
  speed: Math.floor(Math.random() * 60),
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
}));

export const vehicleOperations: VehicleOperation[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `OP-${i}`,
  vehicleId: vehicles[i % vehicles.length].id,
  plateNo: vehicles[i % vehicles.length].plateNo,
  driver: ['张三', '李四', '王五', '赵六'][i % 4],
  startTime: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
  endTime: new Date(Date.now() - i * 3600000).toISOString(),
  workArea: ['静安区', '徐汇区', '黄浦区', '长宁区'][i % 4],
  status: ['进行中', '已完成', '异常'][i % 3] as any,
  mileage: Math.floor(Math.random() * 100) + 10,
}));

export const vehicleVideos: VehicleVideo[] = vehicles.map((v, i) => ({
  id: `VID-${i}`,
  vehicleId: v.id,
  plateNo: v.plateNo,
  channel: `CH${(i % 4) + 1}`,
  status: i % 5 === 0 ? '离线' : '在线',
  url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
}));

export const vehicleAlarms: VehicleAlarm[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `ALM-${i}`,
  vehicleId: vehicles[i % vehicles.length].id,
  plateNo: vehicles[i % vehicles.length].plateNo,
  alarmType: ['超速', '偏离路线', '疲劳驾驶', '设备故障'][i % 4] as any,
  alarmTime: new Date(Date.now() - i * 1800000).toISOString(),
  level: ['严重', '一般', '轻微'][i % 3] as any,
  status: i % 2 === 0 ? '未处理' : '已处理',
  location: ['静安区南京西路', '徐汇区淮海中路', '黄浦区人民广场'][i % 3],
}));

export const electronicFences: ElectronicFence[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `FNC-${i}`,
  name: `测试围栏-${i + 1}`,
  type: ['禁行区', '作业区', '限速区'][i % 3] as any,
  points: [
    { lat: 31.23 + Math.random() * 0.01, lng: 121.47 + Math.random() * 0.01 },
    { lat: 31.24 + Math.random() * 0.01, lng: 121.48 + Math.random() * 0.01 },
    { lat: 31.25 + Math.random() * 0.01, lng: 121.46 + Math.random() * 0.01 },
  ],
  status: i % 4 === 0 ? '停用' : '启用',
  description: `这是一个${['禁行区', '作业区', '限速区'][i % 3]}的测试围栏`,
}));

export const vehicleStats: VehicleStats = {
  totalVehicles: 120,
  onlineVehicles: 98,
  workingVehicles: 85,
  totalMileage: 12500,
  totalAlarms: 15,
  fuelConsumption: 3200,
};

export const cases: Case[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `CASE-20231024${String(i + 1).padStart(2, '0')}`,
  title: ['中兴路垃圾堆积上报', '公园南路路灯破损', '草坪绿化带杂草清理', '违规倾倒建筑垃圾'][i % 4],
  type: ['暴露垃圾', '占道经营', '违规广告牌', '路面破损'][i % 4],
  description: '现场发现大量生活垃圾未及时清运，散发异味，影响周边居民生活。',
  priority: (['urgent', 'high', 'medium', 'low'][i % 4]) as Priority,
  status: (i < 5 ? 'pending' : i < 15 ? 'processing' : i < 20 ? 'resolved' : 'closed') as CaseStatus,
  location: ['静安区中兴路12号', '徐汇区公园南路', '长宁区延安西路', '普陀区真北路'][i % 4],
  locationName: ['静安区中兴路12号', '徐汇区公园南路', '长宁区延安西路', '普陀区真北路'][i % 4],
  reportTime: new Date(Date.now() - i * 3600000).toISOString(),
  reporter: ['张三', '李四', '王五', '赵六'][i % 4],
  source: 'AI视觉抓拍 (Cam #091)',
  coordinates: '31.2492° N, 121.4692° E',
  grid: '静安中心-04号网格',
  suggestedHandler: '张永平 (区域主管)',
  evidenceImages: [
    'https://picsum.photos/seed/waste1/400/300',
    'https://picsum.photos/seed/waste2/400/300'
  ]
}));

export const toilets: PublicToilet[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `WC-JA-${String(i + 1).padStart(3, '0')}`,
  name: ['南京西路152号', '久光百货东侧', '延安中路绿地', '静安寺广场'][i % 4],
  location: '静安区核心商务区',
  status: ['运行中', '深度清洁中', '耗材不足', '需维护'][i % 4] as any,
  envIndex: Math.floor(70 + Math.random() * 30),
  lastClean: `${Math.floor(Math.random() * 60)}分钟前`,
  lat: 31.22 + Math.random() * 0.02,
  lng: 121.45 + Math.random() * 0.02,
  nh3: 0.02,
  h2s: 0.005,
  paperStock: Math.floor(Math.random() * 100),
  soapStock: Math.floor(Math.random() * 100),
}));

export const routes: RouteEfficiency[] = Array.from({ length: 10 }).map((_, i) => ({
  routeId: `RT-${String(i + 90).padStart(3, '0')}-A`,
  vehiclePlate: `沪A·${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
  coveredPoints: `${Math.floor(Math.random() * 50)} / 50`,
  expectedLoad: parseFloat((Math.random() * 15).toFixed(1)),
  efficiency: Math.floor(Math.random() * 100),
  status: ['正常运行', '负载偏高', '即将完成', '待命中'][i % 4]
}));
