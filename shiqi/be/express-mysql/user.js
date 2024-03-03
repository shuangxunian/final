const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  const body = []
  info.forEach(item => {
    if (item.role) {
      body.push({
        userid: item.userid,
        usetime: item.usetime
      })
    }
  });
  res.send({
    code: 2,
    body
  })
})

user.post('/login', async (req, res) => {
  const { body } = req
  let sql = 'select * from `user_info` where `name`= ? and `password`= ?'
  let data = [body.userName,body.password]
  const database = new DataBase()
  let info = await database.getSqlData(sql, data)
  if (info.length !== 0) {
    res.send({
      code: 2,
      msg: '登录成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '账号或密码错误，请检查！'
    })
  }
})

module.exports = user
