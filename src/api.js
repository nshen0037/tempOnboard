import axios from 'axios'

// 读取环境变量中的 API Gateway 地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  console.error('❌ Error: VITE_API_BASE_URL is not defined. Please check your .env configuration.')
}

const normalizeUrl = (endpoint) => {
  if (!BASE_URL) {
    throw new Error('❌ API base URL is undefined. Please set VITE_API_BASE_URL in .env file.')
  }
  if (!endpoint) {
    throw new Error('❌ API endpoint is required.')
  }
  return `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
}

// 获取癌症数据（GET 请求）
export const getCancerChart = async (params) => {
  try {
    const response = await axios.get(normalizeUrl('getCancerChart'), { params })
    return response.data
  } catch (error) {
    console.error('❌ Error fetching cancer chart data:', error)
    throw error
  }
}

// 获取 UV 指数数据（GET 请求）
export const getUVByPostcode = async (params) => {
  try {
    const response = await axios.get(normalizeUrl('getUVByPostcode'), { params })
    return response.data
  } catch (error) {
    console.error('❌ Error fetching UV index data:', error)
    throw error
  }
}

// 获取防晒推荐（POST 请求）
export const getRecommendation = async (params) => {
  try {
    const response = await axios.get((normalizeUrl)('getRecommendation'),{params})
    return response.data
  } catch (error) {
    console.error('❌ Error fetching recommendation:', error)
    throw error
  }
}

// 获取衣物推荐（GET 请求）
export const getClothingRecommendation = async (params) => {
  try {
    const response = await axios.get(normalizeUrl('getClothingRecommendation'), { params })
    return response.data
  } catch (error) {
    console.error('❌ Error fetching clothing recommendation:', error)
    throw error
  }
}

// 获取防晒霜推荐（GET 请求）
export const getSunscreenRecommendation = async (params) => {
  try {
    const response = await axios.get(normalizeUrl('getSunscreenRecommendation'), { params })
    return response.data
  } catch (error) {
    console.error('❌ Error fetching sunscreen recommendation:', error)
    throw error
  }
}

export default {
  getCancerChart,
  getUVByPostcode,
  getRecommendation,
  getClothingRecommendation,
  getSunscreenRecommendation,
}
