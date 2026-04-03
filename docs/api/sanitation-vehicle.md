# 环卫车辆管理系统 API 文档

## 1. 查询车辆列表

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆列表 |
| 接口描述 | 支持多条件分页查询环卫车辆 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/list` |

### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 50
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| plateNo | string | 否 | 车牌号（模糊匹配） |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 30,
    "list": [
      {
        "id": "V100",
        "plateNo": "沪A·12345",
        "type": "湿垃圾清运",
        "location": "静安区南京西路段",
        "status": "作业中",
        "consumption": "15.2L / 100km",
        "loadRate": 80,
        "engineTemp": 85,
        "lat": 31.23,
        "lng": 121.47
      }
    ]
  }
}
```

## 2. 查询车辆轨迹

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆轨迹 |
| 接口描述 | 查询车辆的历史行驶轨迹 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/track/list` |

### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 50
}
```

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "list": [
      {
        "id": "TRK-0",
        "vehicleId": "V100",
        "plateNo": "沪A·12345",
        "lat": 31.23,
        "lng": 121.47,
        "speed": 45,
        "timestamp": "2023-10-24T10:00:00.000Z"
      }
    ]
  }
}
```

## 3. 查询车辆作业记录

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆作业记录 |
| 接口描述 | 查询车辆的作业时间、区域和状态 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/operation/list` |

### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 50
}
```

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 25,
    "list": [
      {
        "id": "OP-0",
        "vehicleId": "V100",
        "plateNo": "沪A·12345",
        "driver": "张三",
        "startTime": "2023-10-24T08:00:00.000Z",
        "endTime": "2023-10-24T10:00:00.000Z",
        "workArea": "静安区",
        "status": "进行中",
        "mileage": 45
      }
    ]
  }
}
```

## 4. 查询车辆视频流

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆视频流 |
| 接口描述 | 获取车辆的实时视频流地址 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/video/list` |

### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 50
}
```

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 30,
    "list": [
      {
        "id": "VID-0",
        "vehicleId": "V100",
        "plateNo": "沪A·12345",
        "channel": "CH1",
        "status": "在线",
        "url": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      }
    ]
  }
}
```

## 5. 查询车辆报警记录

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆报警记录 |
| 接口描述 | 查询车辆的异常报警信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/alarm/list` |

### 请求参数（Request Body）

```json
{
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 50
}
```

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 30,
    "list": [
      {
        "id": "ALM-0",
        "vehicleId": "V100",
        "plateNo": "沪A·12345",
        "alarmType": "超速",
        "alarmTime": "2023-10-24T09:30:00.000Z",
        "level": "严重",
        "status": "未处理",
        "location": "静安区南京西路"
      }
    ]
  }
}
```

## 6. 查询电子围栏

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询电子围栏 |
| 接口描述 | 查询电子围栏列表 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/fence/list` |

### 请求参数（Request Body）

```json
{
  "name": "测试",
  "pageNo": 1,
  "pageSize": 50
}
```

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 10,
    "list": [
      {
        "id": "FNC-0",
        "name": "测试围栏-1",
        "type": "禁行区",
        "points": [
          { "lat": 31.23, "lng": 121.47 }
        ],
        "status": "启用",
        "description": "这是一个禁行区的测试围栏"
      }
    ]
  }
}
```

## 7. 查询车辆统计数据

### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询车辆统计数据 |
| 接口描述 | 获取车辆的总体统计指标 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sanitation/vehicle/stats` |

### 请求参数（Request Body）

无

### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalVehicles": 120,
    "onlineVehicles": 98,
    "workingVehicles": 85,
    "totalMileage": 12500,
    "totalAlarms": 15,
    "fuelConsumption": 3200
  }
}
```
