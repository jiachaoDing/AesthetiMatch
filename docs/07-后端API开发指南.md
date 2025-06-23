# 🛠️ 后端API开发指南

## 📋 API设计原则

### RESTful API规范
```
GET    /api/test/questions      # 获取测试题目
POST   /api/test/submit         # 提交测试答案
GET    /api/analysis/result/:id # 获取分析结果  
POST   /api/analysis/compare    # 对比分析
POST   /api/rooms/create        # 创建房间
POST   /api/rooms/:id/join      # 加入房间
GET    /api/rooms/:id           # 获取房间信息
```

### 响应格式标准
```javascript
// 成功响应
{
  "success": true,
  "data": { /* 实际数据 */ },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

---

## 🗂️ 路由文件结构

### 1. 测试相关API
```javascript
// backend/src/routes/test.js
const express = require('express')
const router = express.Router()

// 获取测试题目
router.get('/questions', async (req, res) => {
  try {
    const { category = 'all', limit = 20 } = req.query
    
    // 模拟题目数据（后续从数据库获取）
    const questions = generateQuestions(category, limit)
    
    res.json({
      success: true,
      data: questions,
      total: questions.length
    })
  } catch (error) {
    console.error('获取题目失败:', error)
    res.status(500).json({
      success: false,
      error: '获取题目失败',
      code: 'QUESTIONS_FETCH_ERROR'
    })
  }
})

// 提交测试结果
router.post('/submit', async (req, res) => {
  try {
    const { answers, userId } = req.body
    
    // 数据验证
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: '答案数据格式错误',
        code: 'INVALID_ANSWERS'
      })
    }
    
    // 计算分析结果
    const analysisResult = await calculateAestheticAnalysis(answers)
    
    // 保存到数据库（使用Supabase）
    const savedResult = await saveTestResult(userId, answers, analysisResult)
    
    res.json({
      success: true,
      data: savedResult,
      message: '测试提交成功'
    })
  } catch (error) {
    console.error('提交测试失败:', error)
    res.status(500).json({
      success: false,
      error: '提交测试失败',
      code: 'TEST_SUBMIT_ERROR'
    })
  }
})

// 生成测试题目
function generateQuestions(category, limit) {
  const baseQuestions = [
    {
      id: 1,
      type: 'beauty',
      question: '你觉得哪个更有魅力？',
      imageA: 'https://picsum.photos/300/400?random=1',
      imageB: 'https://picsum.photos/300/400?random=2',
      category: 'portrait'
    },
    {
      id: 2,
      type: 'style',
      question: '选择你更喜欢的风格',
      imageA: 'https://picsum.photos/300/400?random=3',
      imageB: 'https://picsum.photos/300/400?random=4',
      category: 'lifestyle'
    },
    // ... 更多题目
  ]
  
  return baseQuestions.slice(0, limit)
}

module.exports = router
```

### 2. 分析相关API
```javascript
// backend/src/routes/analysis.js
const express = require('express')
const router = express.Router()

// 获取分析结果
router.get('/result/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 从数据库获取结果
    const result = await getAnalysisResult(id)
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: '分析结果不存在',
        code: 'RESULT_NOT_FOUND'
      })
    }
    
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('获取分析结果失败:', error)
    res.status(500).json({
      success: false,
      error: '获取分析结果失败',
      code: 'RESULT_FETCH_ERROR'
    })
  }
})

// 用户对比分析
router.post('/compare', async (req, res) => {
  try {
    const { userAId, userBId } = req.body
    
    // 获取两个用户的分析结果
    const [userA, userB] = await Promise.all([
      getAnalysisResult(userAId),
      getAnalysisResult(userBId)
    ])
    
    if (!userA || !userB) {
      return res.status(400).json({
        success: false,
        error: '用户分析结果不完整',
        code: 'INCOMPLETE_RESULTS'
      })
    }
    
    // 计算相似度和差异
    const comparison = calculateSimilarity(userA, userB)
    
    res.json({
      success: true,
      data: comparison
    })
  } catch (error) {
    console.error('对比分析失败:', error)
    res.status(500).json({
      success: false,
      error: '对比分析失败',
      code: 'COMPARISON_ERROR'
    })
  }
})

module.exports = router
```

### 3. 房间相关API
```javascript
// backend/src/routes/rooms.js
const express = require('express')
const router = express.Router()

// 内存存储（生产环境应使用数据库）
const rooms = new Map()

