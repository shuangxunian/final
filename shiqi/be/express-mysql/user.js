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
  let sql = `select * from user_info where id='${body.id}'`
  const findDatabase = new DataBase()
  let info = await findDatabase.getSqlData(sql)
  if (info.length !== 0) {
    return res.send({
      code: 4,
      msg: '此账号已存在，请检查！'
    })
  }
  sql = `insert into user_info (id, name, password, optionTime, imgUrl) values ('${body.id}','${body.name}','${body.password}','0','${body.imgUrl}')`
  const addDatabase = new DataBase()
  await addDatabase.getSqlData(sql)
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
  let sql = `select * from user_info where id='${body.id}' and password='${body.password}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    sql = `insert into option_list (id, userid, optionType) values ('${new Date().getTime()}','${body.id}','登录')`
    const optionDatabase = new DataBase()
    await optionDatabase.getSqlData(sql)
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

user.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from user_info where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

user.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update user_info set name='${body.name}', imgUrl ='${body.imgUrl}' where id = '${body.id}'`
  console.log(sql)
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = user
