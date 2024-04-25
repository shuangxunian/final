const express = require('express')
const DataBase = require('./mysql')

const select_class = express.Router()

select_class.post('/allData', async (req, res) => {
  const { body } = req
  let sql = `select * from test_list where classid='${body.classid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  info = info.map(item => {
    item.checkQuestion = JSON.parse(item.checkQuestion)
    item.textQuestion = JSON.parse(item.textQuestion)
    return item
  })
  res.send({
    code: 2,
    body: info
  })
})

select_class.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into test_list (id,type,name,classid,checkQuestion,textQuestion,finishNum) values ('${new Date().getTime()}','${body.type}','${body.name}','${body.classid}','${JSON.stringify(body.checkQuestionList)}','${JSON.stringify(body.textQuestionList)}','0')`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
  // let sql = `select * from class_list where name='${body.name}' and teacherid='${body.teacherid}'`
  // const database = new DataBase()
  // const info = await database.getSqlData(sql)
  // if (info.length) {
  //   res.send({
  //     code: 4,
  //     msg: '此老师已存在此课程！'
  //   })
  // } else {
  //   sql = `insert into class_list (id,name,teacherid,num) values ('${new Date().getTime()}','${body.name}','${body.teacherid}','0')`
  //   const addDatabase = new DataBase()
  //   await addDatabase.getSqlData(sql)
  //   res.send({
  //     code: 2,
  //     msg: ''
  //   })
  // }
})

select_class.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

select_class.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set name='${body.name}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

select_class.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

select_class.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})




select_class.post('/addList', async (req, res) => {
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

module.exports = select_class
