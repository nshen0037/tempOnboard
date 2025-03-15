<template>
  <div class="page-container">
    <div class="top-nav">
      <div class="nav-title">Sunscreen Guide</div>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">
          <i class="fas fa-umbrella-beach"></i> Sun Protector
        </router-link>
        <router-link to="/cancer-chart" class="nav-button">
          <i class="fas fa-chart-bar"></i> Cancer Chart
        </router-link>
        <router-link to="/uv-indicator" class="nav-button">
          <i class="fas fa-sun"></i> UV Indicator
        </router-link>
        <router-link to="/recommendation" class="nav-button active">
          <i class="fas fa-lightbulb"></i> Recommendation
        </router-link>
        <router-link to="/reminder" class="nav-button">
          <i class="fas fa-bell"></i> Set Reminders
        </router-link>
      </div>
    </div>

    <div class="content">
      <div class="recommendation-section">
        <h2><i class="fas fa-lightbulb icon-title"></i> Recommendation</h2>
        <div class="sub-description">
          <p>💡 Select your skin type to get recommended sunscreen and sun-protective clothing.</p>
        </div>

        <div class="main-content-box">
          <!-- 皮肤类型选择 -->
          <div class="skin-tone-section">
            <label for="skinTone"><i class="fas fa-palette"></i> Skin Tone:</label>
            <select v-model="selectedSkinTone" id="skinTone">
              <option value="dark-brown">Dark Brown</option>
              <option value="brown">Brown</option>
              <option value="light-brown">Light Brown</option>
              <option value="beige">Beige</option>
              <option value="fair">Fair</option>
            </select>
            <button @click="fetchRecommendation" class="go-btn">
              <i class="fas fa-search"></i> Go
            </button>
          </div>

          <!-- 推荐结果 -->
          <div v-if="loading" class="loading">
            <p><i class="fas fa-spinner fa-spin"></i> Loading recommendations...</p>
          </div>

          <div v-else-if="recommendation" class="recommendation-result">
            <i class="fas fa-sun recommendation-icon"></i>
            <p>{{ recommendation }}</p>
          </div>

          <div v-else-if="error" class="error-message">
            <p><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>
          </div>
        </div>
      </div>

      <NextPageArrow nextRoute="/reminder" nextPageName="Set Reminders" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NextPageArrow from '../components/NextPageArrow.vue'
import { getRecommendation } from '../api'
import { useStore } from '@/store/store'

const selectedSkinTone = ref('')
const recommendation = ref('')
const loading = ref(false)
const error = ref('')

// 将皮肤类型映射到数值
const skinTypeToNumber = (skinType: string): number => {
  switch (skinType) {
    case 'fair':
      return 1
    case 'beige':
      return 2
    case 'light-brown':
      return 3
    case 'brown':
      return 4
    case 'dark-brown':
      return 5
    default:
      return 3 // 默认中等肤色
  }
}

// 获取当前UV指数（模拟数据）
const getCurrentUVIndex = (): number => {
  // 这里可以根据实际情况获取当前UV指数
  // 在实际应用中，这可能来自另一个API调用或存储的数据
  return 8 // 假设当前UV指数为8（很高）
}

const fetchRecommendation = async () => {
  const store = useStore()
  if (!selectedSkinTone.value) {
    error.value = 'Please select a skin tone'
    return
  }
  if (!store.postcode) {
    error.value = 'Please set your postcode in the UV Indicator page first'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 获取皮肤类型数值和当前UV指数
    const skinType = skinTypeToNumber(selectedSkinTone.value)
    const uvIndex = getCurrentUVIndex()

    // 调用API获取推荐
    const response = await getRecommendation({
      postcode: store.postcode,
      skinTone: skinType,
    })

    // 处理响应
    if (response) {
      recommendation.value =
        response.recommendation ||
        `Based on your ${selectedSkinTone.value} skin and the current UV index of ${uvIndex},
        we recommend using SPF ${skinType <= 2 ? '50+' : skinType <= 4 ? '30+' : '15+'} sunscreen
        and wearing protective clothing when outdoors.`
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (err) {
    console.error('Error fetching recommendation:', err)
    error.value = 'Failed to get recommendations. Please try again.'

    // 使用模拟数据作为后备
    const skinType = skinTypeToNumber(selectedSkinTone.value)
    const uvIndex = getCurrentUVIndex()
    recommendation.value = `Based on your ${selectedSkinTone.value} skin and the current UV index of ${uvIndex},
      we recommend using SPF ${skinType <= 2 ? '50+' : skinType <= 4 ? '30+' : '15+'} sunscreen
      and wearing protective clothing when outdoors.`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(to bottom, #e0f7fa, #b2ebf2, #80deea);
  background-size: cover;
  background-position: center;
  padding: 0;
  margin: 0;
}

.top-nav {
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-button {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-button.active {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  padding: 30px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 5;
}

.recommendation-section {
  flex: 1;
  background: transparent;
  box-shadow: none;
  margin-bottom: 0;
  padding: 20px;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #1565c0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  position: relative;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.icon-title {
  color: #f39c12;
  margin-right: 10px;
  filter: drop-shadow(0 0 3px rgba(243, 156, 18, 0.4));
}

.sub-description {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #455a64;
  margin-bottom: 30px;
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.9);
  border-left: 5px solid #1976d2;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(25, 118, 210, 0.15);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sub-description::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: -1;
}

.sub-description:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.2);
}

.main-content-box {
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(200, 200, 200, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.main-content-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.main-content-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.skin-tone-section {
  background-color: #e3f2fd;
  border-radius: 15px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  border-top: 4px solid #1976d2;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.skin-tone-section label {
  display: block;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1565c0;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.skin-tone-section select {
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid #bbdefb;
  border-radius: 8px;
  margin-right: 15px;
  background-color: white;
  color: #455a64;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  width: 200px;
}

.skin-tone-section select:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  outline: none;
}

.go-btn {
  padding: 14px 30px;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(21, 101, 192, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.go-btn:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(21, 101, 192, 0.4);
}

.go-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(21, 101, 192, 0.4);
}

.loading {
  text-align: center;
  padding: 25px;
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.error-message {
  color: #d32f2f;
  background: linear-gradient(to right, #ffebee, #ffcdd2);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15);
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-5px);
  }
  40%,
  80% {
    transform: translateX(5px);
  }
}

.recommendation-result {
  background: linear-gradient(to right, #e8f5e9, #c8e6c9);
  padding: 25px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  border-left: 5px solid #4caf50;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recommendation-result::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 1;
  border-radius: 12px;
}

.recommendation-icon {
  font-size: 36px;
  color: #1976d2;
  margin-bottom: 15px;
  display: block;
  text-align: center;
  filter: drop-shadow(0 2px 5px rgba(25, 118, 210, 0.3));
}

.recommendation-result p {
  color: #2e7d32;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}
</style>
