# 🔌 AesthetiMatch API设计文档

## 📋 文档信息

**版本**: v1.0  
**基础URL**: `https://api.aesthetimatch.com`  
**认证方式**: JWT Bearer Token  
**请求格式**: JSON  
**响应格式**: JSON

---

## 📐 API设计原则

### RESTful 设计规范

- 使用HTTP动词表示操作类型
- 使用名词表示资源
- 状态码语义化
- 统一的响应格式

### 统一响应格式

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
}
```

---

## 🔐 1. 认证系统 API

### 1.1 手机号注册

```http
POST /api/auth/register
```

**请求参数**:

```typescript
{
  phone: string          // 手机号
  code: string           // 验证码
  nickname?: string      // 昵称（可选）
  inviteCode?: string    // 邀请码（可选）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "phone": "13800138000",
      "nickname": "用户_123",
      "avatar": null,
      "isNewUser": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-xxx",
    "refreshToken": "refresh-token-xxx"
  },
  "message": "注册成功"
}
```

**错误码**:

- `PHONE_ALREADY_EXISTS`: 手机号已存在
- `INVALID_CODE`: 验证码错误或过期
- `INVALID_INVITE_CODE`: 邀请码无效

### 1.2 发送验证码

```http
POST /api/auth/send-code
```

**请求参数**:

```typescript
{
  phone: string; // 手机号
  type: "register" | "login"; // 验证码类型
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "codeId": "code-id-xxx",
    "expiresIn": 300
  },
  "message": "验证码发送成功"
}
```

### 1.3 登录

```http
POST /api/auth/login
```

**请求参数**:

```typescript
{
  phone: string; // 手机号
  code: string; // 验证码
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "phone": "13800138000",
      "nickname": "小美",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "testCount": 5,
      "lastTestAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-xxx",
    "refreshToken": "refresh-token-xxx"
  },
  "message": "登录成功"
}
```

### 1.4 刷新Token

```http
POST /api/auth/refresh
```

**请求头**:

```
Authorization: Bearer <refresh-token>
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token-xxx",
    "refreshToken": "new-refresh-token-xxx"
  }
}
```

### 1.5 第三方登录

```http
POST /api/auth/oauth
```

**请求参数**:

```typescript
{
  provider: 'wechat' | 'qq'    // 第三方平台
  code: string                 // 授权码
  inviteCode?: string          // 邀请码（可选）
}
```

---

## 🎯 2. 审美测试 API

### 2.1 获取测试题目

```http
GET /api/test/questions
```

**请求参数**:

```typescript
{
  category?: 'beauty' | 'art' | 'color' | 'lifestyle' | 'all'  // 题目分类
  difficulty?: 1 | 2 | 3     // 难度等级
  limit?: number             // 题目数量，默认20
  testType?: 'full' | 'quick'  // 测试类型：完整/快速
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": 1,
        "category": "beauty",
        "type": "portrait",
        "question": "你觉得哪个更有魅力？",
        "imageA": {
          "url": "https://cdn.example.com/img1.jpg",
          "description": "经典气质美人"
        },
        "imageB": {
          "url": "https://cdn.example.com/img2.jpg",
          "description": "现代时尚女性"
        },
        "tags": ["颜值", "气质", "经典vs现代"],
        "difficulty": 1
      }
    ],
    "total": 20,
    "testId": "test-session-uuid"
  }
}
```

### 2.2 提交单题答案

```http
POST /api/test/answer
```

**请求参数**:

```typescript
{
  testId: string           // 测试会话ID
  questionId: number       // 题目ID
  answer: 'A' | 'B'       // 选择答案
  timeSpent: number        // 答题用时（毫秒）
  confidence?: 1 | 2 | 3 | 4 | 5  // 选择信心度（可选）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "saved": true,
    "progress": {
      "current": 15,
      "total": 20,
      "percentage": 75
    }
  }
}
```

### 2.3 提交完整测试

```http
POST /api/test/submit
```

**请求参数**:

```typescript
{
  testId: string           // 测试会话ID
  answers: Array<{
    questionId: number
    answer: 'A' | 'B'
    timeSpent: number
    confidence?: number
  }>
  totalTime: number        // 总用时（毫秒）
  userId?: string          // 用户ID（游客模式可选）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "resultId": "result-uuid-xxx",
    "analysisComplete": true,
    "redirectUrl": "/result/result-uuid-xxx"
  },
  "message": "测试提交成功，正在生成分析结果"
}
```

### 2.4 获取测试进度

```http
GET /api/test/progress/:testId
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "testId": "test-session-uuid",
    "progress": {
      "current": 12,
      "total": 20,
      "percentage": 60
    },
    "answers": [
      {
        "questionId": 1,
        "answer": "A",
        "timeSpent": 3200
      }
    ],
    "canResume": true,
    "expiresAt": "2024-01-01T01:00:00Z"
  }
}
```

---

## 📊 3. 分析结果 API

### 3.1 获取分析结果

```http
GET /api/analysis/result/:resultId
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "result-uuid-xxx",
    "userId": "user-uuid-xxx",
    "scores": {
      "classic": 85, // 经典度
      "modern": 62, // 现代度
      "elegant": 78, // 优雅度
      "natural": 45, // 自然度
      "warm": 92, // 温暖度
      "mysterious": 38 // 神秘度
    },
    "aestheticType": {
      "code": "warm_classic",
      "name": "温暖经典型",
      "description": "你的审美偏向温暖和经典的美，喜欢有温度感的事物...",
      "traits": ["偏爱温暖色调", "喜欢经典设计", "重视情感共鸣"],
      "celebrities": ["刘亦菲", "奥黛丽·赫本"]
    },
    "analysis": {
      "summary": "你是一个温暖经典型的审美风格...",
      "strengths": ["审美稳定", "品味经典"],
      "preferences": {
        "colors": ["暖色调", "大地色系"],
        "styles": ["简约经典", "复古优雅"],
        "materials": ["天然材质", "温润质感"]
      }
    },
    "confidence": 0.89, // 分析可信度
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.2 获取用户历史结果

