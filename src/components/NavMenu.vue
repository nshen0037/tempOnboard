<template>
  <div class="nav-menu">
    <button @click="toggleMenu" class="menu-toggle">
      <span class="menu-icon" :class="{ open: isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <div class="menu-dropdown" :class="{ open: isOpen }">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        @click="closeMenu"
      >
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Cancer Chart', path: '/cancer-chart' },
  { name: 'UV Indicator', path: '/uv-indicator' },
  { name: 'Recommendation', path: '/recommendation' },
  { name: 'Set Reminders', path: '/reminder' },
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<style scoped>
.nav-menu {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.menu-toggle {
  width: 50px;
  height: 50px;
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.menu-toggle:hover {
  transform: scale(1.05);
}

.menu-icon {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-icon span {
  display: block;
  height: 3px;
  width: 100%;
  background: #333;
  border-radius: 3px;
  transition: all 0.3s;
}

.menu-icon.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
}

.menu-icon.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

.menu-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
}

.menu-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.router-link-active {
  color: #007bff;
  font-weight: 600;
  background: rgba(0, 123, 255, 0.1);
}
</style>
