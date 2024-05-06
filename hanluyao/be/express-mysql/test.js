const express = require('express')
const DataBase = require('./mysql')

const test = express.Router()

test.post('/allData', async (req, res) => {
  const { body } = req
  let sql = `select * from test_list where classid='${body.classid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  info = info.map(item => {
    item.checkQuestionList = JSON.parse(item.checkQuestion)
    item.textQuestionList = JSON.parse(item.textQuestion)
    return item
  })
  res.send({
    code: 2,
    body: info
  })
})

test.post('/add', async (req, res) => {
  const { body } = req
  let sql = ''
  sql = `insert into test_list (id,type,name,classid,checkQuestion,textQuestion,finishNum) values ('${new Date().getTime()}','${body.type}','${body.name}','${body.classid}','${JSON.stringify(body.checkQuestionList)}','${JSON.stringify(body.textQuestionList)}','0')`
  const database = new DataBase()
  await database.getSqlData(sql)
  if (body.type === '1') {
    sql = `update class_list set homeworkNum=homeworkNum + 1 where id='${body.classid}'`
  } else {
    sql = `update class_list set testNum=testNum + 1 where id='${body.classid}'`
  }
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

test.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update test_list set type='${body.type}',name='${body.name}',classid='${body.classid}',checkQuestion='${JSON.stringify(body.checkQuestionList)}',textQuestion='${JSON.stringify(body.textQuestionList)}',finishNum='${body.finishNum}' where id = '${body.id}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

test.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set name='${body.name}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

test.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})




test.post('/addList', async (req, res) => {
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

module.exports = test
