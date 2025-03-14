<script setup lang="ts">
// 移除NavMenu导入
</script>

<template>
  <div class="app">
    <!-- 移除NavMenu组件，只保留路由视图 -->
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  width: 100%;
}
</style>
