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

sell.post('/del', async (req, res) => {
  const { body } = req
  let sql = `update crm_list set nowNum='0'  where productLot='${body.id}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  res.send({
    code: 2,
    info
  })
})


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const refreshData = async() => {
  console.log('执行刷新数据')
  const today = getCurrentDate()
  let sql
  sql = 'select * from `product_list`'
  const getProductDatabase = new DataBase()
  const info = await getProductDatabase.getSqlData(sql)
  // 比较日期大小 大返回true 小返回false
  function compareDate(s1,s2){
    return s1 && s2 && ((new Date(s1.replace(/-/g,"\/")))>=(new Date(s2.replace(/-/g,"\/"))))
  }
  for (let i = 0; i < info.length; i++) {
    let haveNum = 0
    sql = `select * from crm_list where productID = '${info[i].id}'`
    const getCRMDatabase = new DataBase()
    const crmList = await getCRMDatabase.getSqlData(sql)
    for (let j = 0; j < crmList.length; j++) {
      if(compareDate(crmList[j].endDate,today)) {
        haveNum += Number(crmList[j].nowNum)
      } else {
        sql = `update crm_list set nowNum='0'  where id='${crmList[j].id}'`
        const updateProductDatabase = new DataBase()
        await updateProductDatabase.getSqlData(sql)
      }
    }
    sql = `select * from sell_list where productID = '${info[i].id}'`
    const getSellDatabase = new DataBase()
    const sellList = await getSellDatabase.getSqlData(sql)
    for (let j = 0; j < sellList.length; j++) {
      haveNum -= Number(sellList[j].optionNum)
    }
    sql = `update product_list set haveNum='${haveNum}'  where id='${info[i].id}'`
    const updateCRMDatabase = new DataBase()
    await updateCRMDatabase.getSqlData(sql)
  }
  console.log('数据库刷新完毕')
}


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
  let allCount = 0
  if (info.length === 1) {
    endDateList.push(info[0])
    allCount += info[0].nowNum
  } else if (info.length > 1) {
    endDateList.push(info[0])
    allCount += info[0].nowNum
    if (compareDate(endDateList[0].endDate,info[1].endDate)) {
      endDateList.unshift(info[1])
      allCount += info[1].nowNum
    } else {
      endDateList.push(info[1])
      allCount += info[1].nowNum
    }
    for (let i = 2; i < info.length; i++) {
      for (let j = 0;j < endDateList.length; j++) {
        // 如果endDateList里面的截止日期已大于info里面的截止日期，我们要把当前的info插入到endDateList里面
        if(compareDate(endDateList[j].endDate,info[i].endDate) && info[i].isError === 0) {
          endDateList.splice(j, 0, info[i])
          allCount += info[i].nowNum
          break
        }
        if (j === endDateList.length - 1 && info[i].isError === 0) {
          endDateList.push(info[i])
          allCount += info[i].nowNum
          break
        }
      }
    }
  }

  // console.log(endDateList)

  // 数组为空代表库存不足
  if(endDateList.length === 0 || allCount < body.optionNum) {
    // console.log(allCount, body.optionNum)
    res.send({
      code: 4,
      msg: '此药库存不足，请先购买入库！'
    })
    return
  }
  
  for (let i = 0; i < endDateList.length; i++) {
    if (endDateList[i].nowNum >= body.optionNum) {

      sql = 'INSERT INTO `sell_list` (`productID`, `patientName`, `phone`, `optionNum`, `id`, `productLot`) VALUES (?,?,?,?,?,?);'
      data = [body.productID,body.patientName,body.phone,body.optionNum,new Date().getTime(),endDateList[i].productLot]
      const setDatabase = new DataBase()
      await setDatabase.getSqlData(sql, data)
      sql = `insert into option_list (id, userid, optionType,productname,productbelong,productLot,optionNum) values ('${new Date().getTime()}','${body.userID}','出库','${body.productname}','${body.productbelong}','${endDateList[i].productLot}','${body.optionNum}')`
      const addOptionDatabase = new DataBase()
      await addOptionDatabase.getSqlData(sql)
      sql =  `update crm_list set nowNum = ${endDateList[i].nowNum-body.optionNum} where id = ${endDateList[i].id}`
      const updateDatabase = new DataBase()
      await updateDatabase.getSqlData(sql)
      break
    } else {
      sql = 'INSERT INTO `sell_list` (`productID`, `patientName`, `phone`, `optionNum`, `id`, `productLot`) VALUES (?,?,?,?,?,?);'
      data = [body.productID,body.patientName,body.phone,endDateList[i].nowNum,new Date().getTime(),endDateList[i].productLot]
      const setDatabase = new DataBase()
      await setDatabase.getSqlData(sql, data)
      body.optionNum -= endDateList[i].nowNum
      sql = `insert into option_list (id, userid, optionType,productname,productbelong,productLot,optionNum) values ('${new Date().getTime()}','${body.userID}','出库','${body.productname}','${body.productbelong}','${endDateList[i].productLot}','${endDateList[i].nowNum}')`
      const addOptionDatabase = new DataBase()
      await addOptionDatabase.getSqlData(sql)
      sql =  `update crm_list set nowNum = 0 where id = ${endDateList[i].id}`
      const updateDatabase = new DataBase()
      await updateDatabase.getSqlData(sql)
    }
  }

  await refreshData()

  res.send({
    code: 2,
    msg: ''
  })
})

module.exports = sell
