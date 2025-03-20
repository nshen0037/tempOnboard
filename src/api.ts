import axios from 'axios'

// Read API Gateway address from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-default-api.com'

// Process URL to prevent `//` slash issues
const normalizeUrl = (endpoint: string): string =>
  `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`

// Get cancer data
export const getCancerChart = async (params: { gender: string; ageGroup: string }) => {
  return axios.get(normalizeUrl('getCancerChart'), { params })
}

// Get UV index data
export const getUVByPostcode = async (params: { postcode: string }) => {
  return axios.get(normalizeUrl('getUVByPostcode'), { params })
}

// Get UV index data (by location name)
export const getUVData = async (location: string) => {
  return axios.get(normalizeUrl('getUVData'), { params: { location } })
}

// Get sunscreen recommendations
export const getRecommendation = async (params: { skinTone: number; postcode: string }) => {
  try {
    const response = await axios.get(normalizeUrl('getRecommendation'), { params })
    return response.data // Ensure we return the JSON data from the backend
  } catch (error) {
    console.error('❌ Error fetching recommendation:', error)
    throw error
  }
}

// Get clothing recommendations
export const getClothingRecommendation = async (params: {
  uvIndex: number
  temperature: number
}) => {
  return axios.get(normalizeUrl('getClothingRecommendation'), { params })
}

// Get sunscreen recommendations
export const getSunscreenRecommendation = async (params: { skinType: number; uvIndex: number }) => {
  return axios.get(normalizeUrl('getSunscreenRecommendation'), { params })
}

// Mock data (used when API is unavailable)
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
  // Generate mock data, adjust based on gender and age group
  const years = Array.from({ length: 13 }, (_, i) => (1960 + i * 5).toString())

  // Adjust base values based on gender and age group
  let baseCases = 20
  if (gender === 'male') baseCases += 10
  if (gender === 'female') baseCases += 5

  // Age group affects growth rate
  let growthFactor = 1.0
  if (ageGroup.includes('5')) growthFactor = 1.2
  if (ageGroup.includes('6')) growthFactor = 1.5
  if (ageGroup.includes('7')) growthFactor = 1.8
  if (ageGroup.includes('8')) growthFactor = 2.0

  // Generate random but patterned data
  const counts = years.map((year, index) => {
    const yearNum = parseInt(year)
    const yearFactor = (yearNum - 1960) / 10 // Increase over time
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
