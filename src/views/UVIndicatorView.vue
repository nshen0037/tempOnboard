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
        <router-link to="/uv-indicator" class="nav-button active">
          <i class="fas fa-sun"></i> UV Indicator
        </router-link>
        <router-link to="/recommendation" class="nav-button">
          <i class="fas fa-lightbulb"></i> Recommendation
        </router-link>
        <router-link to="/reminder" class="nav-button">
          <i class="fas fa-bell"></i> Set Reminders
        </router-link>
      </div>
    </div>

    <div class="content">
      <div class="recommendation-section">
        <h2><i class="fas fa-sun icon-title"></i> UV Indicator</h2>
        <div class="sub-description">
          <p>
            💡 Enter your postcode to get UV index data for different times of the day in your area
          </p>
        </div>

        <div class="main-content-box">
          <div class="postcode-section">
            <label for="postcode">Post code:</label>
            <div class="input-container">
              <input
                type="text"
                v-model="postcode"
                id="postcode"
                placeholder="Enter Melbourne postcode (3000-3338)"
                @input="validatePostcode"
                maxlength="4"
                class="postcode-input"
              />
              <button @click="fetchUVData" class="go-btn" :disabled="postcodeError">Go</button>
            </div>
            <p v-if="postcodeError" class="error-text">
              Postcode must start with 3, be 4 digits, and between 3000-3338
            </p>
          </div>

          <div v-if="loading" class="loading">
            <p><i class="fas fa-spinner fa-spin"></i> Loading UV data...</p>
          </div>

          <div v-else-if="uvData" class="uv-display">
            <div class="uv-card">
              <h3><i class="fas fa-map-marker-alt"></i> {{ uvData.location }}</h3>
              <div class="uv-info">
                <div class="uv-index" :class="uvLevelClass">
                  <span class="uv-value">{{ uvData.index }}</span>
                  <span class="uv-text">UV Index</span>
                </div>
                <div class="uv-details">
                  <p>
                    <strong><i class="fas fa-signal"></i> UV Level:</strong> {{ uvData.level }}
                  </p>
                  <p>
                    <strong><i class="fas fa-calendar-day"></i> Date:</strong> {{ uvData.date }}
                  </p>
                  <p>
                    <strong><i class="fas fa-clock"></i> Time:</strong> {{ uvData.time }}
                  </p>
                </div>
              </div>
              <div class="protection-advice">
                <h4><i class="fas fa-shield-alt"></i> Protection Recommended:</h4>
                <ul>
                  <li v-for="(advice, index) in uvData.protection" :key="index">
                    {{ advice }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else-if="error" class="error-message">
            <p><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>
          </div>
        </div>
      </div>

      <NextPageArrow nextRoute="/recommendation" nextPageName="Recommendation" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as apiMock from '../api'
import NextPageArrow from '../components/NextPageArrow.vue'

interface UVData {
  location: string
  index: number
  level: string
  date: string
  time: string
  protection: string[]
}

const postcode = ref('')
const postcodeError = ref(false)
const uvData = ref<UVData | null>(null)
const loading = ref(false)
const error = ref('')

const uvLevelClass = computed(() => {
  if (!uvData.value) return ''

  const index = uvData.value.index
  if (index <= 2) return 'low'
  if (index <= 5) return 'moderate'
  if (index <= 7) return 'high'
  if (index <= 10) return 'very-high'
  return 'extreme'
})

const validatePostcode = () => {
  // 只允许数字，并且最多4位
  postcode.value = postcode.value.replace(/\D/g, '').slice(0, 4)

  // 验证是否以3开头且为4位数字，并且在3000-3338之间
  const postcodeNum = parseInt(postcode.value)
  postcodeError.value = !(
    postcode.value.length === 4 &&
    postcode.value.startsWith('3') &&
    postcodeNum >= 3000 &&
    postcodeNum <= 3338
  )
}

const fetchUVData = async () => {
  if (postcodeError.value || !postcode.value) {
    error.value = 'Please enter a valid postcode (3000-3338)'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 使用模拟数据，但传入邮政编码
    const response = await apiMock.getMockUVData(`Melbourne ${postcode.value}`)
    uvData.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch UV data. Please try again.'
    console.error('Error fetching UV data:', err)
    uvData.value = null
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
  padding: 30px;
  background: transparent;
  box-shadow: none;
  margin-bottom: 0;
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
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #1565c0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
}

.icon-title {
  color: #ff9800;
  margin-right: 10px;
  filter: drop-shadow(0 0 3px rgba(255, 152, 0, 0.4));
}

.sub-description {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #455a64;
  margin-bottom: 30px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-left: 4px solid #2196f3;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(33, 150, 243, 0.2);
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
  pointer-events: none;
  z-index: 1;
}

.sub-description:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.25);
}

