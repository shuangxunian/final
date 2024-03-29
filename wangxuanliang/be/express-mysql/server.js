const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const location = require('./location')
const workServer = require('./workServer')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/location', location)
app.use('/workServer', workServer)

app.listen(3000)
console.log('服务启动成功')



