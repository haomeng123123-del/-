# 数据资源管理模块 API 文档

## 环卫设施管理

### 查询设施列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询设施列表 |
| 接口描述 | 分页查询环卫设施信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/data/facility/list` |

#### 请求参数（Request Body）

```json
{
  "pageNo": 1,
  "pageSize": 20,
  "type": "toilet",
  "status": "active",
  "keyword": "南京西路"
}
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| pageNo | int | 是 | 页码 |
| pageSize | int | 是 | 每页大小 |
| type | string | 否 | 设施类型 |
| status | string | 否 | 状态 |
| keyword | string | 否 | 关键词搜索 |

#### 返回结果（Response Body）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": "FAC-001",
        "name": "南京西路公厕",
        "type": "toilet",
        "status": "active",
        "address": "南京西路100号",
        "manager": "张三",
        "contact": "13800138000"
      }
    ]
  }
}
```

---

### 新增/更新设施

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 新增/更新设施 |
| 接口描述 | 创建新设施或更新现有设施信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/data/facility/save` |

#### 请求参数（Request Body）

```json
{
  "id": "FAC-001",
  "name": "南京西路公厕",
  "type": "toilet",
  "status": "active",
  "address": "南京西路100号",
  "manager": "张三",
  "contact": "13800138000"
}
```

---

## 工作信息报送

### 查询报送列表

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 查询报送列表 |
| 接口描述 | 分页查询工作报送信息 |
| 请求方式 | `POST` |
| 请求路径 | `/api/data/report/list` |

#### 请求参数（Request Body）

```json
{
  "pageNo": 1,
  "pageSize": 20,
  "type": "daily",
  "status": "pending"
}
```

---

### 报送审核

#### 基本信息

| 项目 | 内容 |
|------|------|
| 接口名称 | 报送审核 |
| 接口描述 | 对报送信息进行审核（通过/驳回） |
| 请求方式 | `POST` |
| 请求路径 | `/api/data/report/audit` |

#### 请求参数（Request Body）

```json
{
  "id": "REP-001",
  "status": "approved",
  "remarks": "审核通过"
}
```
