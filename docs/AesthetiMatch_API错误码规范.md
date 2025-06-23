# 🚨 AesthetiMatch API错误码规范

## 📋 文档说明

本文档定义了AesthetiMatch API的完整错误处理机制，包括HTTP状态码使用规范和业务错误码体系。

---

## 🎯 错误处理机制

### 双层错误处理设计

我们采用**HTTP状态码 + 业务错误码**的双层机制：

- **HTTP状态码**：表示请求在HTTP协议层面的处理结果
- **业务错误码**：表示具体的业务逻辑错误类型

### 统一错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: string; // 用户友好的错误描述
  code: string; // 业务错误码（用于程序处理）
  details?: any; // 错误详细信息（可选）
  timestamp?: string; // 错误发生时间（可选）
  requestId?: string; // 请求追踪ID（可选）
}
```

---

## 📊 HTTP状态码使用规范

### 2xx 成功类状态码

| 状态码             | 使用场景             | 示例                         |
| ------------------ | -------------------- | ---------------------------- |
| **200 OK**         | 查询成功、更新成功   | 获取用户信息、更新个人资料   |
| **201 Created**    | 资源创建成功         | 用户注册、创建房间、提交测试 |
| **204 No Content** | 操作成功但无返回内容 | 删除操作、某些更新操作       |

**示例**：

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "nickname": "小美"
    }
  }
}
```

### 4xx 客户端错误类状态码

| 状态码                    | 使用场景                   | 对应错误码前缀                |
| ------------------------- | -------------------------- | ----------------------------- |
| **400 Bad Request**       | 请求参数错误、数据验证失败 | `VALIDATION_*`, `INVALID_*`   |
| **401 Unauthorized**      | 未认证、认证失败           | `AUTH_*`, `TOKEN_*`           |
| **403 Forbidden**         | 权限不足、操作被禁止       | `PERMISSION_*`, `FORBIDDEN_*` |
| **404 Not Found**         | 资源不存在                 | `NOT_FOUND_*`                 |
| **409 Conflict**          | 资源冲突、重复操作         | `CONFLICT_*`, `DUPLICATE_*`   |
| **429 Too Many Requests** | 请求频率超限               | `RATE_LIMIT_*`                |

**示例**：

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "手机号格式不正确",
  "code": "INVALID_PHONE_FORMAT",
  "details": {
    "field": "phone",
    "value": "123456"
  }
}
```

### 5xx 服务端错误类状态码

| 状态码                        | 使用场景       | 对应错误码前缀            |
| ----------------------------- | -------------- | ------------------------- |
| **500 Internal Server Error** | 服务器内部错误 | `INTERNAL_*`, `SERVICE_*` |
| **502 Bad Gateway**           | 上游服务错误   | `GATEWAY_*`, `UPSTREAM_*` |
| **503 Service Unavailable**   | 服务暂时不可用 | `SERVICE_UNAVAILABLE_*`   |

**示例**：

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "success": false,
  "error": "AI分析服务暂时不可用",
  "code": "AI_SERVICE_UNAVAILABLE",
  "details": {
    "retryAfter": 30
  }
}
```

---

## 🏷️ 业务错误码体系

### 错误码命名规范

```
错误码格式：{MODULE}_{ERROR_TYPE}[_{DETAIL}]

模块前缀：
- AUTH: 认证相关
- USER: 用户相关
- TEST: 测试相关
- ROOM: 房间相关
- PAYMENT: 支付相关
- ANALYSIS: 分析相关
- SHARE: 分享相关

错误类型：
- INVALID: 无效/格式错误
- NOT_FOUND: 不存在
- EXPIRED: 已过期
- FORBIDDEN: 禁止操作
- CONFLICT: 冲突
- FAILED: 操作失败
- UNAVAILABLE: 不可用
```

### 1. 认证相关错误码 (4xx)

#### HTTP 400 - 请求参数错误

