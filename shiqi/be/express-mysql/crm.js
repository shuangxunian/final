const express = require('express')
const DataBase = require('./mysql')

const crm = express.Router()

crm.post('/allData', async (req, res) => {
  let sql = 'select * from `crm_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

crm.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'insert into `crm_list` (`productID`, `productLot`, `buildDate`, `endDate`, `optionNum`, `id`) VALUES (?,?,?,?,?,?)'
  let data = [body.productID,body.productLot,body.buildDate,body.endDate,body.optionNum,new Date().getTime()]
  const setDatabase = new DataBase()
  await setDatabase.getSqlData(sql, data)
  sql = `UPDATE product_list SET haveNum = haveNum + ${body.optionNum} WHERE id = ${body.productID}`
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = crm
