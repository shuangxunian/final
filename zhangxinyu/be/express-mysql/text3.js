const express = require('express')
const DataBase = require('./mysql')

const text3 = express.Router()

text3.post('/allData', async (req, res) => {
  let sql = 'select * from `text3_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

text3.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `text3_list` (`id`, `china`, `pinyin`) VALUES (?,?,?);'
  let data = [new Date().getTime() + '',body.china,body.pinyin]
  const addTextDatabase = new DataBase()
  await addTextDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text3.post('/edit', async (req, res) => {
  const { body } = req
  let sql = 'UPDATE `text3_list` SET `china` = ?, `pinyin` = ? WHERE `id` = ?;'
  let data = [body.china,body.pinyin,body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text3.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'DELETE FROM `text3_list` WHERE `id` = ?;'
  let data = [body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})

text3.post('/find', async (req, res) => {
  const { body } = req
  let sql = 'select * from `text3_list` where `china` = ?'
  let data = [body.requireWord]
  const addTextDatabase = new DataBase()
  const info = await addTextDatabase.getSqlData(sql, data)
  if (info.length) {
    res.send({
      code: 2,
      info
    })
  } else {
    res.send({
      code: 4,
      msg: '该单词不存在！'
    })
  }
})

text3.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into text3_list (id,china,pinyin) values ('${new Date().getTime() + ''}','${list[i].china}','${list[i].pinyin}')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = text3
