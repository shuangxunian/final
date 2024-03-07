const express = require('express')
const DataBase = require('./mysql')

const user = express.Router()

user.post('/allData', async (req, res) => {
  let sql = 'select * from `user_info`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  const body = []
  info.forEach(item => {
    if (item.role) {
      body.push({
        userid: item.userid,
        usetime: item.usetime
      })
    }
  });
  res.send({
    code: 2,
    body
  })
})

module.exports = user
