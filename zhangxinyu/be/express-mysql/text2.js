const express = require('express')
const DataBase = require('./mysql')

const text2 = express.Router()

text2.post('/allData', async (req, res) => {
  let sql = 'select * from `text2_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

text2.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `text2_list` (`id`, `china`, `pinyin`) VALUES (?,?,?);'
  let data = [new Date().getTime() + '',body.china,body.pinyin]
  const addTextDatabase = new DataBase()
  await addTextDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text2.post('/edit', async (req, res) => {
  const { body } = req
  let sql = 'UPDATE `text2_list` SET `china` = ?, `pinyin` = ? WHERE `id` = ?;'
  let data = [body.china,body.pinyin,body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text2.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'DELETE FROM `text2_list` WHERE `id` = ?;'
  let data = [body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})

text2.post('/find', async (req, res) => {
  const { body } = req
  let sql = 'select * from `text2_list` where `china` = ?'
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


text2.post('/addList', async (req, res) => {
  const { body } = req
  const list = body.list
  for (let i = 0; i < list.length; i++) {
    let sql = `insert into text2_list (id,china,pinyin) values ('${new Date().getTime() + ''}','${list[i].china}','${list[i].pinyin}')`
    const database = new DataBase()
    await database.getSqlData(sql)
  }
  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = text2
