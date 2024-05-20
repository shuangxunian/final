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
  let sql = `select * from course_list where className='${body.className}' and teacherid='${body.teacherid}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此案例名已存在！'
    })
  } else {
    let sql = `insert into course_list (id,className,statusType,studyNum,classCourse,classCourseNum,teacherid) values ('${new Date().getTime()}','${body.className}','${body.statusType}','0','0','0','${body.teacherid}')`
    const database = new DataBase()
    await database.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
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