| 错误码                | 描述             | 详细说明               |
| --------------------- | ---------------- | ---------------------- |
| `AUTH_INVALID_PHONE`  | 手机号格式不正确 | 手机号不符合规范       |
| `AUTH_INVALID_CODE`   | 验证码格式错误   | 验证码长度或格式不正确 |
| `AUTH_CODE_EXPIRED`   | 验证码已过期     | 验证码超过有效期       |
| `AUTH_CODE_INCORRECT` | 验证码错误       | 验证码不匹配           |
| `AUTH_CODE_USED`      | 验证码已使用     | 验证码已被使用过       |

```json
{
  "success": false,
  "error": "验证码已过期，请重新获取",
  "code": "AUTH_CODE_EXPIRED",
  "details": {
    "expiredAt": "2024-01-01T12:05:00Z",
    "currentTime": "2024-01-01T12:10:00Z"
  }
}
```

#### HTTP 401 - 认证失败

| 错误码                       | 描述           | 详细说明                  |
| ---------------------------- | -------------- | ------------------------- |
| `AUTH_TOKEN_MISSING`         | 缺少访问令牌   | 请求头中没有Authorization |
| `AUTH_TOKEN_INVALID`         | 访问令牌无效   | 令牌格式错误或已被篡改    |
| `AUTH_TOKEN_EXPIRED`         | 访问令牌已过期 | 令牌超过有效期            |
| `AUTH_REFRESH_TOKEN_INVALID` | 刷新令牌无效   | 刷新令牌错误或已过期      |
| `AUTH_SESSION_EXPIRED`       | 会话已过期     | 用户会话超时              |

```json
{
  "success": false,
  "error": "访问令牌已过期，请重新登录",
  "code": "AUTH_TOKEN_EXPIRED",
  "details": {
    "expiredAt": "2024-01-01T12:00:00Z"
  }
}
```

#### HTTP 409 - 资源冲突

| 错误码              | 描述         | 详细说明           |
| ------------------- | ------------ | ------------------ |
| `AUTH_PHONE_EXISTS` | 手机号已存在 | 该手机号已被注册   |
| `AUTH_USER_EXISTS`  | 用户已存在   | 用户已在系统中存在 |

### 2. 用户相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                  | 描述           | 详细说明                     |
| ----------------------- | -------------- | ---------------------------- |
| `USER_INVALID_NICKNAME` | 昵称格式不正确 | 昵称长度或字符不符合规范     |
| `USER_INVALID_AVATAR`   | 头像格式不正确 | 头像文件格式或大小不符合要求 |
| `USER_INVALID_BIRTHDAY` | 生日格式不正确 | 生日格式不符合YYYY-MM-DD     |

#### HTTP 404 - 资源不存在

| 错误码                   | 描述           | 详细说明           |
| ------------------------ | -------------- | ------------------ |
| `USER_NOT_FOUND`         | 用户不存在     | 指定的用户ID不存在 |
| `USER_PROFILE_NOT_FOUND` | 用户资料不存在 | 用户资料未完善     |

#### HTTP 403 - 权限不足

| 错误码                     | 描述             | 详细说明             |
| -------------------------- | ---------------- | -------------------- |
| `USER_PROFILE_FORBIDDEN`   | 无权访问用户资料 | 无权查看他人私密资料 |
| `USER_OPERATION_FORBIDDEN` | 无权执行该操作   | 无权修改他人信息     |

### 3. 测试相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                       | 描述         | 详细说明               |
| ---------------------------- | ------------ | ---------------------- |
| `TEST_INVALID_ANSWERS`       | 答案格式错误 | 答案数据结构不正确     |
| `TEST_INSUFFICIENT_ANSWERS`  | 答案数量不足 | 答案数量低于最低要求   |
| `TEST_INVALID_QUESTION_ID`   | 题目ID无效   | 题目ID不存在或格式错误 |
| `TEST_INVALID_ANSWER_CHOICE` | 答案选项无效 | 答案选项不是A或B       |

#### HTTP 404 - 资源不存在

