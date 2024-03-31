const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from user_info'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}' and password='${body.password}'`
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

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where userid='${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set username='${body.username}', roleType ='${body.roleType}' where userid = '${body.userid}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此账户已存在！'
    })
  } else {
    sql = `insert into user_info (userid,username,password,roleType) values ('${body.userid}','${body.username}','${body.password}','${body.roleType}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

module.exports = user
