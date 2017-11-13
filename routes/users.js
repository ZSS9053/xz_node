var express = require('express');
var userModel=require('../model/userModel');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* /users/login:用户登录  */
router.post('/login',function(req,res,next){
  var uname=req.body.uname,upwd=req.body.upwd;
  if(!uname){
    res.send({code:401,msg:"uname required"});
    return;
  }
  if(!upwd){
    res.send({code:402,msg:"upwd required"});
    return;
  }
  userModel.login(uname,upwd,(result)=>{
    if(result!=='err'){
      req.session.user=result[0];
      res.send({code:200,msg:"login succ"});
    }else{
      res.send({code:201, msg:"uname or upwd err"})
    }
  })
})

/* /users/register:用户注册 */
router.post('/register',(req,res,next)=>{
  userModel.register(req.body,(id)=>{
    if(id){
      res.send({code:200, msg:'register succ', uid: id});
    }
  })
});

/* /users/checkLogin:检查用户是否登录 */
router.get('/checkLogin',function(req,res,next){
  res.send(req.session.user);
});

/* /users/logout */
router.get('/logout',(req,res,next)=>{
  req.session.user=null;
  res.send({code:200, msg:"logout succ"});
})

/* /users/checkName:检查用户名是否存在 */
router.get("/checkName/:uname",(req,res,next)=>{
  userModel.checkName(req.params.uname,(result)=>{
    if(result.length==0){
      res.send({code:200, msg:"non-exists"});
    }else{
      res.send({code:201, msg:"exists"});
    }
  })
});

/* /users/checkEmail:检查邮箱是否存在 */
router.get('/checkEmail/:email',(req,res,next)=>{
  userModel.checkEmail(req.params.email,(result)=>{
    if(result.length==0){
      res.send({code:200, msg:"non-exists"});
    }else{
      res.send({code:201, msg:"exists"});
    }
  })
})

/* /users/checkPhone:检查电话是否存在 */
router.get('/checkPhone/:phone',(req,res,next)=>{
  userModel.checkPhone(req.params.phone,(result)=>{
    if(result.length==0){
      res.send({code:200, msg:"non-exists"});
    }else{
      res.send({code:201, msg:"exists"});
    }
  })
})

module.exports = router;
