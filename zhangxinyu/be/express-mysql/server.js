const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const text = require('./text')
const text1 = require('./text1')
const text2 = require('./text2')
const text3 = require('./text3')
const text4 = require('./text4')
const option = require('./option')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/text', text)
app.use('/text1', text1)
app.use('/text2', text2)
app.use('/text3', text3)
app.use('/text4', text4)
app.use('/option', option)

app.listen(3000)
console.log('服务启动成功')



