const express = require('express')
const DataBase = require('./mysql')

const title = express.Router()

title.post('/allData', async (req, res) => {
  let sql = 'select * from `title_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

title.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where userid='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

title.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from title_list where title='${body.title}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此标签已存在，请重新输入！'
    })
  } else {
    sql = `insert into title_list (id,title) values ('${new Date().getTime()}','${body.title}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '添加成功！'
    })
  }

})

title.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update title_list set title ='${body.title}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

title.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

title.post('/login', async (req, res) => {
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

module.exports = title
