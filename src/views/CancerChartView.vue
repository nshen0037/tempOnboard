<template>
  <div class="page-container">
    <div class="top-nav">
      <div class="nav-title">Sunscreen Guide</div>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">
          <i class="fas fa-umbrella-beach"></i> Sun Protector
        </router-link>
        <router-link to="/cancer-chart" class="nav-button active">
          <i class="fas fa-chart-bar"></i> Cancer Chart
        </router-link>
        <router-link to="/uv-indicator" class="nav-button">
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
        <h2><i class="fas fa-chart-bar icon-title"></i> Cancer Chart</h2>
        <div class="sub-description">
          <p>💡 Select gender or age group to view skin cancer cases from 1960 to 2024</p>
        </div>

        <div class="main-content-box">
          <div class="chart-box">
            <div class="filter-controls">
              <div class="filter-group">
                <label for="gender"><i class="fas fa-venus-mars"></i> Gender:</label>
                <select v-model="selectedGender" id="gender">
<<<<<<< HEAD
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="all">All</option>
=======
                  <option value="Males">Males</option>
                  <option value="Females">Females</option>
                  <option value="Persons">All</option>
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
                </select>
              </div>

              <div class="filter-group">
                <label for="age"><i class="fas fa-user-clock"></i> Age Group:</label>
                <select v-model="selectedAge" id="age">
                  <option v-for="age in ageGroups" :key="age" :value="age">{{ age }}</option>
                </select>
              </div>

              <button @click="generateChart" class="generate-btn">
                <i class="fas fa-sync-alt"></i> Generate
              </button>
            </div>

            <div class="chart-container">
              <canvas ref="cancerChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <NextPageArrow nextRoute="/uv-indicator" nextPageName="UV Indicator" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { getCancerChart } from '../api'
<<<<<<< HEAD
import * as apiMock from '../api'
=======
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
import NextPageArrow from '../components/NextPageArrow.vue'

// 定义数据接口
interface CancerDataEntry {
  year: string
  count: number
}

const selectedAge = ref('25-29')
const cancerChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const selectedGender = ref('all')

const ageGroups = ref([
<<<<<<< HEAD
  '0-4',
  '5-9',
  '10-14',
  '15-19',
  '20-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50-54',
  '55-59',
  '60-64',
  '65-69',
  '70-74',
  '75-79',
  '80-84',
  '85-89',
  '90-94',
  '95-99',
  'All ages combine',
])

const generateChart = async () => {
  try {
    // 尝试使用真实API，如果失败则使用模拟数据
    let response
    try {
      response = await getCancerChart({
        gender: selectedGender.value,
        ageGroup: selectedAge.value,
      })
    } catch {
      console.log('Using mock data instead of real API')
      response = await apiMock.getMockCancerData(selectedGender.value, selectedAge.value)
    }

    const data = response.data
    const years = data.map((entry: CancerDataEntry) => entry.year)
    const counts = data.map((entry: CancerDataEntry) => entry.count)
=======
  '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34',
  '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69',
  '70-74', '75-79', '80-84', '85-89', 'All ages combine'
])

// const generateChart = async () => {
//   try {
//     // 直接请求真实 API
//     const response = await getCancerChart({
//       gender: selectedGender.value,
//       ageGroup: selectedAge.value,
//     })

//     const data = response.data
//     const years = data.map((entry: CancerDataEntry) => entry.year)
//     const counts = data.map((entry: CancerDataEntry) => entry.count)

//     await nextTick()
//     if (chartInstance) chartInstance.destroy()

//     if (cancerChart.value) {
//       chartInstance = new Chart(cancerChart.value.getContext('2d')!, {
//         type: 'line',
//         data: {
//           labels: years,
//           datasets: [
//             {
//               label: `Cancer Cases (${selectedAge.value}, ${selectedGender.value})`,
//               data: counts,
//               borderColor: '#3498db',
//               backgroundColor: 'rgba(52, 152, 219, 0.2)',
//               fill: true,
//               tension: 0.4,
//               borderWidth: 3,
//               pointBackgroundColor: '#3498db',
//               pointRadius: 4,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: {
//               position: 'top',
//               labels: {
//                 font: { size: 14, weight: 'bold' },
//               },
//             },
//             tooltip: {
//               backgroundColor: 'rgba(0, 0, 0, 0.8)',
//               titleFont: { size: 16, weight: 'bold' },
//               bodyFont: { size: 14 },
//               padding: 15,
//             },
//           },
//           scales: {
//             x: {
//               title: {
//                 display: true,
//                 text: 'Year',
//                 font: { size: 14, weight: 'bold' },
//               },
//               grid: { display: false },
//             },
//             y: {
//               title: {
//                 display: true,
//                 text: 'Number of Cases',
//                 font: { size: 14, weight: 'bold' },
//               },
//               beginAtZero: true,
//             },
//           },
//           animation: {
//             duration: 1000,
//             easing: 'easeOutQuart',
//           },
//         },
//       })
//     }
//   } catch (error) {
//     console.error('Error fetching cancer data:', error)
//   }
// }

