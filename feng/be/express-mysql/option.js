const express = require('express')
const DataBase = require('./mysql')
const axios = require("axios");
const option = express.Router()

option.post('/allData', async (req, res) => {
  let sql = 'select * from user_info'
  const userDatabase = new DataBase()
  const userList = await userDatabase.getSqlData(sql)
  const userMap = {}
  userList.forEach(item => {
    userMap[item.id] = item.username
  })
  sql = 'select * from option_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  const body = []
  info.forEach(item => {
    body.push({
      ...item,
      username: userMap[item.userid]
    })
  })
  res.send({
    code: 2,
    body
  })
})

option.post('/getImgData', async (req, res) => {
  const { body } = req
  const data = await axios.post('http://127.0.0.1:5000/airesult' + body.model, {
    body: body
  })
  const aiUrl = 'https://sxntest.oss-cn-beijing.aliyuncs.com/' + data.data
  let sql = `insert into option_list (id,userid,leftUrl,rightUrl,aiUrl) values ('${new Date().getTime()}','${body.id}','${body.leftUrl}','${body.rightUrl}','${aiUrl}')`
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql)
  sql = `update user_info set num=num-1 where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    body: aiUrl
  })
})


option.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into option_list (id,begin,end,IDCard,status,item,weight) values ('${new Date().getTime()}','${body.begin}','${body.end}','${body.id}','待装货','${body.item}','${body.weight}')`
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql)
  sql = `update fly_list set status=1 where id='${body.id}'`
  const fixDatabase = new DataBase()
  await fixDatabase.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })

})

option.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此账户已存在！'
    })
  } else {
    sql = `insert into user_info (userid,username,password,roleType) values ('${body.userid}','${body.username}','${body.password}','${body.roleType}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

module.exports = option
