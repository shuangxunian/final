const express = require('express')
const DataBase = require('./mysql')

const regList = express.Router()

regList.post('/allData', async (req, res) => {
  let sql = 'select * from reg_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

regList.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into reg_list (id, name, reg, type) values ("${new Date().getTime() + ''}","${body.name}","${body.reg}","${body.type}")`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

regList.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update reg_list set name="${body.name}", reg="${body.reg}", type="${body.type}" where id="${body.id}"`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

regList.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from reg_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = regList
