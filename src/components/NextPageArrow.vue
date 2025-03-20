<template>
  <div class="next-page-container" @click="navigateToNextPage">
    <button class="next-page-button">Next Page</button>
    <div class="next-page-text">{{ nextPageName }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  nextRoute: string
  nextPageName: string
}>()

const router = useRouter()

const navigateToNextPage = () => {
  router.push(props.nextRoute)
}
</script>

<style scoped>
.next-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
  cursor: pointer;
}

.next-page-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-page-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #1e88e5, #1976d2);
}

.next-page-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.next-page-text {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}
</style>
