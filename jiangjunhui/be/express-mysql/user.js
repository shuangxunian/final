const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into user_list (id, name, email) values ('${new Date().getTime() + ''}','${body.name}','${body.email}')`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_list set name='${body.name}', email='${body.email}' where id='${body.id}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

module.exports = user
