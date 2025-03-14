import axios from 'axios'

// 读取环境变量中的 API Gateway 地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-default-api.com'

// 处理 URL，防止 `//` 斜杠问题
const normalizeUrl = (endpoint) => `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`

// 获取癌症数据（GET 请求）
export const getCancerChart = async (params) => {
  return axios.get(normalizeUrl('getCancerChart'), { params })
}

// 获取 UV 指数数据（GET 请求）
export const getUVByPostcode = async (params) => {
  return axios.get(normalizeUrl('getUVByPostcode'), { params })
}

// 获取防晒推荐（POST 请求）
export const getRecommendation = async (data) => {
  return axios.post(normalizeUrl('getRecommendation'), data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 获取衣物推荐（GET 请求）
export const getClothingRecommendation = async (params) => {
  return axios.get(normalizeUrl('getClothingRecommendation'), { params })
}

// 获取防晒霜推荐（GET 请求）
export const getSunscreenRecommendation = async (params) => {
  return axios.get(normalizeUrl('getSunscreenRecommendation'), { params })
}

export default {
  getCancerChart,
  getUVByPostcode,
  getRecommendation,
  getClothingRecommendation,
  getSunscreenRecommendation,
}
