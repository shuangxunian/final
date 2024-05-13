const express = require('express')
const DataBase = require('./mysql')

const option = express.Router()

option.post('/allData', async (req, res) => {
  let sql = 'select * from `option_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

option.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`, `requireWord`, `wherefrom`) VALUES (?,?,?,?,?,?);'
  let data = [new Date().getTime() + '',body.userid,body.username,body.optionType,body.requireWord,body.wherefrom]
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})

module.exports = option
