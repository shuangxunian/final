const express = require('express')
const DataBase = require('./mysql')

const sell = express.Router()

sell.post('/allData', async (req, res) => {
  let sql = 'select * from `sell_list`'
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})

sell.post('/add', async (req, res) => {
  // 比较日期大小 大返回true 小返回false
  function compareDate(s1,s2){
    return s1 && s2 && ((new Date(s1.replace(/-/g,"\/")))>(new Date(s2.replace(/-/g,"\/"))))
  }
  const { body } = req
  let sql = 'select * from `crm_list` where `productID`= ?'
  let data = [body.productID]
  const database = new DataBase()
  let info = await database.getSqlData(sql, data)
  // 将截止日期按照从近到远排序
  const endDateList = []
  if (info.length === 1) {
    endDateList.push(info[0])
  } else if (info.length > 1) {
    endDateList.push(info[0])
    if (compareDate(endDateList[0].endDate,info[1].endDate)) {
      endDateList.unshift(info[1])
    } else {
      endDateList.push(info[1])
    }
    for (let i = 2; i < info.length; i++) {
      for (let j = 0;j < endDateList.length; j++) {
        // 如果endDateList里面的截止日期已大于info里面的截止日期，我们要把当前的info插入到endDateList里面
        if(compareDate(endDateList[j].endDate,info[i].endDate) && info[i].isError === 0) {
          endDateList.splice(j, 0, info[i])
          break
        }
        if (j === endDateList.length - 1 && info[i].isError === 0) {
          endDateList.push(info[i])
          break
        }
      }
    }
  }

  // 数组为空代表库存不足
  if(endDateList.length === 0) {
    res.send({
      code: 4,
      msg: '此药库存不足，请先购买入库！'
    })
    return
  }

  // 最多能支出多少药
  let allCount = 0
  const optionCRMList = []
  let lastCRM = {}
  for (let i = 0; i < endDateList.length; i++) {
    allCount += endDateList[i].nowNum
    if (allCount < body.optionNum) {
      optionCRMList.push(endDateList[i])
    } else {
      lastCRM = endDateList[i]
    }
  }
  if (allCount < body.optionNum) {
    res.send({
      code: 4,
      msg: '此药库存不足，请先购买入库！'
    })
    return
  }

  // 改库
  let productLotList = ''
  for (let i = 0;i < optionCRMList.length; i++) {
    let nowSql = `UPDATE crm_list SET nowNum = 0 WHERE id = ${optionCRMList[i].id}`
    productLotList += optionCRMList[i].productLot + ','
    const nowUpdateDatabase = new DataBase()
    await nowUpdateDatabase.getSqlData(nowSql)
  }
  sql =  `UPDATE crm_list SET nowNum = ${allCount - body.optionNum} WHERE id = ${lastCRM.id}`
  productLotList += lastCRM.productLot
  const updateDatabase = new DataBase()
  await updateDatabase.getSqlData(sql)

  sql = `UPDATE product_list SET haveNum = haveNum - ${body.optionNum} WHERE id = ${body.productID}`
  const updateProductDatabase = new DataBase()
  await updateProductDatabase.getSqlData(sql)

  // 更新 sell 表
  sql = 'select * from `sell_list`'
  const getSellDatabase = new DataBase()
  info = await getSellDatabase.getSqlData(sql)
  if (info.length === 0) {
    body.id = 0
  } else {
    body.id = info[info.length - 1].id + 1
  }
  
  sql = 'INSERT INTO `sell_list` (`productID`, `patientName`, `phone`, `optionNum`, `id`, `productLot`) VALUES (?,?,?,?,?,?);'
  data = [body.productID,body.patientName,body.phone,body.optionNum,body.id,productLotList]
  const setDatabase = new DataBase()
  await setDatabase.getSqlData(sql, data)


  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = sell
