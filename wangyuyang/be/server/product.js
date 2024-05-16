const express = require('express')
const DataBase = require('./mysql')

const product = express.Router()

product.post('/allData', async (req, res) => {
  let sql = 'select * from `product_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

product.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `product_info` (`productName`, `brand`, `kind`, `isOil`, `isAllergy`, `isAge`, `isPigmentation`, `isWrinkle`, `id`) VALUES (?,?,?,?,?,?,?,?,?);'
  let data = [body.productName,body.brand,body.kind,body.isOil,body.isAllergy,body.isAge,body.isPigmentation,body.isWrinkle,body.id]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '添加成功！'
  })
})

product.post('/fix', async (req, res) => {
  const { body } = req
  let sql = 'update `product_info` set `productName`=?, `brand`=?, `kind`=?, `isOil`=?, `isAllergy`=?, `isAge`=?, `isPigmentation`=?, `isWrinkle`=? where `id`=?'
  let data = [body.productName,body.brand,body.kind,body.isOil,body.isAllergy,body.isAge,body.isPigmentation,body.isWrinkle,body.id]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '添加成功！'
  })
})

product.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'delete from `product_info` where `id`=?'
  console.log(body)
  let data = [body.id]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '删除成功！'
  })
})

module.exports = product
