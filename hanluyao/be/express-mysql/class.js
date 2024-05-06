const express = require('express')
const DataBase = require('./mysql')

const allClass = express.Router()

allClass.post('/allData', async (req, res) => {
  let sql = 'select * from class_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

allClass.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from class_list where name='${body.name}' and teacherid='${body.teacherid}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此老师已存在此课程！'
    })
  } else {
    sql = `insert into class_list (id,name,teacherid,num) values ('${new Date().getTime()}','${body.name}','${body.teacherid}','0')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

allClass.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

allClass.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set name='${body.name}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

allClass.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

allClass.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})




allClass.post('/addList', async (req, res) => {
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

module.exports = allClass
