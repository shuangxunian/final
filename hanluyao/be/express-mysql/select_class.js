const express = require('express')
const DataBase = require('./mysql')

const select_class = express.Router()

select_class.post('/allData', async (req, res) => {
  const { body } = req
  let sql = `select * from select_class_list where classid='${body.classid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

select_class.post('/mySelect', async (req, res) => {
  const { body } = req
  let sql = `select * from select_class_list where studentid='${body.studentid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


select_class.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into select_class_list (id,classid,studentid) values ('${new Date().getTime()}','${body.classid}','${body.studentid}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  sql = `update class_list set num=num+1 where id = '${body.classid}'`
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

select_class.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from select_class_list where classid='${body.classid}' and studentid='${body.studentid}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  sql = `update class_list set num=num-1 where id = '${body.classid}'`
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
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
