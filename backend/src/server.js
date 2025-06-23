// backend/src/server.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AesthetiMatch Backend 运行正常！',
    timestamp: new Date().toISOString() 
  })
})

// API路由 (暂时注释掉，将在后续开发中添加)
// app.use('/api/test', require('./routes/test'))

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`)
  console.log(`📊 健康检查: http://localhost:${PORT}/health`)
})