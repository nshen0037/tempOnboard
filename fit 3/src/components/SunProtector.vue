<template>
  <div
    :style="{
      backgroundImage: `url('bg.png')`,
      backgroundSize: 'cover', // 让图片覆盖整个页面内容
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      minHeight: '100%', // 让背景高度匹配内容
      position: 'absolute',
      top: 0,
      left: 0,
    }"
  >
    <div class="container">
      <div class="header">
        <h1>Sun Protector</h1>
      </div>
      <div class="description">
        <h2>How Does UV Affect Skin Cancer Risk?</h2>
        <p>
          UV radiation is a major cause of skin cancer, especially in Australia. Long-term exposure
          damages the skin, increasing the risk of melanoma and other cancers.
        </p>
        <p>
          This tool lets you explore skin cancer rates in Melbourne from 1960 to 2024 based on your
          age and gender. Simply select your details and generate a chart to see how the risk has
          changed over time.
        </p>
        <p>
          Understanding these trends helps you recognize the dangers of UV exposure and take
          preventive measures. Protect your skin—stay informed and stay safe!
        </p>
      </div>
      <div class="sub-description">
        <p>💡 Select gender or age group to view skin cancer cases from 1960 to 2024</p>
      </div>
      <!-- 上方两个图表 -->
      <div class="chart-section">
        <div class="chart-box">
          <label for="gender">Gender:</label>
          <select v-model="selectedGender" id="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="all">All</option>
          </select>

          <label for="age">Age Group:</label>
          <select v-model="selectedAge" id="age">
            <option v-for="age in ageGroups" :key="age" :value="age">{{ age }}</option>
          </select>

          <button @click="generateChart" class="generate-btn">Generate</button>

          <div class="chart-container">
            <canvas ref="cancerChart"></canvas>
          </div>
        </div>
      </div>
      <div class="sub-description">
        <p>
          💡 Enter your postcode to get UV index data for different times of the day in your area
        </p>
      </div>
      <div class="postcode-section">
        <label for="postcode">Post code:</label>
        <input
          v-model="postcode"
          id="postcode"
          type="text"
          @input="validatePostcode"
          maxlength="4"
          class="postcode-input"
        />
        <button @click="fetchPostcodeData" class="go-btn" :disabled="postcodeError">Go</button>
        <p v-if="postcodeError" class="error-text">Postcode must start with 3 and be 4 digits</p>
      </div>

      <div class="chart-container">
        <canvas ref="uvChart"></canvas>
      </div>
      <div class="sub-description">
        <p>💡 Select your skin type to get recommended sunscreen and sun-protective clothing.</p>
      </div>
      <!-- Skin Tone 选择框和推荐 -->
      <div class="skin-tone-section">
        <label for="skinTone">Skin Tone:</label>
        <select v-model="selectedSkinTone" id="skinTone">
          <option value="dark-brown">Dark Brown</option>
          <option value="brown">Brown</option>
          <option value="light-brown">Light Brown</option>
          <option value="beige">Beige</option>
          <option value="fair">Fair</option>
        </select>
        <button @click="fetchRecommendation" class="go-btn">Go</button>
      </div>
      <!-- 推荐结果 -->
      <div class="recommendation-section">
        <h2>Recommendation</h2>
        <p>{{ recommendation }}</p>
      </div>

      <!-- Set Reminders Section -->
      <div class="reminder-section">
        <h2>Set Reminders</h2>
        <p>You can use browser notifications to get timely reminders for reapplying sunscreen</p>
        <div class="toggle-container">
          <label class="switch">
            <input type="checkbox" v-model="notificationsEnabled" @change="toggleNotifications" />
            <span class="slider round"></span>
          </label>
          <span class="toggle-label">Enable Browser Notifications</span>
        </div>

        <div class="reminder-input">
          <label for="reminderInterval">Remind me every:</label>
          <select v-model="reminderInterval" id="reminderInterval">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
        </div>

        <div class="progress-container" v-if="notificationsEnabled">
          <span class="progress-time">{{ remainingTime }}</span>
          <div class="progress-bar" :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
const backgroundImage = ref("url('bg.png')")

import Chart from 'chart.js/auto'
import axios from 'axios'

const selectedAge = ref('20-29')
const cancerChart = ref(null)
let chartInstance = null
const postcode = ref('')
const postcodeError = ref(false)
const selectedGender = ref('all')
const selectedSkinTone = ref('')
const recommendation = ref('Select your skin tone and click Go to get a recommendation.')

const uvChart = ref(null)
const cancerChartInstance = null
let uvChartInstance = null

import annotationPlugin from 'chartjs-plugin-annotation'
Chart.register(annotationPlugin)

