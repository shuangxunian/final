const express = require("express");
const DataBase = require("./mysql");

const workServer = express.Router();

workServer.post("/allData", async (req, res) => {
  let sql = "select * from `server_list`";
  const database = new DataBase();
  let info = await database.getSqlData(sql);
  res.send({
    code: 2,
    info,
  });
});

workServer.post("/add", async (req, res) => {
  const { body } = req;
  let sql = `insert into server_list (id, userid, locationName, server, room, serverObj, phone, main) values 
  ('${new Date().getTime() + ""}','${body.userid}','${body.name}','${body.server}','${body.room}','${body.serverObj}','${body.phone}','${body.main || ''}')`;
  const database = new DataBase()
  await database.getSqlData(sql)
  res.send({
    code: 2,
    msg: "创建成功！",
  })
});

workServer.post("/addMain", async (req, res) => {
  const { body } = req;
  let sql = `update server_list set main='${body.main}', mainname='${body.mainname}' where id='${body.id}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  console.log(info)
  res.send({
    code: 2,
    info
  })
});

workServer.post("/get", async (req, res) => {
  const { body } = req;
  let sql = `select * from server_list where userid='${body.userid}'`
  const database = new DataBase()
  let info = await database.getSqlData(sql)
  console.log(info)
  res.send({
    code: 2,
    info
  })
});

workServer.post("/del", async (req, res) => {
  const { body } = req;
  let sql = `delete from server_list where id='${body.id}'`;
  const delDatabase = new DataBase();
  await delDatabase.getSqlData(sql);
  res.send({
    code: 2,
    msg: "创建成功！",
  });
});

module.exports = workServer;
