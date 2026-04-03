import { LayoutDashboard, Users, Truck, Recycle, Building2, Bath, Factory, Trash2, AlertTriangle, Database, Server, Settings } from 'lucide-react';

export const menuConfig = [
  {
    id: 'comprehensive',
    name: '环卫固废综合展示',
    path: '/comprehensive',
    icon: LayoutDashboard,
    children: [
      { name: '环卫设施专题', path: '/comprehensive/facility' },
      { name: '清扫保洁专题', path: '/comprehensive/cleaning' },
      { name: '智慧公厕专题', path: '/comprehensive/toilet' },
      { name: '垃圾收运专题', path: '/comprehensive/collection' },
      { name: '转运站专题', path: '/comprehensive/transfer' },
      { name: '监督考核专题', path: '/comprehensive/inspection' },
      { name: '视频监控专题', path: '/comprehensive/video' },
    ]
  },
  {
    id: 'bigdata',
    name: '大数据场景应用',
    path: '/bigdata',
    icon: Database,
    children: [
      { name: '车辆跑冒滴漏识别', path: '/bigdata/leakage' },
      { name: '违规倾倒研判', path: '/bigdata/dumping' },
      { name: '垃圾流向异常识别', path: '/bigdata/flow-anomaly' },
      { name: '垃圾量问题识别', path: '/bigdata/volume-anomaly' },
      { name: '转运站臭气报警', path: '/bigdata/odor-alarm' },
      { name: '企业合同履约分析', path: '/bigdata/contract' },
      { name: '疲劳驾驶预警', path: '/bigdata/fatigue' },
      { name: '车辆急加水识别', path: '/bigdata/water-refill' },
      { name: '清扫薄弱区域分析', path: '/bigdata/weak-area' },
      { name: '大数据示范街管理', path: '/bigdata/demo-street' },
    ]
  },
  {
    id: 'personnel',
    name: '环卫人员管理',
    path: '/personnel',
    icon: Users,
    children: [
      { name: '人员信息管理', path: '/personnel/info' },
      { name: '作业监管地图', path: '/personnel' },
      { name: '实时轨迹监控', path: '/personnel/track-realtime' },
      { name: '历史轨迹回放', path: '/personnel/track-history' },
      { name: '作业网格管理', path: '/personnel/grid' },
      { name: '人员统计分析', path: '/personnel/statistics' },
    ]
  },
  {
    id: 'vehicles',
    name: '环卫车辆管理',
    path: '/vehicles',
    icon: Truck,
    children: [
      { name: '车辆信息管理', path: '/vehicles/info' },
      { name: '车辆实时监控', path: '/vehicles' },
      { name: '车辆轨迹管理', path: '/vehicles/track' },
      { name: '车辆作业监控', path: '/vehicles/operation' },
      { name: '车辆视频监控', path: '/vehicles/video' },
      { name: '车辆报警管理', path: '/vehicles/alarm' },
      { name: '电子围栏管理', path: '/vehicles/fence' },
      { name: '车辆统计分析', path: '/vehicles/statistics' },
      { name: '收运监控地图', path: '/vehicles/collection-map' },
      { name: '收运路线管理', path: '/vehicles/collection-routes' },
      { name: '收运计划管理', path: '/vehicles/collection-plans' },
      { name: '收运记录管理', path: '/vehicles/collection-records' },
      { name: '收运统计分析', path: '/vehicles/collection-statistics' },
      { name: '垃圾桶管理', path: '/vehicles/collection-bins' },
      { name: '机械化作业管理', path: '/vehicles/mechanization' },
    ]
  },
  {
    id: 'transfer',
    name: '转运设施监管',
    path: '/transfer',
    icon: Building2,
    children: [
      { name: '收集点管理', path: '/transfer' },
      { name: '转运站管理', path: '/transfer/stations' },
      { name: '垃圾计量管理', path: '/transfer/measurement' },
      { name: '设施运行监控', path: '/transfer/operation' },
      { name: '设施视频监控', path: '/transfer/video' },
      { name: '设施统计分析', path: '/transfer/statistics' },
    ]
  },
  {
    id: 'facility',
    name: '智慧公厕监管',
    path: '/facility',
    icon: Bath,
    children: [
      { name: '公厕信息管理', path: '/facility' },
      { name: '公厕实时监测', path: '/facility/monitor' },
      { name: '保洁作业管理', path: '/facility/cleaning' },
      { name: '例行检查管理', path: '/facility/inspection' },
      { name: '公厕统计分析', path: '/facility/statistics' },
    ]
  },
  {
    id: 'disposal',
    name: '终端处置场监管',
    path: '/disposal',
    icon: Factory,
    children: [
      { name: '填埋场监管', path: '/disposal' },
      { name: '焚烧厂监管', path: '/disposal/incineration' },
      { name: '餐厨垃圾处置厂监管', path: '/disposal/kitchen-waste' },
    ]
  },
  {
    id: 'sorting',
    name: '垃圾分类管理',
    path: '/sorting',
    icon: Trash2,
    children: [
      { name: '基础信息管理', path: '/sorting' },
      { name: '垃圾分类在线填报', path: '/sorting/report' },
      { name: '分类收运监管', path: '/sorting/collection' },
      { name: '分类处理监管', path: '/sorting/treatment' },
    ]
  },
  {
    id: 'cases',
    name: '日常监督检查',
    path: '/cases',
    icon: AlertTriangle,
    children: [
      { name: '案件协同处置', path: '/cases' },
      { name: '日常工作管理', path: '/cases/daily' },
      { name: '监督任务管理', path: '/cases/tasks' },
    ]
  },
  {
    id: 'data',
    name: '数据资源管理',
    path: '/data',
    icon: Database,
    children: [
      { name: '环卫设施数据管理', path: '/data' },
      { name: '作业资源数据管理', path: '/data/resources' },
      { name: '工作信息报送管理', path: '/data/reports' },
    ]
  },
  {
    id: 'platform',
    name: '基础支撑平台',
    path: '/platform',
    icon: Server,
    children: [
      { name: '视频智能分析平台', path: '/platform' },
      { name: '物联网数据采集平台', path: '/platform/iot' },
      { name: '视频统一接入管理平台', path: '/platform/video' },
    ]
  },
  {
    id: 'settings',
    name: '系统管理',
    path: '/settings',
    icon: Settings,
    children: [
      { name: '组织机构管理', path: '/settings' },
      { name: '用户管理', path: '/settings/users' },
      { name: '角色权限管理', path: '/settings/roles' },
      { name: '系统参数配置', path: '/settings/params' },
      { name: '业务规则配置', path: '/settings/rules' },
      { name: '日志管理', path: '/settings/logs' },
      { name: '自动化运维监控', path: '/settings/monitor' },
    ]
  }
];
