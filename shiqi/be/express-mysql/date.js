const express = require('express')
const DataBase = require('./mysql')

const date = express.Router()

date.post('/allData', async (req, res) => {
  let sql = 'select * from `date_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

date.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into date_list (date, id) VALUES ('${body.date}', '${new Date().getTime()}')`
  const setDatabase = new DataBase()
  await setDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

date.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from date_list where id='${body.id}'`
  const setDatabase = new DataBase()
  await setDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

date.post('/today', async (req, res) => {
  const { body } = req
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const str = `${year}-${month}-${day}`
  // console.log(str)
  let sql = `select * from date_list where date='${str}'`
  const Database = new DataBase()
  const info = await Database.getSqlData(sql)
  if (info.length === 0) {
    res.send({
      code: 2,
    })
  } else {
    res.send({
      code: 2,
      info
    })
  }

})

module.exports = date
