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
  // sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`, `requireWord`, `wherefrom`) VALUES (?,?,?,?,?,?);'
  // data = [new Date().getTime() + '',body.userid,body.username,body.optionType,body.requireWord,body.wherefrom]
  // const addOptionDatabase = new DataBase()
  // await addOptionDatabase.getSqlData(sql, data)
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

module.exports = text2
