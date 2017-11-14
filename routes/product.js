var express = require('express');
var productModel=require('../model/productModel');
var router = express.Router();
/* /product 获取产品列表 */
router.get('/:kw/:n', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  productModel.getProducts(req.params.kw,req.params.n,(result)=>{
  
  })
});
router.get('/search/:kw',(req,res,next)=>{
  productModel.search(req.params.kw,(data)=>{
    res.send(data);
  })
})

module.exports = router;