const pool=require('./pool');
//Model:与用户相关的业务逻辑/数据模型
let userModel={};
//用户登录
userModel.login=function(uname,upwd,cb){
  pool.query("SELECT * FROM xz_user WHERE uname=? AND upwd=?",[uname,upwd],(err,rows)=>{
    if(err) throw err;
    if(rows.length>0){
      cb(rows);
    }else{
      cb('err');
    }
  })
};
//添加用户,用户注册
userModel.register=(user,cb)=>{
  pool.query("INSERT INTO xz_user SET ?",user,(err,rows)=>{
    if(err) throw err;
    cb(rows.insertId);
  })
};
//检查用户名是否有重复
userModel.checkName=(uname,cb)=>{
  pool.query("SELECT uid FROM xz_user WHERE uname=? LIMIT 1",uname,(err,rows)=>{
    if(err) throw err;
    cb(rows);
  })
};

//检查邮箱是否有重复
userModel.checkEmail=(email,cb)=>{
  pool.query("SELECT uid FROM xz_user WHERE email=? LIMIT 1",email,(err,rows)=>{
    if(err) throw err;
    cb(rows);
  })
};

//检查电话是否有重复
userModel.checkPhone=(email,cb)=>{
  pool.query("SELECT uid FROM xz_user WHERE phone=? LIMIT 1",email,(err,rows)=>{
    if(err) throw err;
    cb(rows);
  })
}
module.exports=userModel;
