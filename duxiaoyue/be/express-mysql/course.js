const express = require('express')
const DataBase = require('./mysql')

const course = express.Router()

course.post('/allData', async (req, res) => {
  let sql = 'select * from course_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


course.post('/del', async (req, res) => {
  const { body } = req
  console.log(body)
  let sql = `delete from course_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

course.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update course_list set className='${body.className}',teacherid='${body.teacherid}' where id='${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

course.post('/accept', async (req, res) => {
  const { body } = req
  let sql = `update course_list set statusType='2' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

course.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into course_list (id,className,statusType,teacherid) values ('${new Date().getTime()}','${body.className}','${body.statusType}','${body.teacherid}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

course.post('/addList', async (req, res) => {
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

module.exports = course
