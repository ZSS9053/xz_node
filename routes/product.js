var express = require('express');
var productModel=require('../model/productModel');
var router = express.Router();
/* /product 获取产品列表 */
router.get('/:', function(req, res, next) {
  // res.render('index', { title: 'Express' });
});