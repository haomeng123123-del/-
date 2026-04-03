import { 
  ToiletMapPoint, ToiletMonitorData, CleaningAttendance, InspectionRecord, 
  FacilitySummaryStats, CleaningShift, CleaningStaff,
  DisposalFacility, DisposalMonitorData, DisposalRecord, MaintenanceRecord,
  SortingPoint, SortingGuide, SortingRecord, MaintenancePlan, FaultAlarm, SortingStats
} from '../../src/types/facility';

export const toiletMapPoints: ToiletMapPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  toiletId: `T${(i + 1).toString().padStart(3, '0')}`,
  toiletName: `中山公园${i + 1}号公厕`,
  region: ['长宁区', '普陀区', '静安区'][i % 3],
  location: `中山公园内${i + 1}号门附近`,
  longitude: 121.41 + (Math.random() * 0.1 - 0.05),
  latitude: 31.22 + (Math.random() * 0.1 - 0.05),
  status: Math.random() > 0.9 ? 'alarm' : (Math.random() > 0.8 ? 'offline' : 'normal'),
  odorLevel: Number((Math.random() * 20).toFixed(1)),
  passengerFlow: Math.floor(Math.random() * 500),
  alarmCount: Math.floor(Math.random() * 3),
  address: `上海市${['长宁区', '普陀区', '静安区'][i % 3]}中山路${100 + i}号`,
  contact: `管理员${String.fromCharCode(65 + (i % 26))}`,
  phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
  openTime: '06:00 - 22:00',
  facilities: ['无障碍设施', '母婴室', '自动售货机', '人脸识别供纸'].slice(0, Math.floor(Math.random() * 4) + 1)
}));

export const toiletMonitorData: ToiletMonitorData = {
  toiletId: 'T001',
  toiletName: '中山公园1号公厕',
  odorTrend: Array.from({ length: 24 }).map((_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Number((Math.random() * 15 + 5).toFixed(1))
  })),
  flowTrend: Array.from({ length: 24 }).map((_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.floor(Math.random() * 100 + (i > 8 && i < 20 ? 50 : 10))
  })),
  alarms: [
    { alarmId: 'A001', time: '2023-10-27 09:15:00', type: '氨气超标', value: '25.5 ppm', status: 'unhandled', description: '男厕区域氨气浓度持续升高' },
    { alarmId: 'A002', time: '2023-10-27 14:30:00', type: '硫化氢超标', value: '10.2 ppm', status: 'handled', description: '传感器检测到硫化氢超标' }
  ],
  realtime: {
    odor: 12.5,
    ammonia: 5.2,
    hydrogenSulfide: 0.8,
    temperature: 24.5,
    humidity: 65,
    flow: 128
  }
};

export const cleaningShifts: CleaningShift[] = [
  { shiftId: 'S001', shiftName: '早班', startTime: '06:00', endTime: '14:00', staffCount: 12, description: '负责上午时段的保洁工作' },
  { shiftId: 'S002', shiftName: '中班', startTime: '14:00', endTime: '22:00', staffCount: 10, description: '负责下午及傍晚时段的保洁工作' },
  { shiftId: 'S003', shiftName: '夜班', startTime: '22:00', endTime: '06:00', staffCount: 5, description: '负责夜间值守及深度清洁' }
];

