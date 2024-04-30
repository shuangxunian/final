const express = require('express')
const DataBase = require('./mysql')

const test = express.Router()

test.post('/allData', async (req, res) => {
  let sql = 'select * from test_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


test.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from test_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此考试名已存在！'
    })
  } else {
    sql = `insert into test_list (id,name,questionStr,knowStr) values ('${new Date().getTime()}','${body.name}','${body.questionList.join(',')}', '${body.knowList.join(',')}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

test.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from test_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update test_list set name='${body.name}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/change', async (req, res) => {
  const { body } = req
  let sql = `update test_list set isNew='${body.isNew}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update test_list set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


module.exports = test
