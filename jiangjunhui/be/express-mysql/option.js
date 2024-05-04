const express = require('express')
const DataBase = require('./mysql')
const nodemailer = require('nodemailer')

const option = express.Router()

option.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into option_list (id, name, email) values ('${new Date().getTime() + ''}','${body.name}','${body.email}')`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})


let successSend, errorSend
const sendEmail = async (obj, text) => {
  let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
      user: '2749909223@qq.com',
      pass: 'naqnuzdfbgnwdhaa',
    },
    from: '2749909223@qq.com'
  })
  let mailOptions = {
    from: '"调度通知" <2749909223@qq.com>',
    to: obj.email,
    subject: '关于战斗机借路同行的通知',
    text: text,
  };
  
  transporter.sendMail(mailOptions, async function  (error, info) {
    if (error) {
      errorSend++
      let id = new Date().getTime() + '-' + errorSend
      let userOption = '发送邮件至-' + obj.name + '-发送失败'
      const errorOpSql = `insert into option_list (id, name, userOption) values ('${id}','系统','${userOption}')`
      const opDataBase = new DataBase()
      await opDataBase.getSqlData(errorOpSql)
      return
    }
    successSend++
    let id = new Date().getTime() + '-' + successSend
    let userOption = '发送邮件至-' + obj.name + '-发送成功'
    const successOpSql = `insert into option_list (id, name, userOption) values ('${id}','系统','${userOption}')`
    const opDataBase = new DataBase()
    await opDataBase.getSqlData(successOpSql)
  })
}

option.post('/send', async (req, res) => {
  const {body} = req
  successSend = 0
  errorSend = 0
  let getEmailModel = `select * from mail_model`
  const emailModelDataBase = new DataBase()
  const emailModel = await emailModelDataBase.getSqlData(getEmailModel)
  // 生成文本
  let model = ''
  for(let i = 0; i < emailModel[0].model.length; i++) {
    if (emailModel[0].model[i]!=='`') {
      model+=emailModel[0].model[i]
    } else {
      let keyword = ''
      let j = i + 1
      for(; j < emailModel[0].model.length; j++) {
        if (emailModel[0].model[j] === '`') break
        keyword+=emailModel[0].model[j]
      }
      model+=body[keyword]
      i = j + 1
    }
  }

  let sql = 'select * from `user_list`'
  const userListDataBase = new DataBase()
  let userList = await userListDataBase.getSqlData(sql)
  for (let k = 0; k < body.data.length - 1; k++) {
    const item = body.data[k]
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name === item) {
        successSend++
        await sendEmail(userList[i],model)
        break
      }
      if (i === userList.length - 1) {
        errorSend++
        let id = new Date().getTime() + '-' + errorSend
        const errorOpSql = `insert into option_list (id, name, userOption) values ('${id}','系统','${'发送邮件至-' + item + '-失败，查无此单位'}')`
        const opDataBase = new DataBase()
        await opDataBase.getSqlData(errorOpSql)
      }
    }
  }
  res.send({
    code: 2,
    successSend,
    errorSend
  })
})

option.post('/allData', async (req, res) => {
  let sql = `select * from option_list`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

option.post('/model', async (req, res) => {
  let sql = `select * from mail_model`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

option.post('/fixmodel', async (req, res) => {
  const { body } = req
  let sql = `update mail_model set model='${body.text}' where id='1'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

module.exports = option
