const express = require('express')
const DataBase = require('./mysql')

const text4 = express.Router()

text4.post('/allData', async (req, res) => {
  let sql = 'select * from `text4_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

text4.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `text4_list` (`id`, `china`, `pinyin`) VALUES (?,?,?);'
  let data = [new Date().getTime() + '',body.china,body.pinyin]
  const addTextDatabase = new DataBase()
  await addTextDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text4.post('/edit', async (req, res) => {
  const { body } = req
  let sql = 'UPDATE `text4_list` SET `china` = ?, `pinyin` = ? WHERE `id` = ?;'
  let data = [body.china,body.pinyin,body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text4.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'DELETE FROM `text4_list` WHERE `id` = ?;'
  let data = [body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})

text4.post('/find', async (req, res) => {
  const { body } = req
  let sql = 'select * from `text4_list` where `china` = ?'
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

text4.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into text4_list (id,china,pinyin) values ('${new Date().getTime() + ''}','${list[i].china}','${list[i].pinyin}')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = text4
