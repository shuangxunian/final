const express = require('express')
const DataBase = require('./mysql')

const question = express.Router()

question.post('/allData', async (req, res) => {
  let sql = 'select * from question_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})


question.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from question_list where question='${body.question}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此问题已存在！'
    })
  } else {
    let str = ''
    if (body.selectList.includes('A')) {
      str += '1,'
    } else {
      str += '0,'
    }
    if (body.selectList.includes('B')) {
      str += '1,'
    } else {
      str += '0,'
    }
    if (body.selectList.includes('C')) {
      str += '1,'
    } else {
      str += '0,'
    }
    if (body.selectList.includes('D')) {
      str += '1'
    } else {
      str += '0'
    }
    sql = `insert into question_list (id,question,knowID,answerAText,answerBText,answerCText,answerDText,selectList) values ('${new Date().getTime()}','${body.question}','${body.knowID}','${body.answerAText}','${body.answerBText}','${body.answerCText}','${body.answerDText}','${str}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

question.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from question_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

question.post('/edit', async (req, res) => {
  const { body } = req
  let str = ''
  if (body.selectList.includes('A')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (body.selectList.includes('B')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (body.selectList.includes('C')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (body.selectList.includes('D')) {
    str += '1'
  } else {
    str += '0'
  }
  let sql = `update question_list set question='${body.question}', knowID='${body.knowID}', answerAText='${body.answerAText}', answerBText='${body.answerBText}', answerCText='${body.answerCText}', answerDText='${body.answerDText}', selectList='${str}' where id = '${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})


question.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update user_info set password = '123456' where userid = '${body.userid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

question.post('/fixPassword', async (req, res) => {
  const { body } = req
  let sql = `select * from user_info where userid='${body.userid}' and password='${body.oldPwd}'`
  const findDatabase = new DataBase()
  const info = await findDatabase.getSqlData(sql)
  if (info.length) {
    sql = `update user_info set password = '${body.newPwd1}' where userid = '${body.userid}'`
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



question.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into user_info (userid,username,password,roleType) values ('${list[i].userid}','${list[i].username}','123456','2')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = question
