# 垃圾收集转运设施监管系统接口

## 收集点垃圾管理

### 查询收集点垃圾重量列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询收集点垃圾重量列表 |
| 接口描述 | 支持多条件分页查询收集点每日垃圾重量数据 |
| 请求方式 | `POST` |
| 请求路径 | `/api/transfer/collection-point/weight/list` |

#### 请求参数（Request Body）

```json
{
  "pointName": "中山北路",
  "startDate": "2024-05-01",
  "endDate": "2024-05-23",
  "pageNo": 1,
  "pageSize": 20
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| pointName | string | 否 | 收集点名称（模糊匹配） |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": "CP001",
        "pointName": "中山北路收集点",
        "date": "2024-05-23",
        "weight": 12.5,
        "region": "普陀区"
      }
    ]
  }
}
```

## 转运站管理

### 查询转运站进站统计

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询转运站进站统计 |
| 接口描述 | 查询各转运站今日进站车次和垃圾量统计 |
| 请求方式 | `POST` |
| 请求路径 | `/api/transfer/station/stats` |

#### 请求参数（Request Body）

```json
{}
```

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "stationId": "TS001",
      "stationName": "普陀区转运站",
      "todayTrips": 150,
      "todayWeight": 450.5,
      "region": "普陀区"
    }
  ]
}
```

## 垃圾计量管理

### 查询车辆进站明细

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆进站明细 |
| 接口描述 | 分页查询车辆进站称重明细记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/transfer/measurement/vehicle-records` |

#### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "stationId": "TS001",
  "pageNo": 1,
  "pageSize": 20
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| plateNo | string | 否 | 车牌号（模糊匹配） |
| stationId | string | 否 | 转运站ID |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 500,
    "list": [
      {
        "recordId": "R001",
        "plateNo": "沪A·12345",
        "stationName": "普陀区转运站",
        "entryTime": "2024-05-23 10:00:00",
        "exitTime": "2024-05-23 10:15:00",
        "grossWeight": 15.5,
        "tareWeight": 5.0,
        "netWeight": 10.5
      }
    ]
  }
}
```

## 运行监管

### 查询设备运行记录

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询设备运行记录 |
| 接口描述 | 分页查询压缩机、除臭塔等设备运行记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/transfer/operation/equipment-records` |

#### 请求参数（Request Body）

```json
{
  "equipmentType": "compressor",
  "pageNo": 1,
  "pageSize": 20
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| equipmentType | string | 否 | 设备类型（compressor/deodorizer/catalysis） |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 200,
    "list": [
      {
        "recordId": "E001",
        "equipmentName": "1号压缩机",
        "equipmentType": "compressor",
        "stationName": "普陀区转运站",
        "status": "normal",
        "recordTime": "2024-05-23 10:00:00",
        "details": "运行平稳，压力正常"
      }
    ]
  }
}
```

## 视频监控管理

### 查询监控视频列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询监控视频列表 |
| 接口描述 | 分页查询转运设施监控视频点位 |
| 请求方式 | `POST` |
| 请求路径 | `/api/transfer/video/list` |

#### 请求参数（Request Body）

```json
{
  "stationId": "TS001",
  "pageNo": 1,
  "pageSize": 20
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| stationId | string | 否 | 转运站ID |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "list": [
      {
        "cameraId": "C001",
        "cameraName": "进站口监控1",
        "stationName": "普陀区转运站",
        "status": "online",
        "streamUrl": "http://example.com/stream1"
      }
    ]
  }
}
```