.main-content-box {
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.postcode-section {
  margin-bottom: 25px;
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

.postcode-section label {
  display: block;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #37474f;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.input-container {
  display: flex;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-container:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.postcode-input {
  flex: 1;
  padding: 16px;
  font-size: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
  outline: none;
  transition: all 0.3s ease;
}

.postcode-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

.go-btn {
  padding: 16px 35px;
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.go-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.go-btn:hover:not(:disabled)::before {
  left: 100%;
}

.go-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transform: translateY(-2px);
}

.go-btn:active {
  transform: translateY(1px);
}

.go-btn:disabled {
  background: linear-gradient(135deg, #bdbdbd, #9e9e9e);
  cursor: not-allowed;
}

.error-text {
  color: #f44336;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  padding-left: 5px;
  animation: fadeIn 0.3s ease;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.loading {
  text-align: center;
  padding: 25px;
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.7;
    transform: scale(0.98);
  }
}

.error-message {
  color: #d32f2f;
  background: linear-gradient(to right, #ffebee, #ffcdd2);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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

.uv-display {
  margin-top: 25px;
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

.uv-card {
  background: linear-gradient(135deg, #f5f5f5, #eeeeee);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(200, 200, 200, 0.3);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.uv-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.uv-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #2196f3, #03a9f4, #00bcd4);
}

.uv-card h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #1565c0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.uv-info {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.uv-info:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.uv-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 25px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.uv-index:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.uv-index::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent);
}

.uv-value {
  font-size: 42px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.uv-text {
  font-size: 16px;
  font-weight: 500;
  z-index: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.uv-details {
  flex: 1;
  background: rgba(255, 255, 255, 0.5);
  padding: 15px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.uv-details p {
  margin-bottom: 12px;
  font-size: 16px;
  color: #37474f;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.uv-details p:hover {
  transform: translateX(5px);
}

.uv-details p i {
  margin-right: 10px;
  color: #1976d2;
  font-size: 18px;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
}

.protection-advice {
  background: linear-gradient(to right, #e8f5e9, #c8e6c9);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4caf50;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.protection-advice:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.protection-advice::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.protection-advice h4 {
  margin-bottom: 15px;
  color: #2e7d32;
  font-size: 18px;
  display: flex;
  align-items: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
}

.protection-advice h4 i {
  margin-right: 10px;
  color: #4caf50;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
}

.protection-advice ul {
  padding-left: 25px;
}

.protection-advice li {
  margin-bottom: 8px;
  color: #37474f;
  position: relative;
  transition: all 0.3s ease;
}

.protection-advice li:hover {
  transform: translateX(5px);
}

.protection-advice li::before {
  content: '✓';
  position: absolute;
  left: -20px;
  color: #4caf50;
  font-weight: bold;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
}

/* UV Level Colors with enhanced gradients */
.low {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  border: 2px solid rgba(76, 175, 80, 0.3);
}

.moderate {
  background: linear-gradient(135deg, #ffeb3b, #fbc02d);
  color: #333;
  border: 2px solid rgba(255, 235, 59, 0.3);
}

.high {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  border: 2px solid rgba(255, 152, 0, 0.3);
}

.very-high {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  border: 2px solid rgba(244, 67, 54, 0.3);
}

.extreme {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
  border: 2px solid rgba(156, 39, 176, 0.3);
}
</style>
