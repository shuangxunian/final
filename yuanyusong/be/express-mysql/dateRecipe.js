const express = require('express')
const DataBase = require('./mysql')

const dateRecipe = express.Router()

dateRecipe.post('/allData', async (req, res) => {
  let sql = 'select * from date_recipe_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

dateRecipe.post('/add', async (req, res) => {
  const { body } = req
  let sql =  `insert into date_recipe_list (id,recipeid,date,type) values ('${new Date().getTime()}','${body.recipeid}','${body.date}','${body.type}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

dateRecipe.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from date_recipe_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

dateRecipe.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update date_recipe_list set password = '123456' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

dateRecipe.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `select * from date_recipe_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此食材名已存在！'
    })
  } else {
    sql = `update date_recipe_list set name='${body.name}', energy='${body.energy}', protein='${body.protein}', fat='${body.fat}', sugar='${body.sugar}' where id='${body.id}'`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

dateRecipe.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into date_recipe_list (userid,username,password,roleType) values ('${list[i].userid}','${list[i].username}','123456','2')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = dateRecipe
