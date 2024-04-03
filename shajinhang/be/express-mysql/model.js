const express = require('express')
const DataBase = require('./mysql')
const axios = require("axios");

const model = express.Router()

model.post('/allData', async (req, res) => {
  let sql = 'select * from model_list'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: info
  })
})

model.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from model_list where name='${body.name}'`
  const database = new DataBase()
  const info = await database.getSqlData(sql)
  if (info.length) {
    res.send({
      code: 4,
      msg: '此模型名已存在！'
    })
  } else {
    sql = `insert into model_list (id,name,up,down) values ('${new Date().getTime()}','${body.name}','${body.up}','${body.down}')`
    const addDatabase = new DataBase()
    await addDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

model.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from model_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

model.post('/fix', async (req, res) => {
  const { body } = req
  let sql = `update model_list set name='${body.name}', up='${body.up}', down='${body.down}' where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

model.post('/list', async (req, res) => {
  const { body } = req
  const arr = body.body
  const down = Number(body.down)
  const up = Number(body.up)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].AIscore === null) {
      const res = await axios.post('http://127.0.0.1:5000/airesult', {
        body: arr[i].talk
      })
      const AIscore = res.data[0].positive_probs
      const status = AIscore > up ? '1' : AIscore < down ? '2' : '0'
      let sql = `update data_list set AIscore='${AIscore}', AIstatus='${status}' where id='${arr[i].id}'`
      const database = new DataBase()
      await database.getSqlData(sql)
    } else {
      const AIscore = Number(arr[i].AIscore)
      const status = AIscore > up ? '1' : AIscore < down ? '2' : '0'
      let sql = `update data_list set AIscore='${AIscore}', AIstatus='${status}' where id='${arr[i].id}'`
      const database = new DataBase()
      await database.getSqlData(sql)
    }
  }
  res.send({
    code: 2
  })
})


module.exports = model