interface CancerDataEntry {
  year: string
  incidence_count: number
  mortality_count: number
}

const generateChart = async () => {
  try {
    const response = await getCancerChart({
      gender: selectedGender.value,
      ageGroup: selectedAge.value,
    })

    const data: CancerDataEntry[] = response.data

    const years = data.map(entry => entry.year)
    const incidenceCounts = data.map(entry => Number(entry.incidence_count))
    const mortalityCounts = data.map(entry => Number(entry.mortality_count))
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)

    await nextTick()
    if (chartInstance) chartInstance.destroy()

    if (cancerChart.value) {
      chartInstance = new Chart(cancerChart.value.getContext('2d')!, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
<<<<<<< HEAD
              label: `Cancer Cases (${selectedAge.value}, ${selectedGender.value})`,
              data: counts,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true,
              tension: 0.4,
=======
              label: `Cancer Incidence (${selectedAge.value}, ${selectedGender.value})`,
              data: incidenceCounts,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true,
              tension: 0.2,
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
              borderWidth: 3,
              pointBackgroundColor: '#3498db',
              pointRadius: 4,
            },
<<<<<<< HEAD
=======
            {
              label: `Cancer Mortality (${selectedAge.value}, ${selectedGender.value})`,
              data: mortalityCounts,
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.2)',
              fill: true,
              tension: 0.2,
              borderWidth: 3,
              pointBackgroundColor: '#e74c3c',
              pointRadius: 4,
            },
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
<<<<<<< HEAD
                font: {
                  size: 14,
                  weight: 'bold',
                },
=======
                font: { size: 14, weight: 'bold' },
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
<<<<<<< HEAD
              titleFont: {
                size: 16,
                weight: 'bold',
              },
              bodyFont: {
                size: 14,
              },
=======
              titleFont: { size: 16, weight: 'bold' },
              bodyFont: { size: 14 },
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
              padding: 15,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
<<<<<<< HEAD
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
              grid: {
                display: false,
              },
=======
                font: { size: 14, weight: 'bold' },
              },
              grid: { display: false },
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
            },
            y: {
              title: {
                display: true,
                text: 'Number of Cases',
<<<<<<< HEAD
                font: {
                  size: 14,
                  weight: 'bold',
                },
=======
                font: { size: 14, weight: 'bold' },
>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
              },
              beginAtZero: true,
            },
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart',
          },
        },
      })
    }
  } catch (error) {
    console.error('Error fetching cancer data:', error)
  }
}

<<<<<<< HEAD
=======

>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
onMounted(() => {
  generateChart()
})
</script>

<<<<<<< HEAD
=======

>>>>>>> f925324 (Refactored and adjusted getCancerChart and getUVByPostcode methods to ensure proper chart rendering.)
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(to bottom, #e3f2fd, #bbdefb, #90caf9);
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
  background-color: rgba(255, 255, 255, 0.92);
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
  padding: 30px;
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
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #1565c0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  position: relative;
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
  color: #555;
  margin-bottom: 30px;
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.9);
  border-left: 4px solid #3498db;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.15);
  line-height: 1.6;
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
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.25);
}

.main-content-box {
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
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

.chart-box {
  text-align: center;
  background: white;
  padding: 25px;
  border-radius: 15px;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
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

.filter-group {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.filter-group:hover {
  transform: translateY(-3px);
}

.filter-group label {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
  color: #555;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.filter-group select {
  padding: 12px 18px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.filter-group select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.generate-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
}

.generate-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.generate-btn:hover::before {
  left: 100%;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #2980b9, #1a5276);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
}

.generate-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.4);
}

.chart-container {
  margin-top: 30px;
  height: 400px;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease;
  position: relative;
  overflow: hidden;
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

.chart-container::before {
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

.chart-container:hover {
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.15);
  transform: scale(1.01);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
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
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  background: linear-gradient(to right, #ffebee, #ffcdd2);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
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
</style>