| 错误码                    | 描述           | 详细说明       |
| ------------------------- | -------------- | -------------- |
| `TEST_SESSION_NOT_FOUND`  | 测试会话不存在 | 测试会话ID无效 |
| `TEST_RESULT_NOT_FOUND`   | 测试结果不存在 | 测试结果ID无效 |
| `TEST_QUESTION_NOT_FOUND` | 题目不存在     | 题目ID不存在   |

#### HTTP 409 - 冲突错误

| 错误码                   | 描述           | 详细说明           |
| ------------------------ | -------------- | ------------------ |
| `TEST_SESSION_EXPIRED`   | 测试会话已过期 | 测试会话超过有效期 |
| `TEST_ALREADY_COMPLETED` | 测试已完成     | 测试不能重复提交   |
| `TEST_ALREADY_SUBMITTED` | 答案已提交     | 该题目答案已提交   |

#### HTTP 429 - 频率限制

| 错误码                     | 描述         | 详细说明                   |
| -------------------------- | ------------ | -------------------------- |
| `TEST_RATE_LIMIT_EXCEEDED` | 测试频率超限 | 超过每日测试次数限制       |
| `TEST_DAILY_LIMIT_REACHED` | 达到每日限制 | 免费用户每日测试次数已用完 |

```json
{
  "success": false,
  "error": "免费用户每日测试次数已用完，升级会员解锁无限测试",
  "code": "TEST_DAILY_LIMIT_REACHED",
  "details": {
    "dailyLimit": 3,
    "usedCount": 3,
    "resetAt": "2024-01-02T00:00:00Z",
    "upgradeUrl": "/membership/plans"
  }
}
```

### 4. 房间相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                  | 描述             | 详细说明                 |
| ----------------------- | ---------------- | ------------------------ |
| `ROOM_INVALID_TITLE`    | 房间标题格式错误 | 标题长度或字符不符合规范 |
| `ROOM_INVALID_PASSWORD` | 房间密码格式错误 | 密码长度或格式不正确     |
| `ROOM_INVALID_TYPE`     | 房间类型无效     | 房间类型不在支持范围内   |

#### HTTP 404 - 资源不存在

| 错误码                | 描述         | 详细说明               |
| --------------------- | ------------ | ---------------------- |
| `ROOM_NOT_FOUND`      | 房间不存在   | 房间码无效或房间已删除 |
| `ROOM_CODE_NOT_FOUND` | 房间码不存在 | 房间码格式正确但不存在 |

#### HTTP 403 - 权限不足

| 错误码                    | 描述         | 详细说明             |
| ------------------------- | ------------ | -------------------- |
| `ROOM_PASSWORD_REQUIRED`  | 需要房间密码 | 私密房间需要密码访问 |
| `ROOM_PASSWORD_INCORRECT` | 房间密码错误 | 输入的密码不正确     |
| `ROOM_ACCESS_FORBIDDEN`   | 禁止访问房间 | 用户被房主禁止访问   |

#### HTTP 409 - 冲突错误

| 错误码                      | 描述         | 详细说明               |
| --------------------------- | ------------ | ---------------------- |
| `ROOM_EXPIRED`              | 房间已过期   | 房间超过有效期         |
| `ROOM_FULL`                 | 房间人数已满 | 房间参与人数达到上限   |
| `ROOM_ALREADY_JOINED`       | 已在房间中   | 用户已经是房间成员     |
| `ROOM_CREATOR_CANNOT_LEAVE` | 房主不能离开 | 房间创建者不能离开房间 |

```json
{
  "success": false,
  "error": "房间人数已满，无法加入",
  "code": "ROOM_FULL",
  "details": {
    "maxParticipants": 8,
    "currentParticipants": 8,
    "roomCode": "ABC123"
  }
}
```

### 5. 分析相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                     | 描述           | 详细说明                   |
| -------------------------- | -------------- | -------------------------- |
| `ANALYSIS_INVALID_USER_ID` | 用户ID无效     | 对比分析的用户ID格式错误   |
| `ANALYSIS_SAME_USER`       | 不能与自己对比 | 对比分析的两个用户是同一人 |

