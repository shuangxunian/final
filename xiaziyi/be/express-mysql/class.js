const express = require('express')
const DataBase = require('./mysql')

const myclass = express.Router()

myclass.post('/allData', async (req, res) => {
  let sql = 'select * from class_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


myclass.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from class_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此课程已存在！'
    })
  } else {
    sql = `insert into class_list (id,name,knowID,url) values ('${new Date().getTime()}','${body.name}','${body.knowID}', '${body.url}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

myclass.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

myclass.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set name='${body.name}', knowID='${body.knowID}', url='${body.url}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


myclass.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

myclass.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update user_info set password = '${body.newPwd1}' where userid = '${body.userid}'`
    const fixDatabase = new DataBase()
    await fixDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '密码修改成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '旧密码不正确！'
    })
  }
})



myclass.post('/addList', async (req, res) => {
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

module.exports = myclass
