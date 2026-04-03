# 智慧公厕监管 API 文档

## 1. 公厕管理地图

### 查询公厕地图点位列表

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询公厕地图点位列表 |
| 接口描述 | 获取公厕位置、基本信息及实时状态，用于地图展示 |
| 请求方式 | `POST` |
| 请求路径 | `/api/facility/map/list` |

#### 请求参数
```json
{
  "toiletName": "中山公园",
  "region": "长宁区"
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| toiletName | string | 否 | 公厕名称（模糊匹配） |
| region | string | 否 | 所属区域 |

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "toiletId": "T001",
      "toiletName": "中山公园一号公厕",
      "region": "长宁区",
      "location": "中山公园内",
      "longitude": 121.41,
      "latitude": 31.22,
      "status": "normal",
      "odorLevel": 12.5,
      "passengerFlow": 150,
      "alarmCount": 0
    }
  ]
}
```

## 2. 实时监测管理

### 查询公厕监测数据

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询公厕监测数据 |
| 接口描述 | 获取指定公厕的臭气值、客流量趋势及报警记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/facility/monitor/data` |

#### 请求参数
```json
{
  "toiletId": "T001",
  "startDate": "2023-10-01",
  "endDate": "2023-10-07"
}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "odorTrend": [
      { "time": "08:00", "value": 10.2 },
      { "time": "09:00", "value": 15.5 }
    ],
    "flowTrend": [
      { "time": "08:00", "value": 45 },
      { "time": "09:00", "value": 120 }
    ],
    "alarms": [
      {
        "alarmId": "A001",
        "time": "2023-10-01 09:15:00",
        "type": "臭气超标",
        "value": "50.5",
        "status": "unhandled"
      }
    ]
  }
}
```

## 3. 作业保洁管理

### 查询保洁考勤记录

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询保洁考勤记录 |
| 接口描述 | 分页查询保洁人员考勤打卡及异常情况 |
| 请求方式 | `POST` |
| 请求路径 | `/api/facility/cleaning/attendance/list` |

#### 请求参数
```json
{
  "staffName": "张三",
  "date": "2023-10-27",
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
    "total": 50,
    "list": [
      {
        "recordId": "AT001",
        "staffName": "张三",
        "toiletName": "中山公园一号公厕",
        "shift": "早班 (06:00-14:00)",
        "clockInTime": "05:55:00",
        "clockOutTime": "14:05:00",
        "status": "normal"
      }
    ]
  }
}
```

## 4. 例行检查管理

### 查询检查记录列表

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询检查记录列表 |
| 接口描述 | 分页查询公厕例行检查结果及异常情况 |
| 请求方式 | `POST` |
| 请求路径 | `/api/facility/inspection/list` |

#### 请求参数
```json
{
  "date": "2023-10-27",
  "region": "长宁区",
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
    "total": 30,
    "list": [
      {
        "inspectionId": "IN001",
        "toiletName": "中山公园一号公厕",
        "inspector": "李四",
        "inspectionTime": "2023-10-27 10:30:00",
        "score": 95,
        "issues": "洗手台有水渍",
        "status": "passed"
      }
    ]
  }
}
```

## 5. 汇总统计

### 查询公厕汇总统计数据

#### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询公厕汇总统计数据 |
| 接口描述 | 获取按类别、面积、蹲位、客流等维度的统计图表数据 |
| 请求方式 | `POST` |
| 请求路径 | `/api/facility/statistics/summary` |

#### 请求参数
```json
{}
```

#### 返回结果
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "byCategory": [
      { "name": "一类公厕", "value": 45 },
      { "name": "二类公厕", "value": 120 }
    ],
    "byRegion": [
      { "name": "长宁区", "value": 50 },
      { "name": "普陀区", "value": 65 }
    ],
    "byPassengerFlow": [
      { "name": "高客流", "value": 30 },
      { "name": "中客流", "value": 80 },
      { "name": "低客流", "value": 55 }
    ]
  }
}
```
