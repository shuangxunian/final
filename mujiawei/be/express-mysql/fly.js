const express = require('express')
const DataBase = require('./mysql')

const fly = express.Router()

fly.post('/allData', async (req, res) => {
  let sql = 'select * from fly_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

fly.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from fly_list where id='${body.id}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此编号已存在！'
    })
  } else {
    sql = `insert into fly_list (id,belong,power,maxWeight,workTime,status) values ('${body.id}','${body.belong}','${body.power}','${body.maxWeight}','${body.workTime}', 0)`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

fly.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update fly_list set belong='${body.belong}', power ='${body.power}', maxWeight ='${body.maxWeight}', workTime ='${body.workTime}' where id = '${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

fly.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from fly_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

fly.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

fly.post('/fixPassword', async (req, res) => {
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

fly.post('/addList', async (req, res) => {
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

module.exports = fly
