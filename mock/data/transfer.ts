import { CollectionPointWeight, TransferStationStat, VehicleMeasurementRecord, EquipmentOperationRecord, VideoCamera } from '../../src/types/transfer';

export const collectionPointWeights: CollectionPointWeight[] = Array.from({ length: 35 }).map((_, i) => ({
  id: `CP${String(i + 1).padStart(3, '0')}`,
  pointName: `收集点${i + 1}`,
  date: '2024-05-23',
  weight: parseFloat((Math.random() * 5 + 1).toFixed(2)),
  region: ['普陀区', '徐汇区', '长宁区', '静安区'][i % 4]
}));

export const transferStationStats: TransferStationStat[] = Array.from({ length: 15 }).map((_, i) => ({
  stationId: `TS${String(i + 1).padStart(3, '0')}`,
  stationName: `转运站${i + 1}`,
  todayTrips: Math.floor(Math.random() * 200 + 50),
  todayWeight: parseFloat((Math.random() * 500 + 100).toFixed(2)),
  region: ['普陀区', '徐汇区', '长宁区', '静安区'][i % 4]
}));

export const vehicleMeasurementRecords: VehicleMeasurementRecord[] = Array.from({ length: 45 }).map((_, i) => {
  const tare = parseFloat((Math.random() * 5 + 3).toFixed(2));
  const net = parseFloat((Math.random() * 10 + 2).toFixed(2));
  return {
    recordId: `R${String(i + 1).padStart(4, '0')}`,
    plateNo: `沪${['A', 'B', 'C', 'D'][i % 4]}·${Math.floor(Math.random() * 90000 + 10000)}`,
    stationName: `转运站${(i % 15) + 1}`,
    entryTime: `2024-05-23 ${String(8 + (i % 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    exitTime: `2024-05-23 ${String(8 + (i % 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    grossWeight: parseFloat((tare + net).toFixed(2)),
    tareWeight: tare,
    netWeight: net
  };
});

export const equipmentOperationRecords: EquipmentOperationRecord[] = Array.from({ length: 30 }).map((_, i) => ({
  recordId: `E${String(i + 1).padStart(3, '0')}`,
  equipmentName: `设备${i + 1}`,
  equipmentType: ['compressor', 'deodorizer', 'catalysis'][i % 3] as any,
  stationName: `转运站${(i % 15) + 1}`,
  status: ['normal', 'warning', 'error'][i % 3] as any,
  recordTime: `2024-05-23 ${String(8 + (i % 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
  details: '运行参数正常'
}));

export const videoCameras: VideoCamera[] = Array.from({ length: 25 }).map((_, i) => ({
  cameraId: `C${String(i + 1).padStart(3, '0')}`,
  cameraName: `监控点位${i + 1}`,
  stationName: `转运站${(i % 15) + 1}`,
  status: i % 5 === 0 ? 'offline' : 'online',
  streamUrl: `http://example.com/stream${i + 1}`
}));

export const drainageRecords: any[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `D${String(i + 1).padStart(3, '0')}`,
  stationName: `转运站${(i % 15) + 1}`,
  time: `2024-05-23 ${String(8 + (i % 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
  flowRate: parseFloat((Math.random() * 10 + 5).toFixed(2)),
  ph: parseFloat((Math.random() * 2 + 6).toFixed(1)),
  cod: parseFloat((Math.random() * 50 + 100).toFixed(1)),
  ammonia: parseFloat((Math.random() * 5 + 10).toFixed(1)),
  status: i % 10 === 0 ? 'warning' : 'normal'
}));

export const flowCorrelations: any[] = [
  { source: '普陀区', target: '转运站1', value: 120 },
  { source: '普陀区', target: '转运站2', value: 80 },
  { source: '徐汇区', target: '转运站3', value: 150 },
  { source: '徐汇区', target: '转运站4', value: 90 },
  { source: '长宁区', target: '转运站5', value: 110 },
  { source: '静安区', target: '转运站6', value: 130 },
  { source: '转运站1', target: '焚烧厂A', value: 100 },
  { source: '转运站1', target: '填埋场B', value: 20 },
  { source: '转运站2', target: '焚烧厂A', value: 80 },
  { source: '转运站3', target: '焚烧厂C', value: 140 },
  { source: '转运站3', target: '填埋场B', value: 10 },
  { source: '转运站4', target: '焚烧厂C', value: 90 },
  { source: '转运站5', target: '焚烧厂A', value: 110 },
  { source: '转运站6', target: '焚烧厂C', value: 130 },
];
