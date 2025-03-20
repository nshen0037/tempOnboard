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
                <p>
                  This chart displays the variation of UV index over time for the selected postcode.
                  The X-axis represents the time of day, while the Y-axis indicates the UV index
                  level. Different colors signify varying UV intensity levels: green (low), yellow
                  (moderate), orange (high), red (very high), and purple (extreme). Users can
                  analyze the line graph to understand the fluctuations in UV intensity throughout
                  the day and plan outdoor activities accordingly, minimizing exposure during peak
                  UV periods to reduce potential skin damage. The 24-hour range provides a complete
                  view of UV index fluctuations throughout the day. While UV levels peak during
                  daylight hours, displaying the full cycle ensures consistency and allows for trend
                  analysis.
                </p>
              </div>
            </div>
          </div>

          <!-- 报错信息 -->
          <div v-else-if="error" class="error-message">
            <p><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>
          </div>
        </div>

        <NextPageArrow nextRoute="/recommendation" nextPageName="Recommendation" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { getUVByPostcode } from '../api'
import Chart from 'chart.js/auto'
import { useStore } from '@/store/store'
import NextPageArrow from '../components/NextPageArrow.vue'

// UV 数据接口
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

// 响应式变量
const postcode = ref('3000')
const postcodeError = ref(false)
const uvData = ref<UVData | null>(null)
const loading = ref(false)
const error = ref('')
const chartInstance = ref<Chart | null>(null)
const uvChart = ref<HTMLCanvasElement | null>(null)

const allowedPostcodes = new Set([
  3000, 3001, 3002, 3003, 3004, 3005, 3006, 3008, 3010, 3011, 3012, 3013, 3015, 3016, 3018, 3019,
  3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034, 3036,
  3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3047, 3048, 3049, 3050, 3051, 3052,
  3053, 3054, 3055, 3056, 3057, 3058, 3059, 3060, 3061, 3062, 3063, 3064, 3065, 3066, 3067, 3068,
  3070, 3071, 3072, 3073, 3074, 3075, 3076, 3078, 3079, 3081, 3082, 3083, 3084, 3085, 3086, 3087,
  3088, 3089, 3090, 3091, 3093, 3094, 3095, 3096, 3097, 3099, 3101, 3102, 3103, 3104, 3105, 3106,
  3107, 3108, 3109, 3111, 3113, 3114, 3115, 3116, 3121, 3122, 3123, 3124, 3125, 3126, 3127, 3128,
  3129, 3130, 3131, 3132, 3133, 3134, 3135, 3136, 3137, 3138, 3139, 3140, 3141, 3142, 3143, 3144,
  3145, 3146, 3147, 3148, 3149, 3150, 3151, 3152, 3153, 3154, 3155, 3156, 3158, 3159, 3160, 3161,
  3162, 3163, 3164, 3165, 3166, 3167, 3168, 3169, 3170, 3171, 3172, 3173, 3174, 3175, 3176, 3177,
  3178, 3179, 3180, 3181, 3182, 3183, 3184, 3185, 3186, 3187, 3188, 3189, 3190, 3191, 3192, 3193,
  3194, 3195, 3196, 3197, 3198, 3199, 3200, 3201, 3202, 3204, 3205, 3206, 3207, 3211, 3212, 3213,
  3214, 3215, 3216, 3217, 3218, 3219, 3220, 3221, 3222, 3223, 3224, 3225, 3226, 3227, 3228, 3230,
  3231, 3232, 3233, 3234, 3235, 3236, 3237, 3238, 3239, 3240, 3241, 3242, 3243, 3249, 3250, 3251,
  3254, 3260, 3264, 3265, 3266, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3275, 3276, 3277,
  3278, 3279, 3280, 3281, 3282, 3283, 3284, 3285, 3286, 3287, 3289, 3292, 3293, 3294, 3300, 3301,
  3302, 3303, 3304, 3305, 3309, 3310, 3311, 3312, 3314, 3315, 3317, 3318, 3319, 3321, 3322, 3323,
  3324, 3325, 3328, 3329, 3330, 3331, 3332, 3333, 3334, 3335, 3336, 3337, 3338, 3340, 3341, 3342,
  3345, 3350, 3351, 3352, 3353, 3354, 3355, 3356, 3357, 3358, 3360, 3361, 3363, 3364, 3370, 3371,
  3373, 3374, 3375, 3377, 3378, 3379, 3380, 3381, 3384, 3385, 3387, 3388, 3390, 3391, 3392, 3393,
  3395, 3396, 3399, 3400, 3401, 3402, 3407, 3409, 3412, 3413, 3414, 3415, 3418, 3419, 3420, 3423,
  3424, 3427, 3428, 3429, 3430, 3431, 3432, 3433, 3434, 3435, 3437, 3438, 3440, 3441, 3442, 3444,
  3446, 3447, 3448, 3450, 3451, 3453, 3458, 3460, 3461, 3462, 3463, 3464, 3465, 3467, 3468, 3469,
  3472, 3475, 3477, 3478, 3480, 3482, 3483, 3485, 3487, 3488, 3489, 3490, 3491, 3494, 3496, 3498,
  3500, 3501, 3502, 3505, 3506, 3507, 3509, 3512, 3515, 3516, 3517, 3518, 3520, 3521, 3522, 3523,
  3525, 3527, 3529, 3530, 3531, 3533, 3537, 3540, 3542, 3544, 3546, 3549, 3550, 3551, 3552, 3554,
  3555, 3556, 3557, 3558, 3559, 3561, 3562, 3563, 3564, 3565, 3566, 3567, 3568, 3570, 3571, 3572,
  3573, 3575, 3576, 3579, 3580, 3581, 3583, 3584, 3585, 3586, 3588, 3589, 3590, 3591, 3594, 3595,
  3596, 3597, 3599, 3607, 3608, 3610, 3612, 3614, 3616, 3617, 3618, 3619, 3620, 3621, 3622, 3623,
  3624, 3629, 3630, 3631, 3632, 3633, 3634, 3635, 3636, 3637, 3638, 3639, 3640, 3641, 3643, 3644,
  3646, 3647, 3649, 3658, 3659, 3660, 3661, 3662, 3663, 3664, 3665, 3666, 3669, 3670, 3671, 3672,
  3673, 3675, 3676, 3677, 3678, 3682, 3683, 3685, 3687, 3688, 3689, 3690, 3691, 3694, 3695, 3697,
  3698, 3699, 3700, 3701, 3704, 3705, 3707, 3708, 3709, 3711, 3712, 3713, 3714, 3715, 3717, 3718,
  3719, 3720, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3730, 3732, 3733, 3735, 3736, 3737, 3738,
  3739, 3740, 3741, 3744, 3746, 3747, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758,
  3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3770, 3775, 3777, 3778, 3779, 3781, 3782,
  3783, 3785, 3786, 3787, 3788, 3789, 3791, 3792, 3793, 3795, 3796, 3797, 3799, 3800, 3802, 3803,
  3804, 3805, 3806, 3807, 3808, 3809, 3810, 3812, 3813, 3814, 3815, 3816, 3818, 3820, 3821, 3822,
  3823, 3824, 3825, 3831, 3832, 3833, 3835, 3840, 3841, 3842, 3844, 3847, 3850, 3851, 3852, 3853,
  3854, 3856, 3857, 3858, 3859, 3860, 3862, 3864, 3865, 3869, 3870, 3871, 3873, 3874, 3875, 3878,
  3880, 3882, 3885, 3886, 3887, 3888, 3889, 3890, 3891, 3892, 3893, 3895, 3896, 3898, 3900, 3902,
  3903, 3904, 3909, 3910, 3911, 3912, 3913, 3915, 3916, 3918, 3919, 3920, 3921, 3922, 3923, 3925,
  3926, 3927, 3928, 3929, 3930, 3931, 3933, 3934, 3936, 3937, 3938, 3939, 3940, 3941, 3942, 3943,
  3944, 3945, 3946, 3950, 3951, 3953, 3954, 3956, 3957, 3958, 3959, 3960, 3962, 3964, 3965, 3966,
  3967, 3971, 3975, 3976, 3977, 3978, 3979, 3980, 3981, 3984, 3987, 3988, 3989, 3990, 3991, 3992,
  3995, 3996,
])