```http
GET /api/analysis/history
```

**请求参数**:

```typescript
{
  page?: number     // 页码，默认1
  limit?: number    // 每页数量，默认10
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "result-uuid-1",
        "aestheticType": "温暖经典型",
        "scores": {...},
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 5
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### 3.3 用户对比分析

```http
POST /api/analysis/compare
```

**请求参数**:

```typescript
{
  userAId: string     // 用户A的ID
  userBId: string     // 用户B的ID
  resultAId?: string  // 指定用户A的测试结果ID（可选）
  resultBId?: string  // 指定用户B的测试结果ID（可选）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "userA": {
      "id": "user-a-id",
      "nickname": "小美",
      "avatar": "https://cdn.example.com/avatar1.jpg",
      "aestheticType": "温暖经典型",
      "scores": {...}
    },
    "userB": {
      "id": "user-b-id",
      "nickname": "小李",
      "avatar": "https://cdn.example.com/avatar2.jpg",
      "aestheticType": "现代前卫型",
      "scores": {...}
    },
    "comparison": {
      "similarity": 68,        // 相似度百分比
      "compatibility": "中等",  // 兼容性评级
      "differences": [
        {
          "dimension": "modern",
          "userA": 62,
          "userB": 89,
          "difference": 27,
          "description": "在现代感偏好上差异较大"
        }
      ],
      "commonalities": [
        {
          "dimension": "elegant",
          "similarity": 95,
          "description": "都偏爱优雅的风格"
        }
      ],
      "summary": "你们在经典审美上很相似，但对现代元素的接受度不同...",
      "advice": "可以在经典设计领域多交流，现代艺术方面可以互相启发"
    }
  }
}
```

### 3.4 生成AI理想型

```http
POST /api/analysis/generate-ideal
```

**请求参数**:

```typescript
{
  resultId: string          // 分析结果ID
  type: 'avatar' | 'style' | 'scene'  // 生成类型
  style?: 'realistic' | 'anime' | 'artistic'  // 风格选择
  gender?: 'male' | 'female' | 'neutral'      // 性别偏好
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "taskId": "generation-task-uuid",
    "status": "processing",
    "estimatedTime": 30, // 预计用时（秒）
    "progressUrl": "/api/analysis/generate-status/generation-task-uuid"
  },
  "message": "AI生成任务已开始"
}
```

### 3.5 获取AI生成状态

```http
GET /api/analysis/generate-status/:taskId
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "taskId": "generation-task-uuid",
    "status": "completed", // processing | completed | failed
    "progress": 100,
    "result": {
      "imageUrl": "https://cdn.example.com/generated-avatar.jpg",
      "description": "基于你的审美偏好生成的理想形象",
      "tags": ["温暖", "经典", "优雅"]
    }
  }
}
```

---

## 🏠 4. 房间系统 API

### 4.1 创建对比房间

```http
POST /api/rooms/create
```

**请求参数**:

```typescript
{
  title?: string           // 房间标题，默认自动生成
  description?: string     // 房间描述
  type: 'comparison' | 'group_test'  // 房间类型
  maxParticipants?: number // 最大参与人数，默认8
  duration?: number        // 房间有效期（小时），默认24
  isPrivate?: boolean      // 是否私密房间
  password?: string        // 房间密码（私密房间必需）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "room": {
      "id": "room-uuid-xxx",
      "code": "ABC123", // 6位房间码
      "title": "小美的审美对比房间",
      "description": "",
      "type": "comparison",
      "creatorId": "user-uuid-xxx",
      "maxParticipants": 8,
      "currentParticipants": 1,
      "status": "active",
      "isPrivate": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-01-02T00:00:00Z"
    },
    "shareUrl": "https://aesthetimatch.com/room/ABC123",
    "qrCode": "https://cdn.example.com/qr/ABC123.png"
  },
  "message": "房间创建成功"
}
```

### 4.2 加入房间

```http
POST /api/rooms/:roomCode/join
```

**请求参数**:

```typescript
{
  nickname?: string    // 昵称（游客模式）
  password?: string    // 房间密码（私密房间需要）
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "room": {
      "id": "room-uuid-xxx",
      "code": "ABC123",
      "title": "小美的审美对比房间",
      "type": "comparison",
      "creator": {
        "id": "creator-id",
        "nickname": "小美",
        "avatar": "https://cdn.example.com/avatar.jpg",
        "aestheticType": "温暖经典型"
      },
      "participants": [
        {
          "id": "user-id-1",
          "nickname": "小美",
          "avatar": "https://cdn.example.com/avatar1.jpg",
          "role": "creator",
          "joinedAt": "2024-01-01T00:00:00Z"
        },
        {
          "id": "user-id-2",
          "nickname": "小李",
          "avatar": "https://cdn.example.com/avatar2.jpg",
          "role": "participant",
          "joinedAt": "2024-01-01T00:05:00Z"
        }
      ],
      "status": "active"
    },
    "userRole": "participant",
    "needsTest": true // 是否需要先完成测试
  },
  "message": "成功加入房间"
}
```

**错误码**:

- `ROOM_NOT_FOUND`: 房间不存在或已过期
- `ROOM_FULL`: 房间人数已满
- `WRONG_PASSWORD`: 房间密码错误
- `ROOM_EXPIRED`: 房间已过期

### 4.3 获取房间信息

```http
GET /api/rooms/:roomCode
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "room": {
      "id": "room-uuid-xxx",
      "code": "ABC123",
      "title": "小美的审美对比房间",
      "description": "",
      "type": "comparison",
      "creator": {
        "nickname": "小美",
        "avatar": "https://cdn.example.com/avatar.jpg",
        "aestheticType": "温暖经典型"
      },
      "currentParticipants": 3,
      "maxParticipants": 8,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-01-02T00:00:00Z"
    },
    "canJoin": true,
    "needsPassword": false,
    "preview": {
      "creatorAestheticType": "温暖经典型",
      "participantCount": 3,
      "recentActivity": "5分钟前有新成员加入"
    }
  }
}
```

### 4.4 获取房间对比结果

```http
GET /api/rooms/:roomCode/results
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "room": {...},
    "results": [
      {
        "participant": {
          "id": "user-id-1",
          "nickname": "小美",
          "avatar": "https://cdn.example.com/avatar1.jpg"
        },
        "aestheticType": "温暖经典型",
        "scores": {...},
        "completedAt": "2024-01-01T00:10:00Z"
      }
    ],
    "groupAnalysis": {
      "averageScores": {
        "classic": 75,
        "modern": 65,
        // ...
      },
      "dominantType": "温暖经典型",
      "diversity": 0.65,        // 群体多样性指数
      "insights": [
        "群体整体偏爱经典风格",
        "在现代感接受度上差异较大"
      ]
    },
    "pairwiseComparisons": [
      {
        "userA": "user-id-1",
        "userB": "user-id-2",
        "similarity": 78
      }
    ]
  }
}
```

### 4.5 房间实时状态

```http
WebSocket: /api/rooms/:roomCode/ws
```

**连接参数**:

```
Authorization: Bearer <token>
```

**消息格式**:

```typescript
// 用户加入
{
  type: 'user_joined',
  data: {
    user: {
      id: string,
      nickname: string,
      avatar: string
    },
    participantCount: number
  }
}

