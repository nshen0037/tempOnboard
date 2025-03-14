const cancerData = {
  male: {
    '0-9': [
      { year: 1960, count: 2 },
      { year: 1970, count: 3 },
      { year: 1980, count: 5 },
      { year: 1990, count: 8 },
      { year: 2000, count: 10 },
      { year: 2010, count: 15 },
      { year: 2020, count: 18 },
    ],
    '10-19': [
      { year: 1960, count: 5 },
      { year: 1970, count: 8 },
      { year: 1980, count: 12 },
      { year: 1990, count: 18 },
      { year: 2000, count: 25 },
      { year: 2010, count: 30 },
      { year: 2020, count: 35 },
    ],
    '20-29': [
      { year: 1960, count: 10 },
      { year: 1970, count: 15 },
      { year: 1980, count: 20 },
      { year: 1990, count: 28 },
      { year: 2000, count: 35 },
      { year: 2010, count: 45 },
      { year: 2020, count: 50 },
    ],
    '30-39': [
      { year: 1960, count: 15 },
      { year: 1970, count: 20 },
      { year: 1980, count: 30 },
      { year: 1990, count: 40 },
      { year: 2000, count: 55 },
      { year: 2010, count: 70 },
      { year: 2020, count: 80 },
    ],
    '40-49': [
      { year: 1960, count: 20 },
      { year: 1970, count: 30 },
      { year: 1980, count: 45 },
      { year: 1990, count: 60 },
      { year: 2000, count: 75 },
      { year: 2010, count: 90 },
      { year: 2020, count: 110 },
    ],
  },
  female: {
    '0-9': [
      { year: 1960, count: 1 },
      { year: 1970, count: 2 },
      { year: 1980, count: 3 },
      { year: 1990, count: 5 },
      { year: 2000, count: 8 },
      { year: 2010, count: 12 },
      { year: 2020, count: 15 },
    ],
    '10-19': [
      { year: 1960, count: 4 },
      { year: 1970, count: 6 },
      { year: 1980, count: 10 },
      { year: 1990, count: 14 },
      { year: 2000, count: 22 },
      { year: 2010, count: 28 },
      { year: 2020, count: 32 },
    ],
    '20-29': [
      { year: 1960, count: 8 },
      { year: 1970, count: 12 },
      { year: 1980, count: 18 },
      { year: 1990, count: 26 },
      { year: 2000, count: 33 },
      { year: 2010, count: 40 },
      { year: 2020, count: 48 },
    ],
    '30-39': [
      { year: 1960, count: 12 },
      { year: 1970, count: 18 },
      { year: 1980, count: 26 },
      { year: 1990, count: 36 },
      { year: 2000, count: 50 },
      { year: 2010, count: 65 },
      { year: 2020, count: 75 },
    ],
    '40-49': [
      { year: 1960, count: 18 },
      { year: 1970, count: 28 },
      { year: 1980, count: 40 },
      { year: 1990, count: 55 },
      { year: 2000, count: 70 },
      { year: 2010, count: 85 },
      { year: 2020, count: 100 },
    ],
  },
}

const uvDataByPostcode = {
  3000: [
    { hour: 0, uvIndex: 0 },
    { hour: 1, uvIndex: 0 },
    { hour: 2, uvIndex: 0 },
    { hour: 3, uvIndex: 0 },
    { hour: 4, uvIndex: 0 },
    { hour: 5, uvIndex: 0 },
    { hour: 6, uvIndex: 1 },
    { hour: 7, uvIndex: 3 },
    { hour: 8, uvIndex: 5 },
    { hour: 9, uvIndex: 7 },
    { hour: 10, uvIndex: 9 },
    { hour: 11, uvIndex: 10 },
    { hour: 12, uvIndex: 10 },
    { hour: 13, uvIndex: 9 },
    { hour: 14, uvIndex: 7 },
    { hour: 15, uvIndex: 5 },
    { hour: 16, uvIndex: 3 },
    { hour: 17, uvIndex: 1 },
    { hour: 18, uvIndex: 0 },
    { hour: 19, uvIndex: 0 },
    { hour: 20, uvIndex: 0 },
    { hour: 21, uvIndex: 0 },
    { hour: 22, uvIndex: 0 },
    { hour: 23, uvIndex: 0 },
  ],
}

const skinToneRecommendations = {
  'dark-brown':
    'Use SPF 15+ sunscreen, but still take precautions. Wear sunglasses and a hat to protect your face. Avoid prolonged sun exposure between 10 AM and 4 PM.',
  brown:
    'Use SPF 30+ sunscreen, reapplying every two hours. Seek shade during peak UV hours and wear protective clothing, such as long sleeves and a wide-brimmed hat.',
  'light-brown':
    'Use SPF 40+ sunscreen, as your skin is more susceptible to UV damage. Apply sunscreen liberally and avoid excessive sun exposure, especially near water or sand.',
  beige:
    'Use SPF 50+ sunscreen. Your skin burns more easily, so reapply sunscreen every two hours and after swimming or sweating. Wear UV-protective clothing for extra safety.',
  fair: 'Use SPF 50+ broad-spectrum sunscreen. Your skin is highly sensitive to UV rays and prone to sunburn. Avoid the sun during peak hours, wear sunglasses, and always carry an umbrella or hat for protection.',
}

export { cancerData, uvDataByPostcode, skinToneRecommendations } // ✅ 正确的 ES 模块导出
