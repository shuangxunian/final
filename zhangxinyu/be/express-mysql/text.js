const express = require('express')
const DataBase = require('./mysql')

const text = express.Router()

text.post('/allData', async (req, res) => {
  let sql = 'select * from `text_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

text.post('/add', async (req, res) => {
  const { body } = req
  let sql = 'INSERT INTO `text_list` (`id`, `china`, `eng`, `info`, `pinyin`, `wordsAndPhrases`) VALUES (?,?,?,?,?,?);'
  let data = [new Date().getTime() + '',body.china,body.eng,body.info,body.pinyin,body.wordsAndPhrases]
  const addTextDatabase = new DataBase()
  await addTextDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text.post('/edit', async (req, res) => {
  const { body } = req
  let sql = 'UPDATE `text_list` SET `china` = ?, `eng` = ?, `info` = ?, `pinyin` = ?, `wordsAndPhrases` = ? WHERE `id` = ?;'
  let data = [body.china,body.eng,body.info,body.pinyin,body.wordsAndPhrases,body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})


text.post('/del', async (req, res) => {
  const { body } = req
  let sql = 'DELETE FROM `text_list` WHERE `id` = ?;'
  let data = [body.id]
  const textDatabase = new DataBase()
  await textDatabase.getSqlData(sql, data)
  res.send({
    code: 2,
    body
  })
})

text.post('/find', async (req, res) => {
  const { body } = req
  let sql = 'select * from `text_list` where `china` = ?'
  let data = [body.requireWord]
  const addTextDatabase = new DataBase()
  const info = await addTextDatabase.getSqlData(sql, data)
  sql = 'INSERT INTO `option_list` (`id`, `userid`, `username`, `optionType`, `requireWord`) VALUES (?,?,?,?,?);'
  data = [new Date().getTime() + '',body.userid,body.username,body.optionType,body.requireWord]
  const addOptionDatabase = new DataBase()
  await addOptionDatabase.getSqlData(sql, data)
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

module.exports = text
