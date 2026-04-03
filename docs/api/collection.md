# 垃圾收运监管 API 文档 (Garbage Collection Supervision API)

## 1. 查询收运路线列表

### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询收运路线列表 |
| 接口描述 | 支持按路线名称、状态分页查询收运路线 |
| 请求方式 | `POST` |
| 请求路径 | `/api/collection/routes/list` |

### 请求参数 (Request Body)
```json
{
  "routeName": "路线A",
  "status": "active",
  "pageNo": 1,
  "pageSize": 10
}
```

### 返回结果 (Response Body)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 20,
    "list": [
      {
        "routeId": "R001",
        "routeName": "中山路清运专线",
        "assignedVehicle": "沪A12345",
        "assignedDriver": "张师傅",
        "coveragePoints": 15,
        "status": "active",
        "efficiency": 92
      }
    ]
  }
}
```

## 2. 查询收运记录列表

### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询收运记录列表 |
| 接口描述 | 支持按日期、车牌号分页查询收运记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/collection/records/list` |

### 请求参数 (Request Body)
```json
{
  "date": "2023-10-27",
  "plateNo": "沪A",
  "pageNo": 1,
  "pageSize": 10
}
```

### 返回结果 (Response Body)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "list": [
      {
        "recordId": "REC001",
        "routeId": "R001",
        "routeName": "中山路清运专线",
        "plateNo": "沪A12345",
        "startTime": "2023-10-27 06:00:00",
        "endTime": "2023-10-27 10:30:00",
        "collectedWeight": 4.5,
        "status": "completed"
      }
    ]
  }
}
```

## 3. 查询垃圾桶列表

### 基本信息
| 项目 | 内容 |
|------|------|
| 接口名称 | 查询垃圾桶列表 |
| 接口描述 | 支持按区域、状态分页查询垃圾桶信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/collection/bins/list` |

### 请求参数 (Request Body)
```json
{
  "region": "普陀区",
  "status": "full",
  "pageNo": 1,
  "pageSize": 10
}
```

### 返回结果 (Response Body)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "binId": "B001",
        "location": "中山北路3663号",
        "region": "普陀区",
        "type": "干垃圾",
        "capacity": 240,
        "fillLevel": 85,
        "status": "normal",
        "lastCollected": "2023-10-27 08:15:00"
      }
    ]
  }
}
```
