const express = require('express')
const DataBase = require('./mysql')

const mytest = express.Router()

mytest.post('/allData', async (req, res) => {
  const { body } = req
  let sql = ''
  if(body.userid) {
    sql = `select * from my_test_list where userid=${body.userid}`
  } else {
    sql = `select * from my_test_list`
  }
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


mytest.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into my_test_list (id,userid,testid) values ('${new Date().getTime()}','${body.userid}', '${body.testid}')`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

mytest.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update my_test_list set course='${body.course}' where id = '${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = mytest
