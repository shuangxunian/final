const express = require('express')
const DataBase = require('./mysql')

const location = express.Router()

location.post('/allData', async (req, res) => {
  let sql = 'select * from `location_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

location.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from location_list where name='${body.name}' and server='${body.server}'`
  const findDatabase = new DataBase()
  let info = await findDatabase.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此服务商在此地已能提供服务，请勿重复添加！'
    })
  } else {
    sql = `insert into location_list (id, name, server, location) values ('${new Date().getTime() + ''}','${body.name}','${body.server}','${body.location}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '创建成功！'
    })
  }
})

location.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from location_list where id='${body.id}'`
  const delDatabase = new DataBase()
  await delDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '创建成功！'
  })
})
module.exports = location
