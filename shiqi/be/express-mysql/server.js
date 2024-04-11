const express = require('express')
const cors = require('cors');
const schedule = require('node-schedule');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const DataBase = require('./mysql')

dotenv.config()

const app = express()
app.use(cors())

const user = require('./user')
const product = require('./product')
const crm = require('./crm')
const sell = require('./sell')
const myOption = require('./myOption')
const date = require('./date')
app.use(bodyParser.json())

app.use('/user', user)
app.use('/product', product)
app.use('/crm', crm)
app.use('/sell', sell)
app.use('/myOption', myOption)
app.use('/date', date)

app.listen(3000)

console.log('服务启动成功')

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
    // sql = `select * from sell_list where productID = '${info[i].id}'`
    // const getSellDatabase = new DataBase()
    // const sellList = await getSellDatabase.getSqlData(sql)
    // console.log('haveNum1',haveNum)
    // for (let j = 0; j < sellList.length; j++) {
    //   haveNum -= Number(sellList[j].optionNum)
    // }
    // console.log('haveNum2',haveNum)
    sql = `update product_list set haveNum='${haveNum}'  where id='${info[i].id}'`
    const updateCRMDatabase = new DataBase()
    await updateCRMDatabase.getSqlData(sql)
  }
  console.log('数据库刷新完毕')
}

schedule.scheduleJob('10 0 0 * * *', () => {
  refreshData()
})

refreshData()


