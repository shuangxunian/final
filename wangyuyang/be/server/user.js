const express = require('express')
const MpUploadOssHelper = require("./uploadOssHelper.js");
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
      body: info[0]
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
    sql = 'INSERT INTO `user_info` (`id`,`username`, `password`, `birthDay`) VALUES (?,?,?,?);'
    data = [body.id,body.username,body.password,body.birthDay || '']
    const addUserBase = new DataBase()
    info = await addUserBase.getSqlData(sql, data)
    res.send({
      code: 2,
      body
      // msg: '注册成功！'
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

user.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id='${body.id}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update user_info set password='${body.newPwd}' where id = '${body.id}'`
    const fixDatabase = new DataBase()
    await fixDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: '密码修改成功！'
    })
  } else {
    res.send({
      code: 4,
      msg: '旧密码不正确！'
    })
  }
})

user.post('/getPostObjectParams', async (req, res) => {
  const mpHelper = new MpUploadOssHelper({
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    // 限制参数的生效时间，单位为小时，默认值为1。
    timeout: 1,
    // 限制上传文件大小，单位为MB，默认值为10。
    maxSize: 10,
  });

  // 生成参数。
  const params = mpHelper.createUploadParams();

  console.log(params)

  res.json(params);
})

user.post('/info', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where id= '${body.id}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info[0]
  })
})

module.exports = user
