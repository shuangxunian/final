const express = require('express')
const DataBase = require('./mysql')

const myTest = express.Router()

myTest.post('/allData', async (req, res) => {
  const { body } = req
  let sql =''
  if (body.studentid) sql = `select * from my_test_list where studentid='${body.studentid}'`
  else sql = `select * from my_test_list`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  info = info.map(item => {
    item.answer = JSON.parse(item.answer)
    return item
  })
  res.send({
    code: 2,
    body: info
  })
})

myTest.post('/add', async (req, res) => {
  const { body } = req
  // let sql = `insert into test_list (id,type,name,classid,checkQuestion,textQuestion,finishNum) values ('${new Date().getTime()}','${body.type}','${body.name}','${body.classid}','${JSON.stringify(body.checkQuestionList)}','${JSON.stringify(body.textQuestionList)}','0')`
  let sql = `insert into my_test_list (id,testid,studentid,answer,status) values ('${new Date().getTime()}','${body.testid}','${body.studentid}','${JSON.stringify(body.answer)}','待评分')`
  console.log(sql)
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

myTest.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update my_test_list set grade='${body.grade}',status='已完成' where testid='${body.testid}' and studentid='${body.studentid}'`
  console.log(sql)
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

myTest.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

myTest.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set name='${body.name}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

myTest.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

myTest.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})

myTest.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into user_info (userid,username,password,roleType) values ('${list[i].userid}','${list[i].username}','123456','2')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = myTest
