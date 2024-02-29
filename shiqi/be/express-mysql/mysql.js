//调用mysql模块
const mysql = require("mysql")
//创建一个connection
class Database
{
  //js的构造器
  constructor(){
    this.connection = mysql.createConnection({
      host: 'rm-cn-27a3m9yk1001aa1o.rwlb.rds.aliyuncs.com', //数据库所在主机IP
      user: 'root',     //数据库用户名
      password: '12345678abc',     //数据库密码
      port: '3306',       
      database: 'test2', //数据库名称
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