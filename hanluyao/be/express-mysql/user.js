const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from college_list'
  const getCollegeDatabase = new DataBase()
  let college = await getCollegeDatabase.getSqlData(sql)
  sql = 'select * from user_info'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  const body = []
  const collegeMap = {}
  college.forEach(item => {
    collegeMap[item.collegeid] = item.name
  })
  info.forEach(item => {
    const obj = {
      ...item,
      collegename: collegeMap[item.collegeid]
    }
    body.push(obj)
  })
  res.send({
    code: 2,
    body
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password='${body.password}'`
  const addDatabase = new DataBase()
  const info = await addDatabase.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 2,
      body: info[0]
    })
  } else {
    res.send({
      code: 4,
      msg: '账号或密码有误！'
    })
  }
})

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此账户已存在！'
    })
  } else {
    sql = `insert into user_info (id,name,password,roletype,collegeid,belongClass) values ('${body.id}','${body.name}','123456','${body.roletype}','${body.collegeid}','${body.belongClass}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})

user.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set name='${body.name}',belongClass='${body.belongClass}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


user.post('/changePassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update user_info set password = '${body.newPwd1}' where id = '${body.id}'`
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

module.exports = user
