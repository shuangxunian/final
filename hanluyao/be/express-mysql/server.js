const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const college = require('./college')
const allClass = require('./class')
const word = require('./word')
// const test = require('./test')
// const select_class = require('./select_class')
// const talking = require('./talking')
// const myTest = require('./myTest')

app.use(bodyParser.json())

app.use('/user', user)
app.use('/college', college)
app.use('/class', allClass)
app.use('/word', word)

app.listen(3000)
console.log('服务启动成功')



