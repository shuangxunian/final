const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `id`= ? and `password`= ?'
  let data = [body.id, body.password]
  const database = new DataBase()
  let info = await database.getSqlData(sql, data)
  if (info.length !== 0) {
    res.send({
      code: 2,
    })
  } else {
    res.send({
      code: 5,
    })
  }
})

user.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `id`= ?'
  let data = [body.id]
  const database = new DataBase()
  let info = await database.getSqlData(sql, data)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此账号已注册，请直接登陆！'
    })
  } else {
    sql = 'INSERT INTO `user_info` (`id`,`username`, `password`) VALUES (?,?,?);'
    data = [body.id,body.username,body.password]
    const addUserBase = new DataBase()
    info = await addUserBase.getSqlData(sql, data)
    res.send({
      code: 2,
      msg: '注册成功！'
    })
  }
})

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'delete from `user_info` where `username`=?'
  let data = [body.username]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '删除成功！'
  })
})
user.post('/fixpwd', async (req, res) => {
  const { body } = req
  let sql = 'update `user_info` set `password`=? where `username`=?'
  let data = ['123456', body.username]
  const database = new DataBase()
  await database.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: '重置成功！'
  })
})

module.exports = user
