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

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where id='${body.id}'`
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
  let info = await database.getSqlData(sql)
  if (info.length === 0) {
    sql = `insert into user_info (id,username,password,optionTime,roleType) values ('${body.id}','${body.username}','${body.password}','0','1')`
    const addDataBase = new DataBase()
    await addDataBase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '添加成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '该id已存在！'
    })
  }
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password= '${body.oldPassword}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if(info.length !== 0) {
    sql = `update user_info set password='${body.newPassword}' where id='${body.id}'`
    res.send({
      code: 2
    })
  } else {
    res.send({
      code: 4,
      msg: '旧密码错误，请检查！'
    })
  }
})

user.post('/fixName', async (req, res) => {
  const { body } = req
  let sql = `update user_info set username='${body.username}' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password= '${body.password}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    res.send({
      code: 2,
      body: info[0],
      msg: '登录成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '账号或密码错误，请检查！'
    })
  }
})

module.exports = user
