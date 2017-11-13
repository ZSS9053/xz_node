const pool=require('./pool');

//Model：有关产品操作相关的业务逻辑/数据模型

let productModel={};

/**
 * 向首页提供必需的数据，包括轮播广告、首页推荐、最新上架、热销单品
 * 返回数据形如：
   carouselItems: [ ],
   recommendedItems: [ ],
   newArrialItems: [ ],
   topSaleItems: [ ]
 */

productModel.getItems=function(sql,cb){
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    cb(result);
  });
};

module.exports=productModel;
