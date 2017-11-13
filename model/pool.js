/*
* 对外公开一个连接池
* */
const mysql=require('mysql');
let pool=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'',
  database:'xz',
  port:'3306',
  connectionLimit:10
});
module.exports=pool;