const express = require('express')
const DataBase = require('./mysql')
const getId = require('./api')

const data = express.Router()

data.post('/get', async (req, res) => {
  const { body } = req
  const data = await getId(body.bv)
  if (data.code === 0) {
    let comments = data.data.replies;
    let count = data.data.page.count;
    let fetching = false;
    res.send({
      code: 2,
      body: {
        comments,
        count,
        fetching
      }
    })
  } else {
    res.send({
      code: 4,
      msg: '获取失败！'
    })
  }
})

data.post('/allData', async (req, res) => {
  let sql = 'select * from data_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

data.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from data_list where talk='${body.talk}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '有完全一样文本存在！'
    })
  } else {
    sql = `insert into data_list (id,talk,status) values ('${new Date().getTime()}','${body.talk}','${body.status}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

data.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from data_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

data.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update data_list set talk='${body.talk}', status='${body.status}' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

data.post('/fixPassword', async (req, res) => {
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

data.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set username='${body.username}', roleType ='${body.roleType}' where userid = '${body.userid}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})



data.post('/addList', async (req, res) => {
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

module.exports = data
