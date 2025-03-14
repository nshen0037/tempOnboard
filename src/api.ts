import axios from 'axios'

// 读取环境变量中的 API Gateway 地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-default-api.com'

// 处理 URL，防止 `//` 斜杠问题
const normalizeUrl = (endpoint: string): string =>
  `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`

// 获取癌症数据
export const getCancerChart = async (params: { gender: string; ageGroup: string }) => {
  return axios.get(normalizeUrl('getCancerChart'), { params })
}

// 获取 UV 指数数据
export const getUVByPostcode = async (params: { postcode: string }) => {
  return axios.get(normalizeUrl('getUVByPostcode'), { params })
}

// 获取 UV 指数数据（通过位置名称）
export const getUVData = async (location: string) => {
  return axios.get(normalizeUrl('getUVData'), { params: { location } })
}

// 获取防晒推荐
export const getRecommendation = async (data: { skinType: number; uvIndex: number }) => {
  return axios.post(normalizeUrl('getRecommendation'), data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 获取衣物推荐
export const getClothingRecommendation = async (params: {
  uvIndex: number
  temperature: number
}) => {
  return axios.get(normalizeUrl('getClothingRecommendation'), { params })
}

// 获取防晒霜推荐
export const getSunscreenRecommendation = async (params: { skinType: number; uvIndex: number }) => {
  return axios.get(normalizeUrl('getSunscreenRecommendation'), { params })
}

// 模拟数据（当API不可用时使用）
export const getMockUVData = (location: string) => {
  return Promise.resolve({
    data: {
      location: location || 'Melbourne, Australia',
      index: 8,
      level: 'Very High',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      protection: [
        'Apply SPF 50+ sunscreen',
        'Wear a hat and sunglasses',
        'Seek shade during midday hours',
        'Wear protective clothing',
      ],
    },
  })
}

export const getMockCancerData = (gender: string, ageGroup: string) => {
  // 生成模拟数据，根据性别和年龄组调整数据
  const years = Array.from({ length: 13 }, (_, i) => (1960 + i * 5).toString())

  // 根据性别和年龄组调整基础数值
  let baseCases = 20
  if (gender === 'male') baseCases += 10
  if (gender === 'female') baseCases += 5

  // 年龄组影响增长率
  let growthFactor = 1.0
  if (ageGroup.includes('5')) growthFactor = 1.2
  if (ageGroup.includes('6')) growthFactor = 1.5
  if (ageGroup.includes('7')) growthFactor = 1.8
  if (ageGroup.includes('8')) growthFactor = 2.0

  // 生成随机但有一定模式的数据
  const counts = years.map((year, index) => {
    const yearNum = parseInt(year)
    const yearFactor = (yearNum - 1960) / 10 // 随时间增长
    return Math.floor(
      (baseCases + index * growthFactor * 5) * (1 + yearFactor * 0.2) + Math.random() * 20,
    )
  })

  return Promise.resolve({
    data: years.map((year, index) => ({
      year,
      count: counts[index],
    })),
  })
}

export default {
  getCancerChart,
  getUVByPostcode,
  getUVData,
  getRecommendation,
  getClothingRecommendation,
  getSunscreenRecommendation,
  getMockUVData,
  getMockCancerData,
}
