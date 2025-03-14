import express from 'express'
import { cancerData, uvDataByPostcode, skinToneRecommendations } from './data.js' // ✅ 现在使用解构导入

const router = express.Router()

// 获取癌症数据
router.post('/cancer-data', (req, res) => {
  const { gender, ageGroup } = req.body
  const result = cancerData[gender]?.[ageGroup] || []
  res.json(result)
})

// 获取 UV 数据
router.post('/uv-data', (req, res) => {
  const { postcode } = req.body
  const result = uvDataByPostcode[postcode] || []
  res.json(result)
})

// 获取 Skin Tone 推荐
router.post('/skin-tone-recommendation', (req, res) => {
  const { skinTone } = req.body
  const recommendation = skinToneRecommendations[skinTone] || 'No recommendation available.'
  res.json({ recommendation })
})

export default router
