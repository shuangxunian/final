const express = require('express')
const DataBase = require('./mysql')

const college = express.Router()

college.post('/allData', async (req, res) => {
  let sql = 'select * from college_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

college.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from college_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此系已存在！'
    })
  } else {
    sql = `insert into college_list (collegeid,name) values ('${new Date().getTime()}','${body.name}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

college.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from college_list where collegeid='${body.collegeid}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

college.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update college_list set name='${body.name}' where collegeid = '${body.collegeid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = college
