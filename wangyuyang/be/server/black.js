const express = require('express')
const DataBase = require('./mysql')

const black = express.Router()

black.post('/adminAll', async (req, res) => {
  const { body } = req
  let sql = `select * from black_list`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  console.log(info)
  res.send({
    code: 2,
    body: info
  })
})

black.post('/allData', async (req, res) => {
  const { body } = req
  let sql = `select * from black_list where userid='${body.userid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

black.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into black_list (id,userid,productid) values ('${new Date().getTime()}','${body.userid}','${body.productid}')`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

black.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from black_list where id='${body.id}'`
  // let sql = 'delete from `black_info` where `username`=?'
  let data = [body.username]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '删除成功！'
  })
})

module.exports = black