const ageGroups = ref([
  '0-9',
  '10-19',
  '20-29',
  '30-39',
  '40-49',
  '50-59',
  '60-69',
  '70-79',
  '80-89',
  '90-99',
  '99+',
])

const generateChart = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/cancer-data', {
      gender: selectedGender.value,
      ageGroup: selectedAge.value,
    })

    const data = response.data
    const years = data.map((entry) => entry.year)
    const counts = data.map((entry) => entry.count)

    await nextTick()
    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(cancerChart.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: `Cancer Cases (${selectedAge.value}, ${selectedGender.value})`,
            data: counts,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Year' } },
          y: { title: { display: true, text: 'Number of Cases' } },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching cancer data:', error)
  }
}

const validatePostcode = () => {
  postcode.value = postcode.value.replace(/\D/g, '').slice(0, 4)
  postcodeError.value = !(postcode.value.length === 4 && postcode.value.startsWith('3'))
}
const fetchRecommendation = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/skin-tone-recommendation', {
      skinTone: selectedSkinTone.value,
    })
    recommendation.value = response.data.recommendation
  } catch (error) {
    console.error('Error fetching recommendation:', error)
    recommendation.value = 'Error fetching recommendation. Please try again.'
  }
}

const fetchPostcodeData = async () => {
  if (!postcodeError.value) {
    try {
      const response = await axios.post('http://localhost:5000/api/uv-data', {
        postcode: postcode.value,
      })

      const data = response.data
      const hours = data.map((entry) => entry.hour)
      const uvIndex = data.map((entry) => entry.uvIndex)

      await nextTick()
      if (uvChartInstance) uvChartInstance.destroy()

      uvChartInstance = new Chart(uvChart.value.getContext('2d'), {
        type: 'line',
        data: {
          labels: hours,
          datasets: [
            {
              label: `UV Index for Postcode ${postcode.value}`,
              data: uvIndex,
              borderColor: 'orange',
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Hour' } },
            y: { title: { display: true, text: 'UV Index' } },
          },
          plugins: {
            annotation: {
              annotations: [
                {
                  type: 'box',
                  yMin: 0,
                  yMax: 2,
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',
                  label: {
                    display: true,
                    content: 'Low',
                    position: 'center',
                    font: { size: 14, weight: 'bold' },
                  },
                },
                {
                  type: 'box',
                  yMin: 3,
                  yMax: 5,
                  backgroundColor: 'rgba(255, 255, 0, 0.2)',
                  label: {
                    display: true,
                    content: 'Moderate',
                    position: 'center',
                    font: { size: 14, weight: 'bold' },
                  },
                },
                {
                  type: 'box',
                  yMin: 6,
                  yMax: 7,
                  backgroundColor: 'rgba(255, 165, 0, 0.2)',
                  label: {
                    display: true,
                    content: 'High',
                    position: 'center',
                    font: { size: 14, weight: 'bold' },
                  },
                },
                {
                  type: 'box',
                  yMin: 8,
                  yMax: 10,
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  label: {
                    display: true,
                    content: 'Very High',
                    position: 'center',
                    font: { size: 14, weight: 'bold' },
                  },
                },
                {
                  type: 'box',
                  yMin: 11,
                  yMax: 12,
                  backgroundColor: 'rgba(128, 0, 128, 0.2)',
                  label: {
                    display: true,
                    content: 'Extreme',
                    position: 'center',
                    font: { size: 14, weight: 'bold' },
                  },
                },
              ],
            },
          },
        },
      })
    } catch (error) {
      console.error('Error fetching UV data:', error)
    }
  }
}

const generateRecommendation = () => {
  const recommendations = {
    fair: 'Use SPF 50+ sunscreen, wear a hat, and seek shade whenever possible.',
    medium: 'Use SPF 30+ sunscreen and wear protective clothing.',
    dark: 'Use SPF 15+ sunscreen and stay hydrated while outdoors.',
  }
  recommendation.value =
    recommendations[selectedSkinTone.value] || 'Please select a valid skin tone.'
}
const notificationsEnabled = ref(false)
const reminderInterval = ref(120)
const remainingTime = ref('2:00:00')
const progressWidth = ref('100%')
let reminderTimer = null

const toggleNotifications = async () => {
  if (notificationsEnabled.value) {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      startReminder()
    } else {
      notificationsEnabled.value = false
      alert('Notifications were not allowed. Please enable them in your browser settings.')
    }
  } else {
    stopReminder()
  }
}

const startReminder = () => {
  stopReminder()
  updateCountdown(reminderInterval.value * 60)
}

const stopReminder = () => {
  if (reminderTimer) {
    clearInterval(reminderTimer)
    reminderTimer = null
  }
}