export const cleaningStaff: CleaningStaff[] = Array.from({ length: 30 }).map((_, i) => ({
  staffId: `ST${(i + 1).toString().padStart(3, '0')}`,
  name: ['张三', '李四', '王五', '赵六', '孙七', '周八'][i % 6],
  gender: i % 2 === 0 ? '男' : '女',
  age: 35 + (i % 20),
  phone: `135${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
  group: `保洁${(i % 5) + 1}组`,
  status: Math.random() > 0.9 ? 'on_leave' : 'active'
}));

export const cleaningAttendances: CleaningAttendance[] = Array.from({ length: 50 }).map((_, i) => ({
  recordId: `AT${(i + 1).toString().padStart(4, '0')}`,
  staffName: cleaningStaff[i % 30].name,
  toiletName: `中山公园${(i % 10) + 1}号公厕`,
  shift: cleaningShifts[i % 3].shiftName,
  clockInTime: `${cleaningShifts[i % 3].startTime.split(':')[0]}:${Math.floor(Math.random() * 15 + 45).toString().padStart(2, '0')}:00`,
  clockOutTime: `${cleaningShifts[i % 3].endTime.split(':')[0]}:${Math.floor(Math.random() * 15).toString().padStart(2, '0')}:00`,
  status: Math.random() > 0.9 ? 'late' : 'normal',
  date: '2023-10-27'
}));

export const inspectionRecords: InspectionRecord[] = Array.from({ length: 40 }).map((_, i) => ({
  inspectionId: `IN${(i + 1).toString().padStart(4, '0')}`,
  toiletName: `中山公园${(i % 10) + 1}号公厕`,
  inspector: ['检查员A', '检查员B', '检查员C'][i % 3],
  inspectionTime: `2023-10-27 1${Math.floor(Math.random() * 8)}:30:00`,
  score: Math.floor(Math.random() * 20 + 80),
  issues: Math.random() > 0.7 ? '洗手台有水渍，地面微脏' : '无异常',
  status: Math.random() > 0.8 ? 'failed' : 'passed',
  region: ['长宁区', '普陀区', '静安区'][i % 3],
  details: [
    { item: '地面卫生', status: 'ok', comment: '干净整洁' },
    { item: '异味控制', status: Math.random() > 0.8 ? 'fail' : 'ok', comment: '通风良好' },
    { item: '设施完好', status: 'ok', comment: '无损坏' }
  ]
}));

export const facilitySummaryStats: FacilitySummaryStats = {
  byCategory: [
    { name: '一类公厕', value: 45 },
    { name: '二类公厕', value: 120 },
    { name: '三类公厕', value: 35 }
  ],
  byRegion: [
    { name: '长宁区', value: 50 },
    { name: '普陀区', value: 65 },
    { name: '静安区', value: 85 }
  ],
  byPassengerFlow: [
    { name: '高客流 (>1000/日)', value: 30 },
    { name: '中客流 (500-1000/日)', value: 80 },
    { name: '低客流 (<500/日)', value: 90 }
  ],
  byArea: [
    { name: '<50㎡', value: 40 },
    { name: '50-100㎡', value: 110 },
    { name: '>100㎡', value: 50 }
  ],
  bySquatCount: [
    { name: '<5个', value: 30 },
    { name: '5-10个', value: 120 },
    { name: '>10个', value: 50 }
  ],
  byOperator: [
    { name: '区环卫所', value: 100 },
    { name: '第三方公司A', value: 60 },
    { name: '第三方公司B', value: 40 }
  ]
};

export const disposalFacilities: DisposalFacility[] = [
  {
    id: 'DF001',
    name: '天子岭生活垃圾填埋场',
    type: 'landfill',
    status: 'normal',
    address: '杭州市拱墅区临半路',
    capacity: 3000,
    currentLoad: 2450,
    lat: 30.38,
    lng: 120.18,
    contact: '张工',
    phone: '13800001111',
    region: '拱墅区'
  },
  {
    id: 'DF002',
    name: '九峰垃圾焚烧发电厂',
    type: 'incineration',
    status: 'normal',
    address: '杭州市余杭区中泰街道',
    capacity: 2000,
    currentLoad: 1800,
    lat: 30.25,
    lng: 119.95,
    contact: '王经理',
    phone: '13800002222',
    region: '余杭区'
  },
  {
    id: 'DF003',
    name: '萧山餐厨垃圾处理厂',
    type: 'kitchen',
    status: 'normal',
    address: '杭州市萧山区红山农场',
    capacity: 500,
    currentLoad: 420,
    lat: 30.22,
    lng: 120.45,
    contact: '李工',
    phone: '13800003333',
    region: '萧山区'
  },
  {
    id: 'DF004',
    name: '东部危废处置中心',
    type: 'hazardous',
    status: 'maintenance',
    address: '杭州市钱塘区工业园',
    capacity: 300,
    currentLoad: 150,
    lat: 30.32,
    lng: 120.55,
    contact: '陈工',
    phone: '13800004444',
    region: '钱塘区'
  }
];

export const disposalMonitorData: Record<string, DisposalMonitorData> = {
  'DF001': {
    facilityId: 'DF001',
    timestamp: '2024-03-20 10:00:00',
    metrics: {
      powerUsage: 1200,
      waterUsage: 450,
      leachateLevel: 3.2,
      methaneConcentration: 0.02,
    }
  },
  'DF002': {
    facilityId: 'DF002',
    timestamp: '2024-03-20 10:00:00',
    metrics: {
      temperature: 850,
      pressure: 1.2,
      powerUsage: 5000,
      waterUsage: 800,
      emissions: { co: 5, so2: 3, nox: 20, dust: 2, hcl: 4, hf: 0.1 }
    }
  },
  'DF003': {
    facilityId: 'DF003',
    timestamp: '2024-03-20 10:00:00',
    metrics: {
      powerUsage: 1500,
      waterUsage: 600,
      sewageTreatment: 280,
      solidResidue: 50,
      wasteOil: 15,
      resourceProducts: {
        fertilizer: 90,
        biogas: 1500,
        sludge: 18
      }
    }
  }
};

export const disposalRecords: DisposalRecord[] = [
  { recordId: 'DR001', facilityId: 'DF001', facilityName: '天子岭生活垃圾填埋场', wasteType: '其他垃圾', weight: 15.5, source: '拱墅区', time: '2024-03-20 08:30:00', operator: '赵师傅' },
  { recordId: 'DR002', facilityId: 'DF002', facilityName: '九峰垃圾焚烧发电厂', wasteType: '其他垃圾', weight: 12.0, source: '余杭区', time: '2024-03-20 09:15:00', operator: '钱师傅' },
  { recordId: 'DR003', facilityId: 'DF001', facilityName: '天子岭生活垃圾填埋场', wasteType: '其他垃圾', weight: 18.2, source: '西湖区', time: '2024-03-20 09:45:00', operator: '孙师傅' },
  { recordId: 'DR004', facilityId: 'DF003', facilityName: '萧山餐厨垃圾处理厂', wasteType: '餐厨垃圾', weight: 8.5, source: '萧山区', time: '2024-03-20 10:00:00', operator: '李师傅' },
  { recordId: 'DR005', facilityId: 'DF002', facilityName: '九峰垃圾焚烧发电厂', wasteType: '其他垃圾', weight: 14.3, source: '临平区', time: '2024-03-20 10:30:00', operator: '周师傅' },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'MR001', facilityId: 'DF003', facilityName: '萧山餐厨垃圾处理厂', type: 'routine', date: '2024-03-15', staff: '周工', description: '例行设备检查与润滑', result: 'success' },
  { id: 'MR002', facilityId: 'DF002', facilityName: '九峰垃圾焚烧发电厂', type: 'repair', date: '2024-03-18', staff: '吴工', description: '2号炉排故障修复', result: 'success' },
];

export const maintenancePlans: MaintenancePlan[] = [
  {
    id: 'P001',
    facilityId: 'DF002',
    facilityName: '九峰垃圾焚烧发电厂',
    deviceName: '1号焚烧炉',
    cycle: 'monthly',
    lastTime: '2024-03-01',
    nextTime: '2024-04-01',
    status: 'active'
  },
  {
    id: 'P002',
    facilityId: 'DF003',
    facilityName: '萧山餐厨垃圾处理厂',
    deviceName: '厌氧发酵罐',
    cycle: 'quarterly',
    lastTime: '2024-01-15',
    nextTime: '2024-04-15',
    status: 'active'
  }
];

export const faultAlarms: FaultAlarm[] = [
  {
    id: 'A001',
    facilityId: 'DF002',
    facilityName: '九峰垃圾焚烧发电厂',
    deviceName: '烟气在线监测系统',
    level: 'high',
    type: 'sensor',
    time: '2024-03-25 10:30:00',
    status: 'unhandled',
    description: 'SO2传感器读数异常偏高'
  },
  {
    id: 'A002',
    facilityId: 'DF001',
    facilityName: '天子岭生活垃圾填埋场',
    level: 'critical',
    type: 'mechanical',
    deviceName: '沼气收集管道',
    time: '2024-03-25 09:15:00',
    status: 'handling',
    description: '主管道压力骤降，疑似泄漏'
  }
];

// 垃圾分类数据
export const sortingPoints: SortingPoint[] = [
  {
    id: 'SP001',
    name: '西湖区翠苑一区分类点',
    address: '杭州市西湖区翠苑街道翠苑一区12幢旁',
    type: '小区',
    lng: 120.12,
    lat: 30.28,
    manager: '张大民',
    phone: '13800138001',
    bins: [
      { type: '可回收物', status: 45 },
      { type: '有害垃圾', status: 12 },
      { type: '厨余垃圾', status: 88 },
      { type: '其他垃圾', status: 65 },
    ]
  },
  {
    id: 'SP002',
    name: '拱墅区和睦新村分类点',
    address: '杭州市拱墅区和睦街道和睦新村5幢旁',
    type: '小区',
    lng: 120.15,
    lat: 30.31,
    manager: '李晓华',
    phone: '13900139002',
    bins: [
      { type: '可回收物', status: 30 },
      { type: '有害垃圾', status: 5 },
      { type: '厨余垃圾', status: 92 },
      { type: '其他垃圾', status: 40 },
    ]
  },
  {
    id: 'SP003',
    name: '上城区采荷二区分类点',
    address: '杭州市上城区采荷街道采荷二区8幢旁',
    type: '小区',
    lng: 120.20,
    lat: 30.25,
    manager: '王建国',
    phone: '13700137003',
    bins: [
      { type: '可回收物', status: 55 },
      { type: '有害垃圾', status: 20 },
      { type: '厨余垃圾', status: 75 },
      { type: '其他垃圾', status: 82 },
    ]
  },
  {
    id: 'SP004',
    name: '滨江区星光大道分类点',
    address: '杭州市滨江区西兴街道星光大道一期',
    type: '商业区',
    lng: 120.21,
    lat: 30.21,
    manager: '赵敏',
    phone: '13600136004',
    bins: [
      { type: '可回收物', status: 25 },
      { type: '有害垃圾', status: 8 },
      { type: '厨余垃圾', status: 60 },
      { type: '其他垃圾', status: 35 },
    ]
  },
  {
    id: 'SP005',
    name: '余杭区未来科技城分类点',
    address: '杭州市余杭区五常街道文一西路998号',
    type: '商业区',
    lng: 120.01,
    lat: 30.27,
    manager: '孙伟',
    phone: '13500135005',
    bins: [
      { type: '可回收物', status: 15 },
      { type: '有害垃圾', status: 2 },
      { type: '厨余垃圾', status: 45 },
      { type: '其他垃圾', status: 20 },
    ]
  }
];

export const sortingGuides: SortingGuide[] = [
  { id: 'G001', name: '报纸', category: '可回收物', description: '废旧报纸、书刊、办公用纸等', tips: ['请保持干燥', '尽量平整堆放'] },
  { id: 'G002', name: '电池', category: '有害垃圾', description: '纽扣电池、充电电池等', tips: ['请投放到专门收集容器', '防止破损泄漏'] },
  { id: 'G003', name: '剩菜剩饭', category: '厨余垃圾', description: '家庭产生的易腐性垃圾', tips: ['请沥干水分', '去除包装袋'] },
  { id: 'G004', name: '烟蒂', category: '其他垃圾', description: '难以回收的废弃物', tips: ['请熄灭火种'] },
  { id: 'G005', name: '塑料瓶', category: '可回收物', description: '各种饮料瓶、洗护用品瓶等', tips: ['请倒空瓶内液体', '压扁后投放'] },
  { id: 'G006', name: '过期药品', category: '有害垃圾', description: '超过有效期的药品及其包装', tips: ['请连同包装一并投放', '防止药品散落'] },
  { id: 'G007', name: '果皮', category: '厨余垃圾', description: '各种瓜果的皮、核等', tips: ['请沥干水分'] },
  { id: 'G008', name: '陶瓷碎片', category: '其他垃圾', description: '破损的陶瓷碗碟、花盆等', tips: ['请包裹后投放', '防止割伤'] },
];

export const sortingRecords: SortingRecord[] = [
  { id: 'SR001', pointId: 'SP001', pointName: '西湖区翠苑一区分类点', category: '厨余垃圾', weight: 4.5, accuracy: 95, time: '2024-03-20 08:30:22' },
  // ... (rest of the records)
];

export const sortingStats: SortingStats = {
  byCategory: [
    { name: '可回收物', value: 450 },
    { name: '有害垃圾', value: 25 },
    { name: '厨余垃圾', value: 850 },
    { name: '其他垃圾', value: 600 },
  ],
  byAccuracy: [
    { name: '90%以上', value: 120 },
    { name: '80%-90%', value: 45 },
    { name: '80%以下', value: 15 },
  ],
  trend: Array.from({ length: 7 }).map((_, i) => ({
    date: `03-${20 + i}`,
    weight: 1200 + Math.random() * 500,
    accuracy: 85 + Math.random() * 10
  })),
  topPoints: [
    { name: '翠苑一区分类点', weight: 125.5, accuracy: 98 },
    { name: '和睦新村分类点', weight: 110.2, accuracy: 95 },
    { name: '采荷二区分类点', weight: 98.4, accuracy: 92 },
    { name: '星光大道分类点', weight: 85.6, accuracy: 90 },
    { name: '未来科技城分类点', weight: 78.9, accuracy: 94 },
  ]
};
