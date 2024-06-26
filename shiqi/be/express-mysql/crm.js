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
  let sql = 'insert into `crm_list` (`productID`, `productLot`, `buildDate`, `endDate`, `optionNum`, `id`,`nowNum`) VALUES (?,?,?,?,?,?,?)'
  let data = [body.productID,body.productLot,body.buildDate,body.endDate,body.optionNum,new Date().getTime(),body.optionNum]
  const setDatabase = new DataBase()
  await setDatabase.getSqlData(sql, data)
  sql = `UPDATE product_list SET haveNum = haveNum + ${body.optionNum} WHERE id = ${body.productID}`
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
  sql = `insert into option_list (id, userid, optionType,productname,productbelong,productLot,optionNum) values ('${new Date().getTime()}','${body.userid}','入库','${body.productname}','${body.productbelong}','${body.productLot}','${body.optionNum}')`
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = crm
