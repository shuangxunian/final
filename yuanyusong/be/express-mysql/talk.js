const express = require('express')
const DataBase = require('./mysql')

const talk = express.Router()

talk.post('/allData', async (req, res) => {
  let sql = 'select * from talk_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

talk.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into talk_list (id,userid,text) values ('${new Date().getTime()}','${body.userid}','${body.text}')`
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = talk
