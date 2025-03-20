<script setup lang="ts">
// Removed NavMenu import
</script>

<template>
  <div class="app">
    <!-- Removed NavMenu component, keeping only router view -->
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
