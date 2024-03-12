const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express()
app.use(cors())

const user = require('./user')
const product = require('./product')
const crm = require('./crm')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/product', product)
app.use('/crm', crm)

app.listen(3000)
console.log('服务启动成功')


