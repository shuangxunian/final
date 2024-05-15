const express = require('express')
const DataBase = require('./mysql')

const need = express.Router()

need.post('/allData', async (req, res) => {
  let sql = 'select * from need_list'
  const getCollegeDatabase = new DataBase()
  let college = await getCollegeDatabase.getSqlData(sql)
  // sql = 'select * from class_list'
  // const database = new DataBase()
  // let info = await database.getSqlData(sql)
  // const body = []
  // const collegeMap = {}
  // college.forEach(item => {
  //   collegeMap[item.collegeid] = item.name
  // })
  // info.forEach(item => {
  //   const obj = {
  //     ...item,
  //     collegename: collegeMap[item.collegeid]
  //   }
  //   body.push(obj)
  // })
  // console.log(body)

  res.send({
    code: 2,
    body: college,
  })
})

need.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into need_list (needid,classid,needwordnum,needname) values ('${new Date().getTime()}','${body.classid}','${body.needwordnum}','${body.needname}')`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

need.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from need_list where needid='${body.needid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

need.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update need_list set classid='${body.classid}',needname='${body.needname}',needwordnum='${body.needwordnum}' where needid = '${body.needid}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

need.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

need.post('/fixPassword', async (req, res) => {
  const { body } = req
  sql = `update user_info set password='123456' where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: '密码修改成功！'
  })
})




need.post('/addList', async (req, res) => {
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

module.exports = need
