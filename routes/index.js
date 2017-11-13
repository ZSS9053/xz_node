var express = require('express');
var productModel=require('../model/productModel');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* /index/banner:获取轮播图片  */
router.get('/banner',function(req,res,next){
  productModel.getItems("SELECT cid,img,title,href FROM xz_index_carousel",(data)=>{
    res.send(data);
  })
});
router.get('/floors',function(req,res,next){
  productModel.getItems("SELECT pid,title,details,pic,price,href FROM xz_index_product WHERE seq_recommended>0 ORDER BY seq_recommended  LIMIT 6",(data)=>{
    var floors={};
    floors.recommendedItems=data;
    productModel.getItems("SELECT pid,title,details,pic,price,href FROM xz_index_product WHERE seq_new_arrival>0 ORDER BY seq_new_arrival LIMIT 6",(data)=>{
      floors.newArrivalItems=data;
      productModel.getItems("SELECT pid,title,details,pic,price,href FROM xz_index_product WHERE seq_top_sale>0 ORDER BY seq_top_sale LIMIT 6",(data)=>{
        floors.topSaleItems=data;
        res.send(floors);
      })
    })
  })
})
module.exports = router;