// 创建房间
router.post('/create', async (req, res) => {
  try {
    const { title, creatorId, description } = req.body
    
    const roomId = generateRoomId()
    const room = {
      id: roomId,
      title: title || '审美对比房间',
      description: description || '',
      creatorId,
      participants: [creatorId],
      results: new Map(),
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24小时后过期
    }
    
    rooms.set(roomId, room)
    
    res.json({
      success: true,
      data: {
        roomId,
        shareUrl: `${process.env.FRONTEND_URL}/room/${roomId}`,
        ...room
      },
      message: '房间创建成功'
    })
  } catch (error) {
    console.error('创建房间失败:', error)
    res.status(500).json({
      success: false,
      error: '创建房间失败',
      code: 'ROOM_CREATE_ERROR'
    })
  }
})

// 加入房间
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params
    const { userId, nickname } = req.body
    
    const room = rooms.get(id)
    if (!room) {
      return res.status(404).json({
        success: false,
        error: '房间不存在或已过期',
        code: 'ROOM_NOT_FOUND'
      })
    }
    
    // 检查房间是否过期
    if (new Date() > new Date(room.expiresAt)) {
      rooms.delete(id)
      return res.status(410).json({
        success: false,
        error: '房间已过期',
        code: 'ROOM_EXPIRED'
      })
    }
    
    // 添加参与者
    if (!room.participants.includes(userId)) {
      room.participants.push(userId)
    }
    
    res.json({
      success: true,
      data: room,
      message: '成功加入房间'
    })
  } catch (error) {
    console.error('加入房间失败:', error)
    res.status(500).json({
      success: false,
      error: '加入房间失败',
      code: 'ROOM_JOIN_ERROR'
    })
  }
})

// 获取房间信息
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const room = rooms.get(id)
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: '房间不存在',
        code: 'ROOM_NOT_FOUND'
      })
    }
    
    res.json({
      success: true,
      data: room
    })
  } catch (error) {
    console.error('获取房间信息失败:', error)
    res.status(500).json({
      success: false,
      error: '获取房间信息失败',
      code: 'ROOM_FETCH_ERROR'
    })
  }
})

// 生成房间ID
function generateRoomId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

module.exports = router
```

---

## 🧮 核心算法实现

### 审美分析算法
```javascript
// backend/src/services/analysisService.js

// 六维审美分析
async function calculateAestheticAnalysis(answers) {
  const scores = {
    classic: 0,    // 经典度
    modern: 0,     // 现代度  
    elegant: 0,    // 优雅度
    natural: 0,    // 自然度
    warm: 0,       // 温暖度
    mysterious: 0  // 神秘度
  }
  
  // 根据答案计算各维度得分
  answers.forEach(answer => {
    const questionType = getQuestionType(answer.questionId)
    const choice = answer.answer // 'A' or 'B'
    
    // 基于问题类型和选择更新得分
    updateScores(scores, questionType, choice)
  })
  
  // 归一化得分 (0-100)
  Object.keys(scores).forEach(key => {
    scores[key] = Math.round((scores[key] / answers.length) * 100)
  })
  
  // 确定审美类型
  const aestheticType = determineAestheticType(scores)
  
  // 生成个性化描述
  const description = generateDescription(scores, aestheticType)
  const traits = extractTraits(scores)
  
  return {
    id: generateAnalysisId(),
    scores,
    type: aestheticType,
    description,
    traits,
    confidence: calculateConfidence(answers),
    createdAt: new Date().toISOString()
  }
}

// 更新得分逻辑
function updateScores(scores, questionType, choice) {
  const scoreMap = {
    'portrait_classic': { A: { classic: 2, elegant: 1 }, B: { modern: 2, natural: 1 } },
    'lifestyle_warm': { A: { warm: 2, natural: 1 }, B: { mysterious: 2, elegant: 1 } },
    'color_preference': { A: { warm: 1, natural: 1 }, B: { cool: 1, modern: 1 } },
    // ... 更多映射规则
  }
  
  const questionScores = scoreMap[questionType]
  if (questionScores && questionScores[choice]) {
    Object.entries(questionScores[choice]).forEach(([dimension, points]) => {
      if (scores.hasOwnProperty(dimension)) {
        scores[dimension] += points
      }
    })
  }
}

// 确定审美类型
function determineAestheticType(scores) {
  const maxScore = Math.max(...Object.values(scores))
  const dominantDimensions = Object.entries(scores)
    .filter(([_, score]) => score >= maxScore - 10)
    .map(([dimension, _]) => dimension)
  
  // 组合逻辑确定类型
  if (dominantDimensions.includes('warm') && dominantDimensions.includes('classic')) {
    return 'warm_classic'
  } else if (dominantDimensions.includes('modern') && dominantDimensions.includes('elegant')) {
    return 'modern_elegant'
  } else if (dominantDimensions.includes('natural') && dominantDimensions.includes('warm')) {
    return 'natural_warm'
  }
  // ... 更多类型判断
  
  return 'balanced_type'
}

