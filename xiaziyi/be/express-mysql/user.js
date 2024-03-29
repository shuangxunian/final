// 头文件 获取服务器和数据库模块
const express = require('express')
const DataBase = require('./mysql')

// 定义路由名称
const user = express.Router()

// 对应子路由 post请求 async (req, res)为拿到的数据
user.post('/allData', async (req, res) => {
  // sql语句
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  // 向数据库发请求，拿到返回值，定义成info
  let info = await database.getSqlData(sql)
  const body = []
  // 便利info这个数组，获取每个对象，并push到body这个数组里面
  info.forEach(item => {
    if (item.role) {
      body.push({
        userid: item.userid,
        usetime: item.usetime
      })
    }
  });
  // 发送给前端
  res.send({
    code: 2,
    body
  })
})

// 暴露给server.js文件
module.exports = user
