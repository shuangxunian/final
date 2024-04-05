const express = require('express')
const DataBase = require('./mysql')

const info = express.Router()

info.post('/allData', async (req, res) => {
  let sql = 'select * from info_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

info.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from info_list where id='${body.id}' and password='${body.password}'`
  const addDatabase = new DataBase()
  const info = await addDatabase.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 2,
      body: info[0]
    })
  } else {
    res.send({
      code: 4,
      msg: '账号或密码有误！'
    })
  }
})

info.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from info_list where id='${body.id}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此账户已存在！'
    })
  } else {
    sql = `insert into info_list (id,name,password) values ('${body.id}','${body.name}','${body.password}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

info.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from info_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

info.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update info_list set password = '123456' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


info.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update info_list set name='${body.name}' where id = '${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = info
