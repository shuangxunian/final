const express = require('express')
const DataBase = require('./mysql')

const mySelectClass = express.Router()

mySelectClass.post('/allData', async (req, res) => {
  const { body } = req
  let sql = ''
  if(body.userid) {
    sql = `select * from my_class_list where userid=${body.userid}`
  } else {
    sql = `select * from my_class_list`
  }
  // let sql = `select * from my_class_list where userid='${body.userid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

mySelectClass.post('/add', async (req, res) => {
  const { body } = req
  let info = []
  for (let i = 0; i < body.knowid.length; i++) {
    let sql = `select * from class_list where knowID='${body.knowid[i]}'`
    const findDatabase = new DataBase()
    const nowClass = await findDatabase.getSqlData(sql)
    if (nowClass.length !== 0) {
      info.push(nowClass[0])
    }
  }
  for (let i = 0; i < info.length; i++) {
    let sql = `insert into my_class_list (id,userid,classid,status) values ('${new Date().getTime()}','${body.userid}','${info[i].id}', '未学')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

mySelectClass.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update my_class_list set status='${body.status}' where id='${body.id}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = mySelectClass
