const express = require('express')
const DataBase = require('./mysql')

const product = express.Router()

product.post('/allData', async (req, res) => {
  let sql = 'select * from `product_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

product.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'select * from `product_list` where `name`= ? and `belong`= ?'
  let data = [body.name,body.belong]
  const database = new DataBase()
  let info = await database.getSqlData(sql, data)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此厂家生成的此药已存在，请检查！'
    })
  } else {
    sql = 'select * from `product_list`'
    const getDatabase = new DataBase()
    info = await getDatabase.getSqlData(sql)
    if (info.length === 0) {
      body.id = 0
    } else {
      body.id = info[info.length - 1].id + 1
    }
    sql = 'INSERT INTO `product_list` (`name`, `belong`, `haveNum`, `id`) VALUES (?,?,?,?);'
    data = [body.name,body.belong,0,body.id]
    const setDatabase = new DataBase()
    await setDatabase.getSqlData(sql, data)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

module.exports = product
