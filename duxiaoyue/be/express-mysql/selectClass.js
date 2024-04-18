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
    sql = `insert into select_class_list (id,userid,classid) values ('${new Date().getTime()}','${body.userid}','${body.classid}')`
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

// selectClass.post('/detail', async (req, res) => {
//   const { body } = req
//   let sql = `select * from ppt_list where courseid=${body.courseid}`
//   const database = new DataBase()
//   let info = await database.getSqlData(sql)
//   res.send({
//     code: 2,
//     body: info
//   })
// })

// selectClass.post('/del', async (req, res) => {
//   const { body } = req
//   let sql = `delete from ppt_list where id='${body.id}'`
//   const database = new DataBase()
//   await database.getSqlData(sql)
//   res.send({
//     code: 2
//   })
// })

// selectClass.post('/fix', async (req, res) => {
//   const { body } = req
//   let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
//   const database = new DataBase()
//   await database.getSqlData(sql)
//   res.send({
//     code: 2
//   })
// })

// selectClass.post('/fixPassword', async (req, res) => {
//   const { body } = req
//   let sql = `select * from user_info where userid='${body.userid}' and password='${body.oldPwd}'`
//   const findDatabase = new DataBase()
//   const info = await findDatabase.getSqlData(sql)
//   if (info.length) {
//     sql = `update user_info set password = '${body.newPwd1}' where userid = '${body.userid}'`
//     const fixDatabase = new DataBase()
//     await fixDatabase.getSqlData(sql)
//     res.send({
//       code: 2,
//       msg: '密码修改成功！'
//     })
//   } else {
//     res.send({
//       code: 4,
//       msg: '旧密码不正确！'
//     })
//   }
// })

// selectClass.post('/edit', async (req, res) => {
//   const { body } = req
//   let sql = `update ppt_list set name='${body.name}',docUrl='${body.docUrl}',mp4Url='${body.mp4Url}',courseid='${body.courseid}',know='${body.know}' where id='${body.id}'`
//   const database = new DataBase()
//   await database.getSqlData(sql)
//   res.send({
//     code: 2
//   })
// })

// selectClass.post('/add', async (req, res) => {
//   const { body } = req
//   // '${new Date().getTime()}',
//   let sql = `insert into ppt_list (id,name,docUrl,mp4Url,courseid,know) values ('${new Date().getTime()}','${body.name}','${body.docUrl}','${body.mp4Url}','${body.courseid}','${body.know}')`
//   const database = new DataBase()
//   await database.getSqlData(sql)
//   res.send({
//     code: 2,
//     msg: ''
//   })
// })

// selectClass.post('/addList', async (req, res) => {
//   const { body } = req
//   const list = body.list
//   for (let i = 0; i < list.length; i++) {
//     let sql = `insert into user_info (userid,username,password,roleType) values ('${list[i].userid}','${list[i].username}','123456','2')`
//     const database = new DataBase()
//     await database.getSqlData(sql)
//   }
//   res.send({
//     code: 2,
//     msg: ''
//   })
// })

module.exports = selectClass
