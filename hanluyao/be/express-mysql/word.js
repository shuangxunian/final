const express = require('express')
const DataBase = require('./mysql')

const word = express.Router()

word.post('/allData', async (req, res) => {
  let sql = 'select * from college_list'
  const getCollegeDatabase = new DataBase()
  let college = await getCollegeDatabase.getSqlData(sql)
  sql = 'select * from class_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  const body = []
  const collegeMap = {}
  college.forEach(item => {
    collegeMap[item.collegeid] = item.name
  })
  info.forEach(item => {
    const obj = {
      ...item,
      collegename: collegeMap[item.collegeid]
    }
    body.push(obj)
  })

  res.send({
    code: 2,
    body,
  })
})

word.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from class_list where classname='${body.classname}' and collegeid='${body.collegeid}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此学院已存在此课程！'
    })
  } else {
    sql = `insert into class_list (classid,collegeid,classname,needwordnum) values ('${new Date().getTime()}','${body.collegeid}','${body.classname}','${body.needwordnum}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

word.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where classid='${body.classid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

word.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set collegeid='${body.collegeid}',classname='${body.classname}',needwordnum='${body.needwordnum}' where classid = '${body.classid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = word
