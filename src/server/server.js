import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
