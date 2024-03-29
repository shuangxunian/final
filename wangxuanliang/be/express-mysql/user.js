const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}' and password=${body.password}`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length === 1) {
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

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此账号已存在，请登录！'
    })
  } else {
    sql = `insert into user_info (userid, username, password, roleType, belong) values ('${body.userid}','${body.username}','${body.password}','${body.roleType}','${body.belong}')`
    const addUserDatabase = new DataBase()
    await addUserDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '创建成功！'
    })
  }
})

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where userid='${body.userid}'`
  const delDatabase = new DataBase()
  await delDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '创建成功！'
  })
})

user.post('/edit', async (req, res) => {
  const { body } = req
  console.log(body)
  let sql = `update user_info set username='${body.username}', belong='${body.belong}' where userid='${body.userid}'`
  const delDatabase = new DataBase()
  await delDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '修改成功！'
  })
})

user.post('/fixpassword', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password='123456' where userid='${body.userid}'`
  const delDatabase = new DataBase()
  await delDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '重置成功！'
  })
})

user.post('/fixname', async (req, res) => {
  const { body } = req
  let sql = `update user_info set username='${body.username}' where userid='${body.userid}'`
  const delDatabase = new DataBase()
  await delDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '重置成功！'
  })
})

module.exports = user