// 相似度计算
function calculateSimilarity(userA, userB) {
  const scoresA = Object.values(userA.scores)
  const scoresB = Object.values(userB.scores)
  
  // 欧几里得距离计算
  const distance = Math.sqrt(
    scoresA.reduce((sum, scoreA, index) => {
      const diff = scoreA - scoresB[index]
      return sum + diff * diff
    }, 0)
  )
  
  // 转换为相似度百分比 (0-100)
  const maxDistance = Math.sqrt(6 * 100 * 100) // 最大可能距离
  const similarity = Math.round((1 - distance / maxDistance) * 100)
  
  // 分析差异
  const differences = Object.keys(userA.scores).map(dimension => ({
    dimension,
    userA: userA.scores[dimension],
    userB: userB.scores[dimension],
    difference: Math.abs(userA.scores[dimension] - userB.scores[dimension])
  })).sort((a, b) => b.difference - a.difference)
  
  // 生成对比描述
  const summary = generateComparisonSummary(similarity, differences)
  
  return {
    similarity,
    differences: differences.slice(0, 3), // 只返回差异最大的3个维度
    summary,
    compatibility: calculateCompatibility(userA.type, userB.type)
  }
}

module.exports = {
  calculateAestheticAnalysis,
  calculateSimilarity
}
```

---

## 🔧 中间件配置

### 错误处理中间件
```javascript
// backend/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('API错误:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  })
  
  // 根据错误类型返回不同响应
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: '数据验证失败',
      details: err.details,
      code: 'VALIDATION_ERROR'
    })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: '未授权访问',
      code: 'UNAUTHORIZED'
    })
  }
  
  // 默认服务器错误
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    code: 'INTERNAL_SERVER_ERROR'
  })
}

module.exports = errorHandler
```

### 请求验证中间件
```javascript
// backend/src/middleware/validation.js
const { body, validationResult } = require('express-validator')

// 测试提交验证
const validateTestSubmission = [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('答案必须是非空数组'),
  body('answers.*.questionId')
    .isInt({ min: 1 })
    .withMessage('题目ID必须是正整数'),
  body('answers.*.answer')
    .isIn(['A', 'B'])
    .withMessage('答案必须是A或B'),
  
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '请求数据验证失败',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      })
    }
    next()
  }
]

// 房间创建验证
const validateRoomCreation = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('房间标题长度必须在1-100字符之间'),
  body('creatorId')
    .notEmpty()
    .withMessage('创建者ID不能为空'),
  
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '房间创建数据验证失败',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      })
    }
    next()
  }
]

module.exports = {
  validateTestSubmission,
  validateRoomCreation
}
```

---

## 📡 Supabase集成

### 数据库操作
```javascript
// backend/src/config/supabase.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// 保存测试结果
async function saveTestResult(userId, answers, analysisResult) {
  const { data, error } = await supabase
    .from('test_results')
    .insert({
      user_id: userId,
      answers: answers,
      scores: analysisResult.scores,
      aesthetic_type: analysisResult.type,
      description: analysisResult.description,
      traits: analysisResult.traits,
      confidence: analysisResult.confidence
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`保存测试结果失败: ${error.message}`)
  }
  
  return data
}

// 获取分析结果
async function getAnalysisResult(resultId) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('id', resultId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // 记录不存在
    }
    throw new Error(`获取分析结果失败: ${error.message}`)
  }
  
  return data
}

module.exports = {
  supabase,
  saveTestResult,
  getAnalysisResult
}
```

---

## 🧪 API测试

### 使用curl测试
```bash
# 测试健康检查
curl http://localhost:3001/health

# 获取测试题目
curl http://localhost:3001/api/test/questions

# 提交测试结果
curl -X POST http://localhost:3001/api/test/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "answer": "A"},
      {"questionId": 2, "answer": "B"}
    ],
    "userId": "test-user-123"
  }'

# 创建房间
curl -X POST http://localhost:3001/api/rooms/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的审美测试房间",
    "creatorId": "user-123"
  }'
```

### 使用Postman集合
可以创建Postman集合包含所有API端点，便于开发测试。

---

## 📈 性能优化

### 缓存策略
```javascript
// 简单内存缓存（生产环境建议使用Redis）
const cache = new Map()

function cacheMiddleware(duration = 300) {
  return (req, res, next) => {
    const key = req.originalUrl
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      return res.json(cached.data)
    }
    
    const originalSend = res.json
    res.json = function(data) {
      cache.set(key, { data, timestamp: Date.now() })
      originalSend.call(this, data)
    }
    
    next()
  }
}

// 使用缓存
router.get('/questions', cacheMiddleware(600), getQuestions) // 缓存10分钟
```

### 请求限制
```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100次请求
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试',
    code: 'RATE_LIMIT_EXCEEDED'
  }
})

app.use('/api', limiter)
```

这个后端API开发指南提供了完整的实现方案，可以支撑前端的所有功能需求。 