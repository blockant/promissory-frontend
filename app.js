const express = require('express')
const cors = require('cors')
require('./src/db/mongoose')
const assetRouter = require('./src/routers/asset')
const userRouter = require('./src/routers/user')

const app = express()
app.use(express.json())
app.use(cors())
app.use(assetRouter)
app.use(userRouter)

module.exports = app