const updateCountdown = (seconds) => {
  let timeLeft = seconds
  reminderTimer = setInterval(() => {
    timeLeft--
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const secs = timeLeft % 60
    remainingTime.value = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    progressWidth.value = `${(timeLeft / (reminderInterval.value * 60)) * 100}%`

    if (timeLeft <= 0) {
      showNotification()
      updateCountdown(reminderInterval.value * 60)
    }
  }, 1000)
}

const showNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Time to reapply your sunscreen!')
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Time to reapply your sunscreen!')
      }
    })
  }
}

watch(reminderInterval, (newInterval) => {
  if (notificationsEnabled.value) {
    startReminder()
  }
})

onMounted(() => {
  if (Notification.permission === 'granted') {
    notificationsEnabled.value = true
    startReminder()
  }
})

onUnmounted(() => {
  stopReminder()
})
</script>

<style scoped>
/* 全局样式 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('bg.png') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Arial', sans-serif;
}

/* 容器样式 */
.container {
  max-width: 900px;
  margin: 30px auto;
  padding: 25px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #333;
}

/* 标题样式 */
.header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 26px;
  color: #222;
  font-weight: 700;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}

/* 介绍部分 */
.description {
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  line-height: 1.6;
}

/* 图表区域 */
.chart-section,
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 50px;
}

.chart-box {
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

/* 让 Label (Gender 和 Age Group) 和下拉框之间的间距更大 */
.chart-box label {
  font-size: 16px;
  font-weight: bold;
  margin-right: 8px; /* 增加 Label 和选择框的距离 */
  margin-left: 8px;
}

/* 让下拉框的大小和间距更合适 */
.chart-box select {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
}

/* 让 Generate 按钮有足够的间距 */
.chart-box .generate-btn {
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  background: #007bff;
  color: white;
  transition: background 0.3s;
  margin-left: 10px; /* 让按钮与 Age Group 选择框分开 */
}

.chart-box .generate-btn:hover {
  background: #0056b3;
}

.chart-box:hover {
  transform: translateY(-5px);
}

.chart {
  margin-top: 10px;
  padding: 20px;
  border: 2px dashed #aaa;
  border-radius: 6px;
  background: #f8f8f8;
}

/* 按钮样式 */
button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.generate-btn {
  background: #007bff;
  color: white;
}

.generate-btn:hover {
  background: #0056b3;
}

.go-btn {
  padding: 10px 16px;
  background: #007bff;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  border: none;
}

.go-btn:hover {
  background: #0056b3;
}

/* 选择框样式 */
select,
input {
  padding: 8px;
  font-size: 14px;
  border: 2px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease-in-out;
}

select:focus,
input:focus {
  border-color: #007bff;
  outline: none;
}

/* 邮编输入 */
/* 让 Post code 输入框和按钮横向排列 */
.postcode-section {
  display: flex;
  font-weight: bold;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 12px; /* 增加输入框和按钮的间距 */
  margin-bottom: 30px; /* 保持底部间距 */
}

/* 让输入框保持适当大小 */
.postcode-input {
  width: 120px; /* 增加宽度，避免太窄 */
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  text-align: center;
}

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* 皮肤推荐 */
.skin-tone-section,
.recommendation-section {
  text-align: center;
  /* margin-top: 20px; */
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 让 Skin Tone 选择框和 Go 按钮保持横向排列，并增加间距 */
.skin-tone-section {
  display: flex;
  align-items: center; /* 让所有元素垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 16px; /* 增加横向间距 */
}

/* 让 label (Skin Tone) 和 select 之间的距离变大 */
.skin-tone-section label {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px; /* 让 label 和下拉框分开 */
}

/* 让 select 框和按钮的间距更大 */
.skin-tone-section select {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  margin-right: 12px; /* 让选择框和按钮之间的距离更大 */
}

/* 调整 Go 按钮的大小 */
.skin-tone-section .go-btn {
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  background: #007bff;
  color: white;
  transition: background 0.3s;
}

.skin-tone-section .go-btn:hover {
  background: #0056b3;
}

/* 提醒功能 */
.reminder-section {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 25px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.toggle-label {
  margin-left: 10px;
  font-weight: bold;
}

/* 进度条 */
.progress-container {
  margin-top: 10px;
  background: #ddd;
  border-radius: 5px;
  height: 30px;
  position: relative;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
}

.progress-bar {
  height: 100%;
  background: #4caf50;
  transition: width 1s linear;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-time {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 14px;
  font-weight: bold;
  z-index: 2;
}

/* 子描述样式 */
.sub-description {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.85);
  border-left: 4px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease-in-out;
}

.sub-description p {
  margin: 0;
  line-height: 1.6;
}

.sub-description:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.95);
}
</style>
