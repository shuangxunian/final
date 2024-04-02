const express = require('express')
const DataBase = require('./mysql')

const talk = express.Router()

talk.post('/allData', async (req, res) => {
  let sql = 'select * from `data_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

talk.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from data_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

talk.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into data_list (id,talk,AIResult,UserResult) values ('${new Date().getTime()}','${body.talk}','${body.AIResult}','${body.UserResult}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: '添加成功！'
  })
})


talk.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update data_list set talk='${body.talk}', AIResult='${body.AIResult}', UserResult='${body.UserResult}' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: '添加成功！'
  })
})

talk.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

talk.post('/model', async (req, res) => {
  const { body } = req
  let model = body.isModel === 1 ? 0 : 1
  let sql = `update data_list set isModel='${model}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

talk.post('/login', async (req, res) => {
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

module.exports = talk
