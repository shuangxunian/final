const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const option = require('./option')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/option', option)

app.listen(3000)
console.log('服务启动成功')



