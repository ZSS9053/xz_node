(()=>{
  function loadProductsByPage(n=1){
    var url="data/04-products/products.php";
    var params=location.search.slice(1)+"&pno="+n;
    $.get(url,params)
      .then(data=>{
      //加载数据
      var html="";
      var detailUrl="product-details.html?lid=";
      for(var p of data.data){
        html+=
          `<li id="${p.lid}">
            <a href="${detailUrl+p.lid}">
              <img src="${p.pic}" alt="${p.title}">
            </a>
            <p>
              <span class="price">¥${p.price}</span>
              <a href="${detailUrl+p.lid}">
                ${p.title}
              </a>
            </p>
            <div>
              <span class="reduce">-</span>
              <input type="text" value="1">
              <span class="add">+</span>
              <a href="javascript:;" class="addCart">加入购物车</a>
            </div>
          </li>`
      }
      $("#show-list").html(html);
      //生成分页按钮
      var html="";
      for(var i=1;i<=data.pageCount;i++){
        html+='<a href="javascript:;">'+i+'</a>';
      }
      $("#pages").html(
        '<a href="javascript:;" class="previous">上一页</a>' 
        +html+
        '<a href="javascript:;" class="next">下一页</a>'
      ).children(":eq("+n+")").addClass("current");
      if(n==1)
     $("#pages>a:first-child").addClass("disabled");
      if(n==data.pageCount)
     $("#pages>a:last-child").addClass("disabled");
      if(n!=1&&n!=data.pageCount){
     $("#pages>a:first-child,#pages>a:last-child")
       .removeClass("disabled");
      }
    })
  }
  loadProductsByPage();//练习10分钟，下课休息10分钟
  $("#pages")
   .on("click","a:not(.disabled):not(.current)",e=>{
    var $a=$(e.target);
    var n=parseInt($("#pages>a.current").html());
    if($a.is(":first-child")) 
      loadProductsByPage(n-1);
    else if($a.is(":last-child"))
      loadProductsByPage(n+1);
    else loadProductsByPage($a.html());
  });
  $("#show-list").on("click",".reduce,.add",e=>{
    var $span=$(e.target),
        $input=$span.siblings("input");
    //获得旁边input的值保存在n中
    var n=parseInt($input.val());
    //如果当前span是+
    if($span.html()=="+")
      n++//就n+1
    else if(n>1)//否则 如果n>1
      n--;//才能n-1
    //将n保存回旁边的input中
    $input.val(n);
  }).on("click",".addCart",e=>{
		var $add=$(e.target);
		$.post("data/cart/add.php",{
			lid:$add.parent().parent().attr("id"),
			count:$add.prev().prev().val()
		}).then(()=>{
			loadCart();
		})
		function loadCart(){
			$.get("data/cart/list.php")
				.then(data=>{
					console.log(data)
				var html="";
				for(var item of data){
					html+=`<div id="${item.iid}">
              <span>${item.title}</span>
              <div>
                <span class="reduce">-</span>
                <input type="text" value="${item.count}"/>
                <span class="add">+</span>
              </div>
              <span class="price">￥${(item.count*item.price).tofixed(2)}</span>
            </div>`;
				}
				$("#cart>.cart_content").html(html);
				var total=0;
				var $subs=$("#cart>.cart_content>div>span:last-child");
				$subs.each((i,elem)=>{
					total+=parseInt($(elem).html().slice(1))
				})
				$("#toatl").html(total.tofixed(2));
			})
				loadCart();
			$("#cart>.cart_content")
				.on("click",".reduce,.add",e=>{
				var $tar=$(e.target);
				var n=parseInt($tar.siblings("input").val());
				if($tar.html()=="+"){
					n++;
				}else if(n>1){
					n--;
				}
				var iid=$tar.parent().parent().attr("id");
				if(n>0){
					$.post("data/cart/update.php",{iid:iid,count:n});
				}else{
					$.post("data/cart/delete.php",{iid:iid});
				}
				loadCart();
			})
		}
	})
})()