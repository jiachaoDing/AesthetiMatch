<!-- frontend/src/views/Home.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">发现你的审美DNA</h1>
      <p class="text-xl text-gray-600 mb-8">科学测试，了解独特品味，找到审美知音</p>
      
      <router-link 
        to="/test"
        class="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-pink-700 transition-colors"
      >
        开始测试
      </router-link>
      
      <div class="flex justify-center space-x-8 text-sm text-gray-500 mt-4">
        <span>⏱️ 仅需5分钟</span>
        <span>🎯 科学分析</span>
        <span>👥 好友对比</span>
      </div>
    </div>
    
    <!-- 系统状态检查 -->
    <div class="mt-12 p-4 bg-white rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">🔧 系统状态</h3>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full" :class="apiStatus ? 'bg-green-500' : 'bg-red-500'"></span>
        <span>后端API: {{ apiStatus ? '✅ 连接正常' : '❌ 连接失败' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const apiStatus = ref(false)
    
    const checkAPI = async () => {
      try {
        await axios.get('http://localhost:3001/health')
        apiStatus.value = true
      } catch (error) {
        console.error('API连接失败:', error)
        apiStatus.value = false
      }
    }
    
    onMounted(checkAPI)
    return { apiStatus }
  }
}
</script>