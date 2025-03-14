<template>
  <div class="next-page-arrow" @click="navigateToNextPage">
    <div class="arrow-container">
      <span class="arrow-down"></span>
    </div>
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
.next-page-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.next-page-arrow:hover {
  transform: translateY(5px);
}

.arrow-container {
  width: 50px;
  height: 50px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

.arrow-down {
  width: 15px;
  height: 15px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
  margin-top: -5px;
}

.next-page-text {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}
</style>
