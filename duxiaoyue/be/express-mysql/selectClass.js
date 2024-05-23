const express = require('express')
const DataBase = require('./mysql')

const selectClass = express.Router()

// selectClass.post('/allData', async (req, res) => {
//   let sql = 'select * from ppt_list'
//   const database = new DataBase()
//   let info = await database.getSqlData(sql)
//   res.send({
//     code: 2,
//     body: info
//   })
// })

selectClass.post('/mylist', async (req, res) => {
  const { body } = req
  let sql = `select * from select_class_list where userid='${body.userid}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

selectClass.post('/star', async (req, res) => {
  const { body } = req
  let sql = ''
  let sql1= ''
  if (body.flag) {
    sql = `insert into select_class_list (id,userid,classid,myselfClassCourse) values ('${new Date().getTime()}','${body.userid}','${body.classid}',0)`
    sql1 = `update course_list set studyNum=studyNum+1 where id='${body.classid}'`
  } else {
    sql = `delete from select_class_list where userid='${body.userid}' and classid='${body.classid}'`
    sql1 = `update course_list set studyNum=studyNum-1 where id='${body.classid}'`
  }
  const database = new DataBase()
  await database.getSqlData(sql)
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql1)
  res.send({
    code: 2,
    msg: ''
  })
})

selectClass.post('/setCourse', async (req, res) => {
  const { body } = req
  console.log(body)
  let sql = `update select_class_list set myselfClassCourse='${body.classCourse}' where userid='${body.userid}' and classid='${body.classid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  sql = `select * from course_list where id='${body.classid}'`
  const getDatabase = new DataBase()
  const info = await getDatabase.getSqlData(sql)
  const obj = info[0]
  let newClassCourseNum = obj.classCourseNum + 1
  let newClassCourse = ((obj.classCourse * obj.classCourseNum + body.classCourse) / newClassCourseNum).toFixed(2)
  sql = `update course_list set classCourse='${newClassCourse}', classCourseNum='${newClassCourseNum}' where id='${body.classid}'`
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)
  res.send({
    code: 2,
  })
})
module.exports = selectClass
