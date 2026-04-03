import { 
  CollectionRoute, 
  CollectionRecord, 
  TrashBin,
  CollectionPlan,
  CollectionStatistic,
  MechanizationRecord
} from '../../src/types/collection';

export const collectionRoutes: CollectionRoute[] = [
  { routeId: 'R001', routeName: '中山路清运专线', assignedVehicle: '沪A12345', assignedDriver: '张师傅', coveragePoints: 15, status: 'active', efficiency: 92 },
  { routeId: 'R002', routeName: '金沙江路商业街', assignedVehicle: '沪B67890', assignedDriver: '李师傅', coveragePoints: 22, status: 'active', efficiency: 88 },
  { routeId: 'R003', routeName: '长风公园周边', assignedVehicle: '沪C11223', assignedDriver: '王师傅', coveragePoints: 18, status: 'maintenance', efficiency: 0 },
  { routeId: 'R004', routeName: '真如古镇核心区', assignedVehicle: '沪D44556', assignedDriver: '赵师傅', coveragePoints: 30, status: 'active', efficiency: 95 },
  { routeId: 'R005', routeName: '曹杨新村生活区', assignedVehicle: '沪E77889', assignedDriver: '刘师傅', coveragePoints: 25, status: 'active', efficiency: 85 },
];

export const collectionRecords: CollectionRecord[] = Array.from({ length: 30 }).map((_, i) => ({
  recordId: `REC202310${(i + 1).toString().padStart(2, '0')}`,
  routeId: `R00${(i % 5) + 1}`,
  routeName: ['中山路清运专线', '金沙江路商业街', '长风公园周边', '真如古镇核心区', '曹杨新村生活区'][i % 5],
  plateNo: ['沪A12345', '沪B67890', '沪C11223', '沪D44556', '沪E77889'][i % 5],
  startTime: `2023-10-27 0${(i % 5) + 5}:00:00`,
  endTime: `2023-10-27 1${(i % 5) + 0}:30:00`,
  collectedWeight: Number((Math.random() * 5 + 2).toFixed(1)),
  status: i % 10 === 0 ? 'in_progress' : 'completed'
}));

export const trashBins: TrashBin[] = Array.from({ length: 50 }).map((_, i) => ({
  binId: `B${(i + 1).toString().padStart(4, '0')}`,
  location: `普陀区中山北路${3000 + i * 10}号`,
  region: ['普陀区', '长宁区', '静安区'][i % 3],
  type: ['干垃圾', '湿垃圾', '可回收物', '有害垃圾'][i % 4] as any,
  capacity: 240,
  fillLevel: Math.floor(Math.random() * 100),
  status: Math.random() > 0.9 ? 'damaged' : (Math.random() > 0.8 ? 'full' : 'normal'),
  lastCollected: `2023-10-27 0${Math.floor(Math.random() * 4) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`
}));

export const collectionPlans: CollectionPlan[] = [
  {
    planId: 'P001',
    planName: '2023年第四季度常规收运计划',
    type: 'daily',
    startTime: '2023-10-01',
    endTime: '2023-12-31',
    assignedRoutes: ['R001', 'R002', 'R004', 'R005'],
    status: 'active',
    creator: '管理员',
    createdAt: '2023-09-25 10:00:00'
  },
  {
    planId: 'P002',
    planName: '国庆期间专项收运保障方案',
    type: 'special',
    startTime: '2023-10-01',
    endTime: '2023-10-07',
    assignedRoutes: ['R001', 'R002', 'R003', 'R004', 'R005'],
    status: 'expired',
    creator: '管理员',
    createdAt: '2023-09-28 14:30:00'
  },
  {
    planId: 'P003',
    planName: '2024年春节期间收运调整计划',
    type: 'special',
    startTime: '2024-02-01',
    endTime: '2024-02-15',
    assignedRoutes: ['R001', 'R002'],
    status: 'draft',
    creator: '管理员',
    createdAt: '2023-10-25 09:15:00'
  }
];

export const collectionStatistics: CollectionStatistic[] = Array.from({ length: 7 }).map((_, i) => ({
  date: `2023-10-${(21 + i).toString().padStart(2, '0')}`,
  totalWeight: 120 + Math.random() * 30,
  totalRoutes: 45,
  activeVehicles: 42,
  efficiency: 85 + Math.random() * 10,
  categoryBreakdown: {
    dry: 60 + Math.random() * 10,
    wet: 40 + Math.random() * 10,
    recyclable: 15 + Math.random() * 5,
    hazardous: 2 + Math.random() * 1,
  }
}));

export const mechanizationRecords: MechanizationRecord[] = [
  { id: 'M001', region: '普陀区', totalPoints: 1200, mechanizedPoints: 1150, rate: 95.8, lastUpdated: '2023-10-27 10:00:00' },
  { id: 'M002', region: '长宁区', totalPoints: 980, mechanizedPoints: 950, rate: 96.9, lastUpdated: '2023-10-27 10:00:00' },
  { id: 'M003', region: '静安区', totalPoints: 1500, mechanizedPoints: 1420, rate: 94.7, lastUpdated: '2023-10-27 10:00:00' },
  { id: 'M004', region: '徐汇区', totalPoints: 1100, mechanizedPoints: 1080, rate: 98.2, lastUpdated: '2023-10-27 10:00:00' },
  { id: 'M005', region: '黄浦区', totalPoints: 850, mechanizedPoints: 840, rate: 98.8, lastUpdated: '2023-10-27 10:00:00' },
];
