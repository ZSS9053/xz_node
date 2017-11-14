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
    sql= "SELECT lid,title,price,sold_count,is_onsale,(select md from xz_laptop_pic where laptop_id=lid limit 0,1) as pic FROM xz_laptop " + str + " ORDER BY sold_count DESC LIMIT "+start+","+count;
     pool.query(sql,(err,result)=>{
       if(err) throw err;
       output.data=result;
       cb(output);
     })
  })
}

//添加产品到购物车
productModel.addProduct=function(uid,lid,count,cb){
  var sql="SELECT COUNT(*) count FROM xz_shoppingcart_item WHERE product_id="+lid+" AND user_id="+uid;
  pool.query(sql,(err,result)=>{
    if(result[0].count==1){
      sql="UPDATE xz_shoppingcart_item SET count="+(count+result[0].count)+" WHERE user_id="+uid+" AND product_id="+lid;
    }else{
      sql=`INSERT INTO xz_shoppingcart_item VALUES(NULL,${uid},${lid},${count},false)`;
    }
    pool.query(sql,(err,result)=>{
      if(err) throw err;
      cb()
    })
  })
}

//获取购物车列表
productModel.getCartList=function(uid,cb){
  var sql="SELECT iid,product_id,title,spec,price,count from xz_shoppingcart_item inner join xz_laptop on product_id=lid WHERE user_id="+uid;
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    cb(result);
  })
};

//更新购物车
productModel.updateCart=function(uid,iid,count,cb){
  var sql="UPDATE xz_shoppingcart_item SET count="+count+" WHERE iid="+iid;
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    cb()
  })
}

//删除购物车
productModel.deleteCart=function(iid,cb){
  var sql="DELETE FROM xz_shoppingcart_item WHERE iid="+iid;
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    cb();
  })
};

//获取产品详情
productModel.getDetail=function(id,cb){
  var output={
    details:{},
    family:{}
  }
  var sql="select * from xz_laptop where lid="+id;
  pool.query(sql,(err,result)=>{
    output.details=result[0];
    sql="select * from xz_laptop_pic where laptop_id="+id+" order by pid";
    pool.query(sql,(err,result)=>{
      output.details.picList=result;
      var fid=output.details.family_id;
      sql="select * from xz_laptop_family where fid="+fid;
      pool.query(sql,(err,result)=>{
        output.family=result[0];
        sql="select lid,spec from xz_laptop where family_id="+fid;
        pool.query(sql,(err,result)=>{
          output.family.laptopList=result;
          cb(output);
        })
      })
    })
  })
}
module.exports=productModel;
