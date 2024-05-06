const express = require('express')
const DataBase = require('./mysql')
const axios = require("axios");
const qs = require('qs')

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
})

user.post('/login', async (req, res) => {
  console.log(process.env.APIKey)
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password='${body.password}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    if (info[0].imgUrl !== '') {
      const { data } = await axios.post('https://api-cn.faceplusplus.com/facepp/v3/compare', qs.stringify({
        api_key: process.env.APIKey,
        api_secret: process.env.APISecret,
        image_url1: info[0].imgUrl,
        image_url2: body.imgUrl,
      }))
      if (data.confidence < 80) {
        return res.send({
          code: 4,
          msg: '人脸识别失败，禁止登录！'
        })
      } else {
        res.send({
          code: 2,
          body: info[0],
          msg: '登录成功！'
        })
      }
    } else {
      res.send({
        code: 2,
        body: info[0],
        msg: '登录成功！'
      })
    }
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

user.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password= '${body.oldPassword}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if(info.length !== 0) {
    sql = `update user_info set password='${body.newPassword}' where id='${body.id}'`
    const fixPwdDatabase = new DataBase()
    let info = await fixPwdDatabase.getSqlData(sql)
    res.send({
      code: 2
    })
  } else {
    res.send({
      code: 4,
      msg: '旧密码错误，请检查！'
    })
  }
})
user.post('/fixName', async (req, res) => {
  const { body } = req
  let sql = `update user_info set name='${body.name}' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


module.exports = user
