const express = require('express')
const DataBase = require('./mysql')

const food = express.Router()

food.post('/allData', async (req, res) => {
  let sql = 'select * from food_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

food.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from food_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此食材名已存在！'
    })
  } else {
    sql = `insert into food_list (id,name,energy,protein,fat,sugar) values ('${new Date().getTime()}','${body.name}','${body.energy}','${body.protein}','${body.fat}','${body.sugar}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

food.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from food_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

food.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update food_list set password = '123456' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

food.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from food_list where id='${body.id}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update food_list set password = '${body.newPwd1}' where id = '${body.id}'`
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

food.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `select * from food_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此食材名已存在！'
    })
  } else {
    sql = `update food_list set name='${body.name}', energy='${body.energy}', protein='${body.protein}', fat='${body.fat}', sugar='${body.sugar}' where id='${body.id}'`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
  // const { body } = req
  // let sql = `update food_list set username='${body.username}', roleType ='${body.roleType}' where id='${body.id}'`
  // console.log(sql)
  // const database = new DataBase()
  // await database.getSqlData(sql)
  // res.send({
  //   code: 2
  // })
})

food.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into food_list (userid,username,password,roleType) values ('${list[i].userid}','${list[i].username}','123456','2')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = food
