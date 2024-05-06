//调用mysql模块
const mysql = require("mysql")
//创建一个connection
class Database
{
  //js的构造器
  constructor(){
    this.connection = mysql.createConnection({
      host: process.env.host, //数据库所在主机IP
      user: process.env.user,     //数据库用户名
      password: process.env.password,     //数据库密码
      port: process.env.port,       
      database: process.env.database, //数据库名称
    });
    this.connection.connect((err) => {
      if (err) { console.log("连接失败") }
      else { console.log("连接成功") }
    })
  }

  getSqlData (sql, data) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, data, (error, result, fields) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// 把database导出 
module.exports = Database;