#### HTTP 404 - 资源不存在

| 错误码                      | 描述           | 详细说明           |
| --------------------------- | -------------- | ------------------ |
| `ANALYSIS_RESULT_NOT_FOUND` | 分析结果不存在 | 分析结果ID无效     |
| `ANALYSIS_USER_NO_RESULT`   | 用户无测试结果 | 用户还没有完成测试 |

#### HTTP 500 - 服务错误

| 错误码                       | 描述         | 详细说明             |
| ---------------------------- | ------------ | -------------------- |
| `ANALYSIS_GENERATION_FAILED` | 分析生成失败 | 算法分析过程出错     |
| `ANALYSIS_AI_UNAVAILABLE`    | AI服务不可用 | AI分析服务暂时不可用 |

### 6. 会员与支付相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                   | 描述         | 详细说明               |
| ------------------------ | ------------ | ---------------------- |
| `PAYMENT_INVALID_PLAN`   | 套餐ID无效   | 会员套餐不存在         |
| `PAYMENT_INVALID_METHOD` | 支付方式无效 | 不支持的支付方式       |
| `PAYMENT_INVALID_AMOUNT` | 金额错误     | 支付金额与套餐价格不符 |

#### HTTP 402 - 需要付费

| 错误码                    | 描述         | 详细说明         |
| ------------------------- | ------------ | ---------------- |
| `PAYMENT_REQUIRED`        | 需要付费     | 功能需要会员权限 |
| `MEMBERSHIP_EXPIRED`      | 会员已过期   | 会员权限已过期   |
| `MEMBERSHIP_INSUFFICIENT` | 会员等级不足 | 需要更高等级会员 |

#### HTTP 409 - 冲突错误

| 错误码                 | 描述       | 详细说明         |
| ---------------------- | ---------- | ---------------- |
| `PAYMENT_ORDER_EXISTS` | 订单已存在 | 存在未完成的订单 |
| `PAYMENT_ALREADY_PAID` | 订单已支付 | 订单重复支付     |

```json
{
  "success": false,
  "error": "该功能需要高级会员权限",
  "code": "MEMBERSHIP_INSUFFICIENT",
  "details": {
    "required": "premium",
    "current": "free",
    "feature": "ai_generation",
    "upgradeUrl": "/membership/plans"
  }
}
```

### 7. 分享相关错误码

#### HTTP 400 - 请求参数错误

| 错误码                 | 描述         | 详细说明             |
| ---------------------- | ------------ | -------------------- |
| `SHARE_INVALID_TYPE`   | 分享类型无效 | 不支持的分享类型     |
| `SHARE_INVALID_TARGET` | 分享目标无效 | 分享的目标资源不存在 |

#### HTTP 404 - 资源不存在

| 错误码            | 描述       | 详细说明       |
| ----------------- | ---------- | -------------- |
| `SHARE_NOT_FOUND` | 分享不存在 | 分享ID无效     |
| `SHARE_EXPIRED`   | 分享已过期 | 分享链接已过期 |

---

## 🔧 客户端错误处理最佳实践

### 1. 基于HTTP状态码的分类处理

```typescript
class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

async function handleAPIResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    switch (response.status) {
      case 400:
        // 请求参数错误 - 显示具体错误信息
        throw new APIError(400, data.code, data.error, data.details);

      case 401:
        // 认证错误 - 跳转登录页
        if (data.code === "AUTH_TOKEN_EXPIRED") {
          // 尝试刷新令牌
          await refreshToken();
        } else {
          // 跳转登录
          redirectToLogin();
        }
        break;

      case 403:
        // 权限错误 - 显示权限不足提示
        if (data.code.startsWith("MEMBERSHIP_")) {
          // 跳转会员页面
          redirectToMembership();
        } else {
          showPermissionError(data.error);
        }
        break;

      case 404:
        // 资源不存在 - 显示404页面或提示
        showNotFoundError(data.error);
        break;

      case 429:
        // 频率限制 - 显示限制提示
        showRateLimitError(data.error, data.details.retryAfter);
        break;

      case 500:
        // 服务器错误 - 显示通用错误提示
        showServerError(data.error);
        break;

      default:
        throw new APIError(
          response.status,
          data.code,
          data.error,
          data.details
        );
    }
  }

  return data;
}
```