// 验证邮政编码
const validatePostcode = () => {
  // 只允许输入数字，并限制长度为4位
  postcode.value = postcode.value.replace(/\D/g, '').slice(0, 4)

  // 转换为数值并进行范围验证
  const postcodeNumber = Number(postcode.value)

  // 邮政编码必须是4位数，且在3000-3338之间
  postcodeError.value = !(postcode.value.length === 4 && allowedPostcodes.has(postcodeNumber))
}

// 获取 UV 数据
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
    setTimeout(generateChart, 100) // 延迟调用，确保 DOM 更新完成
  } catch (err) {
    error.value = 'Failed to fetch UV data. Please try again.'
    console.error('❌ Error fetching UV data:', err)
    uvData.value = null
  } finally {
    loading.value = false
  }
}

const getUVColor = (index: number) => {
  if (index <= 2) return '#00C853' // 绿色
  if (index <= 5) return '#FFD600' // 黄色
  if (index <= 7) return '#FF6D00' // 橙色
  if (index <= 10) return '#D50000' // 红色
  return '#6A1B9A' // 紫色 (极端)
}

// 生成 UV 图表
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

  // **获取数据点颜色**
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
          borderColor: borderColors, // 数据点颜色
          pointBackgroundColor: borderColors, // 数据点颜色
          pointBorderColor: borderColors,
          borderWidth: 2,
          segment: {
            borderColor: (ctx) => {
              // **ctx.p1DataIndex 获取当前 segment 的起始数据点索引**
              return borderColors[ctx.p1DataIndex] || '#000' // 默认值
            },
          },
          fill: false, // 不填充区域
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true, // 显示图例
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

.chart-description {
  margin-top: 30px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-left: 4px solid #2196f3;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.2);
  text-align: left;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  animation: fadeIn 0.8s ease;
}
</style>
