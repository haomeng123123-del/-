export interface CollectionRoute {
  routeId: string;
  routeName: string;
  assignedVehicle: string;
  assignedDriver: string;
  coveragePoints: number;
  status: 'active' | 'inactive' | 'maintenance';
  efficiency: number;
}

export interface CollectionRecord {
  recordId: string;
  routeId: string;
  routeName: string;
  plateNo: string;
  startTime: string;
  endTime: string;
  collectedWeight: number;
  status: 'completed' | 'in_progress' | 'cancelled';
}

export interface TrashBin {
  binId: string;
  location: string;
  region: string;
  type: '干垃圾' | '湿垃圾' | '可回收物' | '有害垃圾';
  capacity: number;
  fillLevel: number;
  status: 'normal' | 'full' | 'damaged' | 'missing';
  lastCollected: string;
}

export interface CollectionPlan {
  planId: string;
  planName: string;
  type: 'daily' | 'weekly' | 'special';
  startTime: string;
  endTime: string;
  assignedRoutes: string[];
  status: 'active' | 'draft' | 'expired';
  creator: string;
  createdAt: string;
}

export interface CollectionStatistic {
  date: string;
  totalWeight: number;
  totalRoutes: number;
  activeVehicles: number;
  efficiency: number;
  categoryBreakdown: {
    dry: number;
    wet: number;
    recyclable: number;
    hazardous: number;
  };
}

export interface MechanizationRecord {
  id: string;
  region: string;
  totalPoints: number;
  mechanizedPoints: number;
  rate: number;
  lastUpdated: string;
}

export interface CollectionRouteReq {
  routeName?: string;
  status?: string;
  pageNo: number;
  pageSize: number;
}

export interface CollectionRecordReq {
  date?: string;
  plateNo?: string;
  pageNo: number;
  pageSize: number;
}

export interface TrashBinReq {
  region?: string;
  status?: string;
  pageNo: number;
  pageSize: number;
}

export interface CollectionPlanReq {
  planName?: string;
  status?: string;
  pageNo: number;
  pageSize: number;
}

export interface MechanizationReq {
  region?: string;
  pageNo: number;
  pageSize: number;
}
