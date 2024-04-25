const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const allClass = require('./class')
const test = require('./test')
const select_class = require('./select_class')
const talking = require('./talking')

app.use(bodyParser.json())

app.use('/user', user)
app.use('/class', allClass)
app.use('/test', test)
app.use('/select_class', select_class)
app.use('/talking', talking)

app.listen(3000)
console.log('服务启动成功')