### 2. 基于业务错误码的精细化处理

```typescript
function handleBusinessError(error: APIError) {
  switch (error.code) {
    // 认证相关
    case "AUTH_CODE_EXPIRED":
      showMessage("验证码已过期，正在重新发送...", "warning");
      resendCode();
      break;

    case "AUTH_PHONE_EXISTS":
      showMessage("该手机号已注册，请直接登录", "info");
      switchToLogin();
      break;

    // 测试相关
    case "TEST_DAILY_LIMIT_REACHED":
      showUpgradeDialog({
        title: "每日免费测试次数已用完",
        message: "升级会员解锁无限测试次数",
        upgradeUrl: error.details.upgradeUrl,
      });
      break;

    case "TEST_SESSION_EXPIRED":
      showMessage("测试会话已过期，为您重新开始测试", "warning");
      startNewTest();
      break;

    // 房间相关
    case "ROOM_FULL":
      showMessage(`房间人数已满(${error.details.maxParticipants}人)`, "error");
      suggestCreateNewRoom();
      break;

    case "ROOM_PASSWORD_REQUIRED":
      showPasswordDialog(error.details.roomCode);
      break;

    // 会员相关
    case "MEMBERSHIP_INSUFFICIENT":
      showUpgradeDialog({
        title: `需要${error.details.required}会员`,
        message: `当前功能需要${error.details.required}会员权限`,
        feature: error.details.feature,
        upgradeUrl: error.details.upgradeUrl,
      });
      break;

    default:
      // 通用错误处理
      showMessage(error.message, "error");
  }
}
```

### 3. 用户友好的错误提示

```typescript
const ERROR_MESSAGES = {
  // 网络相关
  NETWORK_ERROR: "网络连接失败，请检查网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后重试",

  // 认证相关
  AUTH_TOKEN_EXPIRED: "登录已过期，请重新登录",
  AUTH_CODE_INCORRECT: "验证码错误，请重新输入",

  // 测试相关
  TEST_DAILY_LIMIT_REACHED: "今日免费测试次数已用完",
  TEST_SESSION_EXPIRED: "测试会话已过期，请重新开始",

  // 房间相关
  ROOM_NOT_FOUND: "房间不存在或已过期",
  ROOM_FULL: "房间人数已满，无法加入",

  // 会员相关
  MEMBERSHIP_EXPIRED: "会员已过期，请续费",
};

function getUserFriendlyMessage(code: string, defaultMessage: string): string {
  return ERROR_MESSAGES[code] || defaultMessage;
}
```

---

## 📝 错误日志记录

### 客户端日志

```typescript
function logError(error: APIError, context: any) {
  console.error("API Error:", {
    timestamp: new Date().toISOString(),
    status: error.status,
    code: error.code,
    message: error.message,
    details: error.details,
    context: context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  });

  // 发送错误报告到监控系统
  if (error.status >= 500) {
    reportToMonitoring(error, context);
  }
}
```

### 服务端日志

```javascript
// 错误日志中间件
function errorLogger(err, req, res, next) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"],
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    userId: req.user?.id,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
  };

  console.error("API Error:", errorLog);

  // 发送到日志系统
  logger.error("api_error", errorLog);

  next(err);
}
```

---

通过这套完整的错误处理机制，我们既有HTTP状态码提供的标准化错误分类，又有业务错误码提供的精细化错误信息，能够帮助客户端准确识别和处理各种错误情况，同时为用户提供友好的错误提示和解决方案。
