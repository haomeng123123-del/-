import { BasicInfoRecord, ReportRecord, CollectionRecord, TreatmentRecord } from '../../src/types/sorting';

const types = ['小区', '居民', '运营单位', '学校', '党政机关', '医院', '商业综合体', '写字楼', '农贸市场', '工作人员', '智能设备', '收集车辆'];
export let basicInfoData: BasicInfoRecord[] = Array.from({ length: 120 }).map((_, i) => {
  const type = types[i % types.length];
  return {
    id: `B${String(i + 1).padStart(3, '0')}`,
    name: `${type}测试数据${Math.floor(i / types.length) + 1}`,
    type: type,
    address: `朝阳区测试路${i + 1}号`,
    manager: `负责人${i + 1}`,
    phone: `13800138${String(i).padStart(3, '0')}`,
    status: i % 10 === 0 ? '停用' : '正常',
    createTime: `2023-10-${String((i % 30) + 1).padStart(2, '0')} 10:00:00`,
  };
});

const categories = ['厨余垃圾', '其他垃圾', '可回收物', '有害垃圾'];
const statuses = ['submitted', 'draft'];
export let reportData: ReportRecord[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `R${String(i + 1).padStart(3, '0')}`,
  reportDate: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
  reporter: `填报员${(i % 5) + 1}`,
  category: categories[i % categories.length],
  weight: Math.floor(Math.random() * 800) + 200,
  status: statuses[i % statuses.length],
  submitTime: `2023-10-${String((i % 30) + 1).padStart(2, '0')} 14:30:00`,
}));

export let collectionData: CollectionRecord[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `C${String(i + 1).padStart(3, '0')}`,
  pointName: `阳光小区收集点${(i % 5) + 1}`,
  vehiclePlate: `京A${String(80000 + i)}`,
  weight: Math.floor(Math.random() * 500) + 100,
  wasteType: i % 4 === 0 ? '可回收物' : i % 4 === 1 ? '有害垃圾' : i % 4 === 2 ? '厨余垃圾' : '其他垃圾',
  collectionTime: `2023-10-31 08:${String(i % 60).padStart(2, '0')}:00`,
  status: i % 10 === 0 ? '异常' : '正常',
}));

export const treatmentData: TreatmentRecord[] = Array.from({ length: 35 }).map((_, i) => ({
  id: `T${String(i + 1).padStart(3, '0')}`,
  facilityName: `朝阳区垃圾处理厂${(i % 3) + 1}`,
  vehiclePlate: `京A${String(90000 + i)}`,
  weight: Math.floor(Math.random() * 1000) + 500,
  wasteType: i % 4 === 0 ? '可回收物' : i % 4 === 1 ? '有害垃圾' : i % 4 === 2 ? '厨余垃圾' : '其他垃圾',
  entryTime: `2023-10-31 09:${String(i % 60).padStart(2, '0')}:00`,
  status: i % 8 === 0 ? '异常' : '正常',
}));
