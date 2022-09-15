const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const assetRouter = require('./routers/asset')
const userRouter = require('./routers/user')

const app = express()
app.use(express.json())
app.use(cors())
app.use(assetRouter)
app.use(userRouter)

module.exports = app

