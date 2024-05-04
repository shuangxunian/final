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
  let sql = `select * from user_info where id='${body.id}' and password='${body.password}'`
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
  let sql = `delete from user_info where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update user_info set password = '${body.newPwd1}' where id = '${body.id}'`
    const fixDatabase = new DataBase()
    await fixDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '密码修改成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '旧密码不正确！'
    })
  }
})

user.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set username='${body.username}' where id = '${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此账户已存在！'
    })
  } else {
    sql = `insert into user_info (id,username,password) values ('${body.id}','${body.username}','${body.password}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

module.exports = user
