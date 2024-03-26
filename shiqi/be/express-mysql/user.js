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
  let sql = 'INSERT INTO `user_info` (`id`, `name`, `password`, `optionTime`, `imgUrl`) VALUES (?,?,?,?,?);'
  let data = [body.id,body.name,body.password,0,body.imgUrl]
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    msg: ''
  })
  // let sql = 'select * from `user_info` where `name`= ? and `belong`= ?'
  // let data = [body.name,body.belong]
  // const database = new DataBase()
  // let info = await database.getSqlData(sql, data)
  // if (info.length !== 0) {
  //   res.send({
  //     code: 4,
  //     msg: '此厂家生成的此药已存在，请检查！'
  //   })
  // } else {
  //   sql = 'select * from `product_list`'
  //   const getDatabase = new DataBase()
  //   info = await getDatabase.getSqlData(sql)
  //   if (info.length === 0) {
  //     body.id = 0
  //   } else {
  //     body.id = info[info.length - 1].id + 1
  //   }
  //   sql = 'INSERT INTO `product_list` (`name`, `belong`, `haveNum`, `id`) VALUES (?,?,?,?);'
  //   data = [body.name,body.belong,0,body.id]
  //   const setDatabase = new DataBase()
  //   await setDatabase.getSqlData(sql, data)
  //   res.send({
  //     code: 2,
  //     msg: ''
  //   })
  // }
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
