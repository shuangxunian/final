const express = require('express')
const DataBase = require('./mysql')

const recipe = express.Router()

recipe.post('/allData', async (req, res) => {
  let sql = 'select * from recipe_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  info = info.map(item => {
    item.needFood = JSON.parse(item.needFood)
    return item
  })
  res.send({
    code: 2,
    body: info
  })
})

recipe.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from recipe_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此食材名已存在！'
    })
  } else {
    // JSON.stringify
    sql = `insert into recipe_list (id,name,needFood,ingredient,energy,protein,fat,sugar) values ('${new Date().getTime()}','${body.name}','${JSON.stringify(body.needFood)}','${body.ingredient}','${body.energy}','${body.protein}','${body.fat}','${body.sugar}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

recipe.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from recipe_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

recipe.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `select * from recipe_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此食材名已存在！'
    })
  } else {
    sql = `update recipe_list set name='${body.name}', needFood='${JSON.stringify(body.needFood)}', ingredient='${body.ingredient}', energy='${body.energy}', protein='${body.protein}', fat='${body.fat}', sugar='${body.sugar}' where id='${body.id}'`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

module.exports = recipe
