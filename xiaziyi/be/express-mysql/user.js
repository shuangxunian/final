const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from user_info'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='admin'`
  const findDatabase = new DataBase()
  const obj = await findDatabase.getSqlData(sql)
  sql = `select * from user_info where id='${body.id}' and password='${body.password}'`
  const addDatabase = new DataBase()
  const info = await addDatabase.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 2,
      body: {
        ...info[0],
        sysTestType: obj[0].sysTestType
      }
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
    sql = `insert into user_info (id,name,joinyear,password,roleType,master) values ('${body.id}','${body.name}','${body.joinyear}','${body.password}','${body.roleType}','${body.master}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    console.log(new Date().getFullYear())
    sql = `select * from user_info where id='admin'`
    const findDatabase = new DataBase()
    const obj = await findDatabase.getSqlData(sql)
    console.log(obj[0].sysTestType === 1)
    console.log(Number(new Date().getFullYear()) - Number(body.joinyear) < 3)
    if (obj[0].sysTestType === 1 && Number(new Date().getFullYear()) - Number(body.joinyear) < 3) {
      sql = 'select * from test_list'
      const testDatabase = new DataBase()
      const testList = await testDatabase.getSqlData(sql)
      for (let i = 0; i < testList.length; i++) {
        if (testList[i].isNew === 'true') {
          sql = `insert into my_test_list (id,userid,testid) values ('${new Date().getTime()}','${body.id}', '${testList[i].id}')`
          console.log(sql)
          const addTestDatabase = new DataBase()
          await addTestDatabase.getSqlData(sql)
        }
      }
    }
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

user.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set name='${body.name}', joinyear ='${body.joinyear}' where id='${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/change', async (req, res) => {
  const { body } = req
  let sql = `update user_info set sysTestType='${body.value}' where id = 'admin'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/addList', async (req, res) => {
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

module.exports = user
