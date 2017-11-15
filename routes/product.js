var express = require('express');
var productModel=require('../model/productModel');
var router = express.Router();

router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
/* /product/search获取搜索列表 */
router.get('/search/:kw',(req,res,next)=>{
  productModel.search(req.params.kw,(data)=>{
    res.send(data);
  })
})
/* /product/get 获取产品列表 */
router.get('/get/:n/:kw', function(req, res, next) {
  var kw=req.params.kw,n=req.params.n;
  if(kw=="empty"){
    kw="";
  }
  productModel.getProducts(kw,n,(result)=>{
    res.send(result);
  })
});
/* /product/cart/add 加入购物车功能 */
router.post("/cart/add",(req,res,next)=>{
  if(req.session.user){
    var lid=req.body.lid,count=req.body.count,uid=req.session.user.uid;
    productModel.addProduct(uid,lid,count,()=>{
      res.send("succ");
    });
  }else{
    res.send('err');
  }
})

/* /product/cart/list 获取购物车列表 */
router.get('/cart/list',(req,res,next)=>{
  if(req.session.user){
    var uid=req.session.user.uid;
    productModel.getCartList(uid,(data)=>{
      res.send(data);
    })
  }
});

/* /product/cart/update 更新购物车 */
router.post('/cart/update',(req,res,next)=>{
  var iid=req.body.iid,count=req.body.count,uid=req.session.user.uid;
  productModel.updateCart(uid,iid,count,()=>{
    res.send("succ");
  })
});

/* /product/cart/delete 删除购物车 */
router.post('/cart/delete',(req,res,next)=>{
  var iid=req.body.iid,uid=req.session.user.uid;
  productModel.deleteCart(iid,()=>{
    res.send("succ");
  })
});

/* /product/detail 获取产品详情 */
router.get('/detail/:id',(req,res,next)=>{
  var id=req.params.id;
  productModel.getDetail(id,(result)=>{
    res.send(result);
  })
});
module.exports = router;