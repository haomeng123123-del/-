export interface BasicInfoReq {
  infoType: string; // 小区, 居民, 运营单位, 学校, 党政机关, 医院, 商业综合体, 写字楼, 农贸市场, 工作人员, 智能设备, 收集车辆
  keyword?: string;
  pageNo: number;
  pageSize: number;
}

export interface ReportReq {
  status?: string;
  keyword?: string;
  pageNo: number;
  pageSize: number;
}

export interface CollectionMonitorReq {
  monitorType: string; // 实时监测, 收运计划, 收运记录, 汇总统计
  keyword?: string;
  pageNo: number;
  pageSize: number;
}

export interface TreatmentMonitorReq {
  monitorType: string; // 进场计量管理, 视频监控管理
  keyword?: string;
  pageNo: number;
  pageSize: number;
}

export interface BasicInfoRecord {
  id: string;
  name: string;
  type: string;
  address?: string;
  manager?: string;
  phone?: string;
  status: string;
  createTime: string;
}

export interface ReportRecord {
  id: string;
  reportDate: string;
  reporter: string;
  category: string; // 垃圾种类
  weight: number;
  status: string; // 暂存, 已提交
  submitTime: string;
}

export interface CollectionRecord {
  id: string;
  pointName: string;
  vehiclePlate: string;
  weight: number;
  wasteType: string;
  collectionTime: string;
  status: string;
}

export interface TreatmentRecord {
  id: string;
  facilityName: string;
  vehiclePlate: string;
  weight: number;
  wasteType: string;
  entryTime: string;
  status: string;
}
