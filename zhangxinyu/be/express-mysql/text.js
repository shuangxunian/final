const express = require('express')
const DataBase = require('./mysql')

const text = express.Router()

text.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

text.post('/add', async (req, res) => {
  const { body } = req
  res.send({
    code: 2,
    body
  })
})

module.exports = text
