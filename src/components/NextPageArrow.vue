<template>
  <div class="next-page-button" @click="navigateToNextPage">Next Page: {{ nextPageName }}</div>
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
.next-page-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto 20px;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 300px;
}

.next-page-button:hover {
  background: #0069d9;
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
