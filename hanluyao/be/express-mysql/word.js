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
  let sql = `insert into word_list (wordid,wordname,userid,classid,url) values ('${new Date().getTime()}','${body.wordname}','${body.userid}','${body.classid}','${body.url}')`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: ''
  })
})

word.post('/del', async (req, res) => {
  const { body } = req
  let sql = `delete from class_list where classid='${body.classid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

word.post('/edit', async (req, res) => {
  const { body } = req
  let sql = `update class_list set collegeid='${body.collegeid}',classname='${body.classname}',needwordnum='${body.needwordnum}' where classid = '${body.classid}'`
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2
  })
})

module.exports = word
