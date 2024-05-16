const express = require('express')
const DataBase = require('./mysql')

const word = express.Router()

word.post('/allData', async (req, res) => {
  let sql = 'select * from word_list'
  const database = new DataBase()
  let wordList = await database.getSqlData(sql)
  res.send({
    code: 2,
    body: wordList,
  })
})

word.post('/myData', async (req, res) => {
  const { body } = req
  let sql = `select * from word_list where userid='${body.userid}'`
  const database = new DataBase()
  const wordList = await database.getSqlData(sql)
  sql = 'select * from class_list'
  const getClassDatabase = new DataBase()
  const classList = await getClassDatabase.getSqlData(sql)
  const arr = []
  const classMap = {}
  classList.forEach(item => {
    classMap[item.classid] = item.classname
  })
  wordList.forEach(item => {
    const obj = {
      ...item,
      classname: classMap[item.classid]
    }
    arr.push(obj)
  })

  res.send({
    code: 2,
    body: arr,
  })
})

word.post('/add', async (req, res) => {
  const { body } = req
  let sql = `insert into word_list (wordid,wordname,needid,userid,url) values ('${new Date().getTime()}','${body.wordname}','${body.needid}','${body.userid}','${body.url}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

word.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from word_list where wordid='${body.wordid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

word.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update word_list set wordname='${body.wordname}' where wordid = '${body.wordid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = word
