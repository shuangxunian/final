const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const know = require('./know')
const user = require('./user')
const myClass = require('./class')
const question = require('./question')
const test = require('./test')
const mytest = require('./mytest')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/know', know)
app.use('/class', myClass)
app.use('/question', question)
app.use('/test', test)
app.use('/mytest', mytest)

app.listen(3000)
console.log('服务启动成功')



