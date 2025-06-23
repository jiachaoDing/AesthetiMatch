<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <h1 class="text-xl font-bold text-pink-600">AesthetiMatch</h1>
        <nav class="space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-pink-600">首页</router-link>
          <router-link to="/about" class="text-gray-600 hover:text-pink-600">关于</router-link>
        </nav>
      </div>
    </header>
    
    <main><RouterView /></main>
    
    <footer class="bg-white border-t mt-12 py-6 text-center text-gray-500">
      <p>&copy; 2024 AesthetiMatch. Made with ❤️</p>
    </footer>
  </div>
</template>

<style>
@import './assets/main.css';
</style>