const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(cors())

const user = require('./user')
const product = require('./product')
const black = require('./black')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/product', product)
app.use('/black', black)

app.listen(3000)
console.log('服务启动成功')



