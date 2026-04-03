# 终端处置场监管 API 文档

## 1. 垃圾计量管理 (填埋场/焚烧厂/餐厨处理厂通用)

### 查询进场计量明细列表

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询进场计量明细列表 |
| 接口描述 | 分页查询各类型处置场的车辆进场及垃圾称重记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/measurement/list` |

#### 请求参数
```json
{
  "plantType": "landfill", // landfill: 填埋场, incineration: 焚烧厂, kitchen: 餐厨处理厂
  "plantName": "老港填埋场",
  "vehiclePlate": "沪A12345",
  "startDate": "2023-10-01",
  "endDate": "2023-10-07",
  "pageNo": 1,
  "pageSize": 10
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 150,
    "list": [
      {
        "recordId": "M001",
        "plantName": "老港填埋场",
        "vehiclePlate": "沪A12345",
        "grossWeight": 15.5,
        "tareWeight": 5.5,
        "netWeight": 10.0,
        "inTime": "2023-10-01 08:30:00",
        "outTime": "2023-10-01 09:15:00"
      }
    ]
  }
}
```

### 查询计量汇总统计

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询计量汇总统计 |
| 接口描述 | 获取按处置场、区域统计的进场车次和垃圾量 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/measurement/stats` |

#### 请求参数
```json
{
  "plantType": "landfill",
  "date": "2023-10-27"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalVehicles": 350,
    "totalWeight": 3500.5,
    "byPlant": [
      { "name": "老港填埋场", "vehicles": 200, "weight": 2000.0 },
      { "name": "黎明填埋场", "vehicles": 150, "weight": 1500.5 }
    ]
  }
}
```

## 2. 填埋场监测数据展示

### 查询填埋场实时监测数据

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询填埋场实时监测数据 |
| 接口描述 | 获取填埋场渗滤液、气体监测指标及异常预警 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/landfill/monitor` |

#### 请求参数
```json
{
  "plantId": "L001"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "leachateLevel": 2.5,
    "gasConcentration": {
      "methane": 1.2,
      "h2s": 0.05
    },
    "alarms": [
      { "time": "10:00", "type": "甲烷超标", "level": "warning" }
    ]
  }
}
```

## 3. 焚烧厂环保指标管理

### 查询焚烧厂环保指标

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询焚烧厂环保指标 |
| 接口描述 | 获取焚烧厂烟气排放指标及设备状态 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/incineration/env-indicators` |

#### 请求参数
```json
{
  "plantId": "I001"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "emissions": {
      "so2": 15.2,
      "nox": 45.5,
      "co": 8.0,
      "hcl": 5.1,
      "dust": 2.3
    },
    "equipmentStatus": "normal",
    "alarms": []
  }
}
```

## 4. 餐厨处理厂处理指标管理

### 查询餐厨处理指标

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询餐厨处理指标 |
| 接口描述 | 获取污水、废渣、废油脂及资源化产品产出量 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/kitchen/process-indicators` |

#### 请求参数
```json
{
  "plantId": "K001",
  "date": "2023-10-27"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "sewageVolume": 120.5,
    "wasteResidueVolume": 45.0,
    "wasteOilVolume": 15.2,
    "products": {
      "organicFertilizer": 30.0,
      "biogas": 500.0,
      "sludge": 10.0
    }
  }
}
```

## 5. 视频监控管理 (通用)

### 查询视频监控列表

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询视频监控列表 |
| 接口描述 | 获取各处置场的监控摄像头列表及状态 |
| 请求方式 | `POST` |
| 请求路径 | `/api/disposal/video/list` |

#### 请求参数
```json
{
  "plantType": "landfill",
  "plantId": "L001"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "cameraId": "C001",
      "cameraName": "地磅入口监控",
      "location": "主入口",
      "status": "online",
      "streamUrl": "http://example.com/stream/c001"
    }
  ]
}
```
