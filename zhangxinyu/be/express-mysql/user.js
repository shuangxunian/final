const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `userid`= ?'
  let data = [body.userid]
  const haveDatabase = new DataBase()
  const info = await haveDatabase.getSqlData(sql, data)
  if (info.length !== 0) {
    return res.send({
      code: 4,
      msg: '此账号已存在！'
    })
  }
  const nowTime = new Date().getTime() + ''
  sql = 'INSERT INTO `user_info` (`userid`, `username`, `password`, `optionTime`, `buildDate`) VALUES (?,?,?,?,?);'
  data = [body.userid,body.username,body.password,0,nowTime]
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql, data)
  sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`) VALUES (?,?,?,?,?);'
  data = [nowTime,body.userid,body.username,'注册']
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: ''
  })
})


user.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'DELETE FROM user_info WHERE userid = ?;'
  let data = [body.userid]
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql, data)
  sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`) VALUES (?,?,?,?,?);'
  data = [new Date().getTime() + '',body.user,'admin',body.username,'删除']
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: ''
  })
})

user.post('/fix', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `userid`= ?'
  let data = [body.userid]
  const addDatabase = new DataBase()
  const info = await addDatabase.getSqlData(sql, data)
  if (info.length === 0) {
    return res.send({
      code: 4,
      msg: '查无此人！'
    })
  }
  if (body.password === '123456') {
    sql = 'update `user_info` set `password`=? where `userid`= ?'
    data = ['123456', body.userid]
  } else {
    sql = 'update `user_info` set `username`=? where `userid`= ?'
    data = [body.username, body.userid]
  }
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: ''
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `userid`= ? and `password`= ?'
  let data = [body.userid,body.password]
  const addDatabase = new DataBase()
  const info = await addDatabase.getSqlData(sql, data)
  if (info.length) {
    sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`) VALUES (?,?,?,?,?);'
    data = [new Date().getTime() + '',body.userid,info[0].username,'登录']
    const addOptionDatabase = new DataBase()
    await addOptionDatabase.getSqlData(sql, data)
    res.send({
      code: 2,
      msg: ''
    })
  } else {
    res.send({
      code: 4,
      msg: '账号或密码有误！'
    })
  }
})

module.exports = user
