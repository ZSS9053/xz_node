/*
* 对外公开一个连接池
* */
const mysql=require('mysql');
let pool=mysql.createPool({
  host:'w.rdc.sae.sina.com.cn',
  user:'mk2my4xk4y',
  password:'00kjmkw4323l55xyllwlz1jh423wlhxz4y5jl331',
  database:'app_notestore',
  port:'3306',
  connectionLimit:10
});
module.exports=pool;