// 用户完成测试
{
  type: 'test_completed',
  data: {
    userId: string,
    aestheticType: string,
    participantCount: number
  }
}

// 房间状态更新
{
  type: 'room_status',
  data: {
    status: 'active' | 'completed' | 'expired',
    participantCount: number,
    completedCount: number
  }
}
```

---

## 👤 5. 用户管理 API

### 5.1 获取用户信息

```http
GET /api/users/profile
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-xxx",
      "phone": "138****8000",
      "nickname": "小美",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "bio": "喜欢一切美好的事物",
      "gender": "female",
      "birthday": "1995-06-15",
      "location": "北京",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "stats": {
      "testCount": 5, // 测试次数
      "roomsCreated": 3, // 创建房间数
      "roomsJoined": 8, // 参与房间数
      "friendsCount": 12, // 好友数量
      "shareCount": 15, // 分享次数
      "totalPoints": 280 // 积分总数
    },
    "preferences": {
      "language": "zh-CN",
      "theme": "light",
      "notifications": {
        "roomInvite": true,
        "testResult": true,
        "friendActivity": false
      }
    },
    "membership": {
      "type": "premium", // free | premium | pro
      "expiresAt": "2024-12-31T23:59:59Z",
      "features": ["unlimited_tests", "ai_generation", "advanced_analysis"]
    }
  }
}
```

### 5.2 更新用户信息

```http
PUT /api/users/profile
```

**请求参数**:

```typescript
{
  nickname?: string
  bio?: string
  avatar?: string      // 头像URL
  gender?: 'male' | 'female' | 'other'
  birthday?: string    // YYYY-MM-DD
  location?: string
}
```

### 5.3 上传头像

```http
POST /api/users/avatar
Content-Type: multipart/form-data
```

**请求参数**:

```
avatar: File    // 图片文件，支持jpg、png，最大5MB
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.example.com/avatars/user-uuid-xxx.jpg",
    "thumbnailUrl": "https://cdn.example.com/avatars/thumbnails/user-uuid-xxx.jpg"
  },
  "message": "头像上传成功"
}
```

### 5.4 获取用户成就

```http
GET /api/users/achievements
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first_test",
        "name": "初次体验",
        "description": "完成第一次审美测试",
        "icon": "https://cdn.example.com/icons/first_test.png",
        "unlockedAt": "2024-01-01T00:15:00Z",
        "rarity": "common"
      },
      {
        "id": "social_butterfly",
        "name": "社交达人",
        "description": "邀请10个朋友完成测试",
        "icon": "https://cdn.example.com/icons/social.png",
        "unlockedAt": "2024-01-05T10:30:00Z",
        "rarity": "rare"
      }
    ],
    "progress": [
      {
        "id": "test_master",
        "name": "测试专家",
        "description": "完成50次测试",
        "icon": "https://cdn.example.com/icons/test_master.png",
        "current": 12,
        "target": 50,
        "percentage": 24,
        "rarity": "epic"
      }
    ],
    "totalUnlocked": 15,
    "totalAchievements": 32
  }
}
```

### 5.5 好友系统

```http
GET /api/users/friends
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "id": "friend-uuid-1",
        "nickname": "小李",
        "avatar": "https://cdn.example.com/avatar2.jpg",
        "aestheticType": "现代前卫型",
        "similarity": 72,
        "lastActive": "2024-01-01T12:00:00Z",
        "relationship": "friend"
      }
    ],
    "pendingRequests": [
      {
        "id": "request-uuid-1",
        "from": {
          "id": "user-uuid-2",
          "nickname": "小王",
          "avatar": "https://cdn.example.com/avatar3.jpg"
        },
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 12
  }
}
```

---

## 📤 6. 分享系统 API

### 6.1 生成分享海报

```http
POST /api/share/poster
```

**请求参数**:

```typescript
{
  type: 'result' | 'comparison' | 'room'  // 分享类型
  targetId: string                        // 目标ID（结果ID/房间ID等）
  template?: string                       // 模板样式
  customText?: string                     // 自定义文案
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "posterId": "poster-uuid-xxx",
    "imageUrl": "https://cdn.example.com/posters/poster-uuid-xxx.jpg",
    "shareText": "我是温暖经典型，你呢？快来测测你的审美DNA！",
    "shareUrl": "https://aesthetimatch.com/share/poster-uuid-xxx",
    "qrCode": "https://cdn.example.com/qr/poster-uuid-xxx.png"
  },
  "message": "分享海报生成成功"
}
```

### 6.2 获取分享统计

```http
GET /api/share/stats
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "totalShares": 25,
    "platforms": {
      "wechat": 15,
      "weibo": 8,
      "qq": 2
    },
    "clickThrough": 78, // 分享链接点击数
    "conversions": 12, // 转化用户数
    "recentShares": [
      {
        "id": "share-uuid-1",
        "type": "result",
        "platform": "wechat",
        "clicks": 5,
        "conversions": 2,
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### 6.3 分享追踪

```http
POST /api/share/track
```

**请求参数**:

```typescript
{
  shareId: string          // 分享ID
  event: 'click' | 'view' | 'conversion'  // 事件类型
  platform?: string       // 平台来源
  userAgent?: string       // 用户代理
  referrer?: string        // 来源页面
}
```

---

## 💳 7. 会员系统 API

### 7.1 获取会员套餐

```http
GET /api/membership/plans
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "premium_monthly",
        "name": "高级会员",
        "type": "premium",
        "duration": "monthly",
        "price": 990, // 价格（分）
        "originalPrice": 1990, // 原价
        "features": [
          "无限次测试",
          "AI理想型生成",
          "详细分析报告",
          "无广告体验",
          "优先客服支持"
        ],
        "badge": "最受欢迎"
      },
      {
        "id": "pro_monthly",
        "name": "专业会员",
        "type": "pro",
        "duration": "monthly",
        "price": 2990,
        "features": [
          "高级会员所有功能",
          "专家审美咨询",
          "趋势数据报告",
          "定制化分析",
          "企业合作优先权"
        ]
      }
    ],
    "currentPlan": {
      "type": "free",
      "expiresAt": null,
      "features": ["每日3次测试", "基础分析报告", "房间功能", "广告展示"]
    }
  }
}
```

### 7.2 创建支付订单

```http
POST /api/membership/orders
```

**请求参数**:

```typescript
{
  planId: string          // 套餐ID
  paymentMethod: 'wechat' | 'alipay'  // 支付方式
  promoCode?: string      // 优惠码
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "orderId": "order-uuid-xxx",
    "amount": 990,
    "paymentParams": {
      "appId": "wx123456789",
      "timeStamp": "1609459200",
      "nonceStr": "abc123",
      "package": "prepay_id=wx123456789",
      "signType": "RSA",
      "paySign": "signature"
    },
    "qrCode": "https://cdn.example.com/qr/order-uuid-xxx.png"
  },
  "message": "订单创建成功"
}
```

### 7.3 订单状态查询

```http
GET /api/membership/orders/:orderId
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order-uuid-xxx",
      "planId": "premium_monthly",
      "status": "paid", // pending | paid | failed | cancelled
      "amount": 990,
      "paymentMethod": "wechat",
      "createdAt": "2024-01-01T10:00:00Z",
      "paidAt": "2024-01-01T10:05:00Z"
    },
    "membership": {
      "type": "premium",
      "expiresAt": "2024-02-01T10:05:00Z",
      "autoRenew": true
    }
  }
}
```

---

## 📊 8. 数据统计 API

### 8.1 获取平台统计数据

```http
GET /api/stats/platform
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 12580,
      "activeUsers": 3240,
      "totalTests": 45230,
      "totalRooms": 8960
    },
    "trends": {
      "userGrowth": [
        { "date": "2024-01-01", "count": 1200 },
        { "date": "2024-01-02", "count": 1350 }
      ],
      "testActivity": [
        { "date": "2024-01-01", "count": 850 },
        { "date": "2024-01-02", "count": 920 }
      ]
    },
    "aestheticTypes": {
      "warm_classic": 2850,
      "modern_elegant": 2340,
      "natural_fresh": 1980
      // ...
    }
  }
}
```

### 8.2 获取个人数据洞察

```http
GET /api/stats/personal
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "testHistory": {
      "total": 12,
      "thisMonth": 5,
      "averageTime": 340,     // 平均用时（秒）
      "consistency": 0.85     // 选择一致性
    },
    "socialActivity": {
      "roomsCreated": 3,
      "roomsJoined": 8,
      "friendsInfluenced": 12,
      "shareCount": 15
    },
    "aestheticEvolution": [
      {
        "date": "2024-01-01",
        "type": "温暖经典型",
        "scores": {...}
      }
    ],
    "insights": [
      "你的审美偏好非常稳定",
      "在社交传播方面很活跃",
      "朋友们都很认同你的审美观"
    ]
  }
}
```

---

## 🔍 9. 搜索和发现 API

### 9.1 搜索用户

```http
GET /api/search/users
```

**请求参数**:

```typescript
{
  q: string              // 搜索关键词
  type?: 'nickname' | 'phone' | 'aestheticType'  // 搜索类型
  limit?: number         // 结果数量限制
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-uuid-1",
        "nickname": "小美",
        "avatar": "https://cdn.example.com/avatar1.jpg",
        "aestheticType": "温暖经典型",
        "similarity": 82, // 与当前用户相似度
        "mutualFriends": 3 // 共同好友数
      }
    ],
    "total": 15
  }
}
```

### 9.2 发现相似用户

```http
GET /api/discover/similar
```

**请求参数**:

```typescript
{
  minSimilarity?: number  // 最小相似度，默认70
  limit?: number         // 结果数量，默认20
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "user": {
          "id": "user-uuid-2",
          "nickname": "小李",
          "avatar": "https://cdn.example.com/avatar2.jpg",
          "aestheticType": "温暖经典型"
        },
        "similarity": 85,
        "commonTraits": ["偏爱温暖色调", "喜欢经典设计"],
        "reason": "你们在审美偏好上高度相似"
      }
    ],
    "total": 8
  }
}
```

---

## ⚙️ 10. 系统管理 API

### 10.1 健康检查

```http
GET /api/health
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0",
    "uptime": 86400,
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "ai_service": "healthy",
      "file_storage": "healthy"
    }
  }
}
```

### 10.2 系统配置

```http
GET /api/config
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "features": {
      "ai_generation": true,
      "real_time_rooms": true,
      "membership": true
    },
    "limits": {
      "free_tests_per_day": 3,
      "max_room_participants": 8,
      "max_file_size": 5242880
    },
    "maintenance": {
      "scheduled": false,
      "message": ""
    }
  }
}
```

---

## 🚨 错误码说明

### 通用错误码

- `INVALID_REQUEST`: 请求参数错误
- `UNAUTHORIZED`: 未认证或认证失败
- `FORBIDDEN`: 权限不足
- `NOT_FOUND`: 资源不存在
- `RATE_LIMIT_EXCEEDED`: 请求频率超限
- `INTERNAL_SERVER_ERROR`: 服务器内部错误

### 认证相关错误码

- `PHONE_ALREADY_EXISTS`: 手机号已存在
- `INVALID_CODE`: 验证码错误或过期
- `TOKEN_EXPIRED`: 访问令牌过期
- `REFRESH_TOKEN_INVALID`: 刷新令牌无效

### 测试相关错误码

- `TEST_SESSION_EXPIRED`: 测试会话已过期
- `INVALID_ANSWER`: 答案格式错误
- `TEST_ALREADY_COMPLETED`: 测试已完成
- `INSUFFICIENT_ANSWERS`: 答案数量不足

### 房间相关错误码

- `ROOM_NOT_FOUND`: 房间不存在或已过期
- `ROOM_FULL`: 房间人数已满
- `WRONG_PASSWORD`: 房间密码错误
- `ROOM_EXPIRED`: 房间已过期

### 会员相关错误码

- `PLAN_NOT_FOUND`: 套餐不存在
- `PAYMENT_FAILED`: 支付失败
- `ORDER_EXPIRED`: 订单已过期
- `INSUFFICIENT_BALANCE`: 余额不足

---

## 📱 客户端集成示例

### JavaScript/TypeScript

```typescript
class AesthetiMatchAPI {
  private baseURL = "https://api.aesthetimatch.com";
  private token: string | null = null;

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  }

  // 认证相关
  async login(phone: string, code: string) {
    const data = await this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    });
    this.token = data.data.token;
    return data;
  }

  // 测试相关
  async getQuestions(params?: GetQuestionsParams) {
    return this.request<QuestionsResponse>("/api/test/questions", {
      method: "GET",
    });
  }

  async submitAnswer(answer: AnswerData) {
    return this.request<AnswerResponse>("/api/test/answer", {
      method: "POST",
      body: JSON.stringify(answer),
    });
  }

  // 房间相关
  async createRoom(roomData: CreateRoomData) {
    return this.request<CreateRoomResponse>("/api/rooms/create", {
      method: "POST",
      body: JSON.stringify(roomData),
    });
  }
}

// 使用示例
const api = new AesthetiMatchAPI();

// 登录
await api.login("13800138000", "123456");

// 获取题目
const questions = await api.getQuestions({ limit: 20 });

// 创建房间
const room = await api.createRoom({
  title: "我的审美测试房间",
  type: "comparison",
});
```

---

## 📋 版本更新记录

### v1.0.0 (2024-01-01)

- 初版API设计
- 完整的认证和测试系统
- 房间对比功能
- 基础用户管理
- 分享系统设计

### 后续版本规划

- v1.1.0: AI生成功能完善
- v1.2.0: 实时通信优化
- v1.3.0: 会员系统增强
- v2.0.0: 企业服务API

---

这个API设计文档涵盖了AesthetiMatch项目的所有核心功能，为前端开发和第三方集成提供了完整的接口规范。所有接口都经过精心设计，确保安全性、可扩展性和易用性。
