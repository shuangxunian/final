const express = require('express')
const DataBase = require('./mysql')

const product = express.Router()

product.post('/allData', async (req, res) => {
  let sql = 'select * from `product_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

product.post('/add', async (req, res) => {
  const { body } = req
  let sql = `select * from product_list where name='${body.name}' and belong='${body.belong}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此厂家生成的此药已存在，请检查！'
    })
  } else {
    const id = new Date().getTime()
    sql = `insert into product_list (name,belong,haveNum,id) values ('${body.name}','${body.belong}',0,'${id}')`
    const setDatabase = new DataBase()
    await setDatabase.getSqlData(sql)
    sql = `insert into option_list (id, userid, optionType,productid,productname,productbelong) values ('${new Date().getTime()}','${body.userid}','添加产品','${id}','${body.name}','${body.belong}')`
    const addOptionDatabase = new DataBase()
    await addOptionDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

product.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `select * from product_list where name='${body.name}' and belong='${body.belong}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  if (info.length !== 0) {
    res.send({
      code: 4,
      msg: '此厂家生成的此药已存在，请检查！'
    })
  } else {
    sql = `update product_list set name='${body.name}',belong='${body.belong}' where id='${body.id}'`
    const setDatabase = new DataBase()
    await setDatabase.getSqlData(sql)
    sql = `insert into option_list (id, userid, optionType,productid,productname,productbelong) values ('${new Date().getTime()}','${body.userid}','修改产品','${body.id}','${body.name}','${body.belong}')`
    const addOptionDatabase = new DataBase()
    await addOptionDatabase.getSqlData(sql)
    res.send({
      code: 2,
      msg: ''
    })
  }
})

product.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from product_list where id='${body.id}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  sql = `insert into option_list (id, userid, optionType,productname,productbelong) values ('${new Date().getTime()}','${body.userid}','删除产品','${body.name}','${body.belong}')`
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = product
