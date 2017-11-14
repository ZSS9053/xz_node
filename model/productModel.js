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

//获取搜索关键字在数据库里匹配的内容
productModel.search=function(kw,cb){
  var kws=kw.split(" ");
  var sql="SELECT title FROM xz_laptop where "
  for(var i=0;i<kws.length;i++){
    if(i==0){
      sql+="title LIKE '%"+kws[i]+"%' "
    }else{
      sql+=" AND title LIKE '%"+kws[i]+"%' "
    }
  }
  sql+=" ORDER BY sold_count DESC LIMIT 15";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    cb(result);
  })
};

//获取产品列表
productModel.getProducts=function(kw,n,cb){
  var output={
    recordCount:0,  //满足条件的总记录数
    pageSize:9,    //每页大小，即每页最多可以显示的记录数量
    pageCount:0,   //总页数
    pno:n,         //当前数据所在页号
    data:null      //当前页中的数据
  };
  var sql="SELECT COUNT(*) count FROM xz_laptop";
  if(kw){
    var kws=kw.split(" ");
    for(var i=0;i<kws.length;i++){
      if(i==0){
        var str=" WHERE title LIKE '%"+kws[i]+"%' "
      }else{
        str+=" AND title LIKE '%"+kws[i]+"%' "
      }
    }
    sql+=str;
  }
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    output.recordCount=result[0].count;
    output.pageCount =Math.ceil(output.recordCount/output.pageSize);
    var start=(output.pno-1)*output.pageSize;
    var count=output.pageSize;
    sql= "SELECT lid,title,price,sold_count,is_onsale FROM xz_laptop " + str + " ORDER BY sold_count DESC LIMIT "+start+","+count;
    console.log(sql);
    // pool.query(sql,(err,result)=>{
    //   if(err) throw err;
    //   console.log(result);
      // for(var i=0;i<result.length;i++){
      //
      // }
    // })
  })
}
module.exports=productModel;
