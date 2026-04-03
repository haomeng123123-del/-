# 垃圾分类管理模块 API 文档

## 1. 基础信息管理

### 1.1 查询基础信息列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询基础信息列表 |
| 接口描述 | 支持按类型、关键字分页查询基础信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sorting/basic-info/list` |

#### 请求参数（Request Body）

```json
{
  "infoType": "小区",
  "keyword": "阳光",
  "pageNo": 1,
  "pageSize": 10
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| infoType | string | 是 | 信息类型，如：小区、居民、运营单位等 |
| keyword | string | 否 | 关键字（名称或负责人） |
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
        "id": "B001",
        "name": "阳光小区",
        "type": "小区",
        "address": "朝阳区阳光路1号",
        "manager": "张三",
        "phone": "13800138000",
        "status": "正常",
        "createTime": "2023-10-01 10:00:00"
      }
    ]
  }
}
```

## 2. 在线填报管理

### 2.1 查询填报记录列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询填报记录列表 |
| 接口描述 | 支持按状态、关键字分页查询填报记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sorting/report/list` |

#### 请求参数（Request Body）

```json
{
  "status": "已提交",
  "keyword": "10月",
  "pageNo": 1,
  "pageSize": 10
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| status | string | 否 | 状态（暂存、已提交） |
| keyword | string | 否 | 关键字（标题或填报人） |
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
        "id": "R001",
        "title": "2023年10月垃圾分类数据填报",
        "submitter": "李四",
        "submitTime": "2023-10-31 14:30:00",
        "status": "已提交",
        "attachments": 2
      }
    ]
  }
}
```

## 3. 分类收运监管

### 3.1 查询收运监管列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询收运监管列表 |
| 接口描述 | 支持按监管模块类型、关键字分页查询收运监管记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sorting/collection/list` |

#### 请求参数（Request Body）

```json
{
  "monitorType": "实时监测",
  "keyword": "京A88888",
  "pageNo": 1,
  "pageSize": 10
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| monitorType | string | 是 | 监管类型（实时监测、收运计划、收运记录、汇总统计） |
| keyword | string | 否 | 关键字（收集点名称或车牌号） |
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
        "id": "C001",
        "pointName": "阳光小区收集点1",
        "vehiclePlate": "京A88888",
        "weight": 500,
        "wasteType": "厨余垃圾",
        "collectionTime": "2023-10-31 08:00:00",
        "status": "正常"
      }
    ]
  }
}
```

## 4. 分类处理监管

### 4.1 查询处理监管列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询处理监管列表 |
| 接口描述 | 支持按监管模块类型、关键字分页查询处理监管记录 |
| 请求方式 | `POST` |
| 请求路径 | `/api/sorting/treatment/list` |

#### 请求参数（Request Body）

```json
{
  "monitorType": "进场计量管理",
  "keyword": "处理厂",
  "pageNo": 1,
  "pageSize": 10
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| monitorType | string | 是 | 监管类型（进场计量管理、视频监控管理） |
| keyword | string | 否 | 关键字（处理设施名称或车牌号） |
| pageNo | int | 是 | 页码，从 1 开始 |
| pageSize | int | 是 | 每页大小 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 150,
    "list": [
      {
        "id": "T001",
        "facilityName": "朝阳区垃圾处理厂1",
        "vehiclePlate": "京A90000",
        "weight": 1000,
        "wasteType": "厨余垃圾",
        "entryTime": "2023-10-31 09:00:00",
        "status": "正常"
      }
    ]
  }
}
```
