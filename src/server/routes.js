import express from 'express'
import { cancerData, uvDataByPostcode, skinToneRecommendations } from './data.js' // Now using destructured import

const router = express.Router()

// Get cancer data
router.post('/cancer-data', (req, res) => {
  const { gender, ageGroup } = req.body
  const result = cancerData[gender]?.[ageGroup] || []
  res.json(result)
})

// Get UV data
router.post('/uv-data', (req, res) => {
  const { postcode } = req.body
  const result = uvDataByPostcode[postcode] || []
  res.json(result)
})

// Get skin tone recommendations
router.post('/skin-tone-recommendation', (req, res) => {
  const { skinTone } = req.body
  const recommendation = skinToneRecommendations[skinTone] || 'No recommendation available.'
  res.json({ recommendation })
})

export default router
