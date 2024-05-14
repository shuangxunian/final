const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const option = require('./option')
const info = require('./info')
const reg = require('./reg')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/option', option)
app.use('/info', info)
app.use('/reg', reg)

app.listen(3000)
console.log('服务启动成功')



