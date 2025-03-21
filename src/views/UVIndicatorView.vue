<template>
  <div class="page-container">
    <div class="top-nav">
      <div class="nav-title">Sunscreen Guide</div>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">
          <i class="fas fa-umbrella-beach"></i> Sun Protector
        </router-link>
        <router-link to="/cancer-chart" class="nav-button">
          <i class="fas fa-chart-bar"></i> Cancer Insights
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
          <!-- 用户输入邮政编码 -->
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
              Please enter a valid Victoria postcode: a 4-digit number starting with 3.
            </p>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading">
            <p><i class="fas fa-spinner fa-spin"></i> Loading UV data...</p>
          </div>

          <!-- UV 数据展示 -->
          <div v-if="uvData" class="uv-display">
            <div class="uv-card">
              <h3><i class="fas fa-map-marker-alt"></i> Current Postcode: {{ uvData.postcode }}</h3>
              <canvas ref="uvChart"></canvas>
              <div class="chart-description">
                This chart displays the variation of UV index over time for the selected postcode.
                The X-axis represents the time of day, while the Y-axis indicates the UV index
                level. Different colors signify varying UV intensity levels: green (low), yellow
                (moderate), orange (high), red (very high), and purple (extreme). Users can analyze
                the line graph to understand the fluctuations in UV intensity throughout the day and
                plan outdoor activities accordingly, minimizing exposure during peak UV periods to
                reduce potential skin damage. The 24-hour range provides a complete view of UV index
                fluctuations throughout the day. While UV levels peak during daylight hours,
                displaying the full cycle ensures consistency and allows for trend analysis.
              </div>
            </div>
          </div>

          <!-- 报错信息 -->
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
import { ref, nextTick } from 'vue'
import { getUVByPostcode } from '../api'
import Chart from 'chart.js/auto'
import { useStore } from '@/store/store'
import NextPageArrow from '../components/NextPageArrow.vue'

// UV data interface
interface UVEntry {
  timestamp: number
  time: string
  uvIndex: number
}

interface UVData {
  location: string
  postcode: string
  data: UVEntry[]
}

// Reactive variables
const postcode = ref('3000')
const postcodeError = ref(false)
const uvData = ref<UVData | null>(null)
const loading = ref(false)
const error = ref('')
const chartInstance = ref<Chart | null>(null)
const uvChart = ref<HTMLCanvasElement | null>(null)

// Validate postcode
const validatePostcode = () => {
  // Only allow numeric input and limit to 4 digits
  postcode.value = postcode.value.replace(/\D/g, '').slice(0, 4)

  // Convert to number and validate range
  const numPostcode = parseInt(postcode.value)

  // Postcode must be 4 digits and between 3000-3338
  postcodeError.value = !(postcode.value.length === 4 && numPostcode >= 3000 && numPostcode <= 3338)
}

// Get UV data
const fetchUVData = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('📡 Fetching UV data for postcode:', postcode.value)
    const response = await getUVByPostcode({ postcode: postcode.value })
    const store = useStore()
    store.setPostcode(postcode.value)

    if (Array.isArray(response.data)) {
      uvData.value = {
        location: 'Unknown',
        postcode: postcode.value,
        data: response.data,
      }
    } else if (
      response.data &&
      typeof response.data === 'object' &&
      Array.isArray(response.data.data)
    ) {
      uvData.value = response.data
    } else {
      console.error('❌ Unexpected API data format:', response.data)
      throw new Error('Invalid data format')
    }

    console.log('✅ Updated uvData:', uvData.value)

    await nextTick()
    setTimeout(generateChart, 100) // Delay call to ensure DOM updates
  } catch (err) {
    error.value = 'Failed to fetch UV data. Please try again.'
    console.error('❌ Error fetching UV data:', err)
    uvData.value = null
  } finally {
    loading.value = false
  }
}

const getUVColor = (index: number) => {
  if (index <= 2) return '#00C853' // Green
  if (index <= 5) return '#FFD600' // Yellow
  if (index <= 7) return '#FF6D00' // Orange
  if (index <= 10) return '#D50000' // Red
  return '#6A1B9A' // Purple (extreme)
}

// Generate UV chart
const generateChart = async () => {
  await nextTick()

  if (!uvChart.value) {
    console.warn('🟡 uvChart ref is null, retrying in 100ms...')
    setTimeout(generateChart, 100)
    return
  }

  const ctx = uvChart.value.getContext('2d')
  if (!ctx) {
    console.error('❌ Canvas context is null!')
    return
  }

  console.log('✅ Creating Chart with Dynamic Segment Colors!')

  const labels =
    uvData.value?.data?.map((entry) =>
      new Date(entry.timestamp * 1000).toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    ) || []

  const uvValues = uvData.value?.data?.map((entry) => entry.uvIndex) || []

  // **Get data point colors**
  const borderColors = uvValues.map((value) => getUVColor(value))

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'UV Index Over Time',
          data: uvValues,
          borderColor: borderColors, // Data point colors
          pointBackgroundColor: borderColors, // Data point colors
          pointBorderColor: borderColors,
          borderWidth: 2,
          segment: {
            borderColor: (ctx) => {
              // **ctx.p1DataIndex gets the starting data point index for the current segment**
              return borderColors[ctx.p1DataIndex] || '#000' // Default value
            },
          },
          fill: false, // Don't fill area
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true, // Show legend
          position: 'top',
          labels: {
            color: '#333',
            font: { size: 14, weight: 'bold' },
            usePointStyle: true,
            padding: 20,
            generateLabels: () => [
              { text: '0-2 (Low)', fillStyle: '#00C853', strokeStyle: '#00C853' },
              { text: '3-5 (Moderate)', fillStyle: '#FFD600', strokeStyle: '#FFD600' },
              { text: '6-7 (High)', fillStyle: '#FF6D00', strokeStyle: '#FF6D00' },
              { text: '8-10 (Very High)', fillStyle: '#D50000', strokeStyle: '#D50000' },
              { text: '11+ (Extreme)', fillStyle: '#6A1B9A', strokeStyle: '#6A1B9A' },
            ],
          },
        },
      },
      scales: {
        x: { title: { display: true, text: 'Time' } },
        y: {
          title: { display: true, text: 'UV Index' },
          beginAtZero: true,
          suggestedMax: 12,
        },
      },
    },
  })
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

/* Chart description styles */
.chart-description {
  margin-top: 20px;
  padding: 15px 20px;
  text-align: left;
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  background-color: #f8f9fa;
  border-left: 4px solid #00bcd4; /* UV页面使用青色作为主题色 */
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.8s ease-in-out;
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
</style>
