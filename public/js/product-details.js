(()=>{
	
})();
(()=>{
  const LIWIDTH=62,SIZE=parseFloat($("#mask").css("width"));
	var liCount=0,
			moved=0;
  $.get("product/detail/"+location.search.slice(5))
   .then(data=>{
			console.log(data);
    var details=data.details,family=data.family;
    //左上商品图片
    $("#mImg").attr("src",details.picList[0].md);
    var html="";
    for(var pic of details.picList){
      html+=
        `<li><img src="${pic.sm}" data-md="${pic.md}" data-lg="${pic.lg}"></li>`
    }
    var $icon_list=$("#icon_list").html(html)
      .css("width",LIWIDTH*details.picList.length);
		liCount=details.picList.length;
		if(liCount<=5){
			$("#preview>h1>a").addClass("disabled");
		}else{
			$("#preview>h1>a").off("click").click(e=>{
				var $a=$(e.target);
				if(!$a.is(".disabled")){
					if($a.hasClass("backward")){
						moved--;
					}else{
						moved++;
					}
					$icon_list.css("left",-LIWIDTH*moved+20);
					if(moved==0){
						$("#preview>h1>a.backward").addClass("disabled");
					}else if(liCount-moved==5){
						$("#preview>h1>a.forward").addClass("disabled");	
					}else{
						$("#preview>h1>a").removeClass("disabled");	
					}
				}
			})
		}
		$icon_list.children().mouseenter(function(){
			var $li=$(this);
			var src=$li.children().first().attr("src").replace("/sm/","/md/");
			$("#mImg").attr({src});
		})
		$("#supreMask").hover(()=>$("#mask").toggle())
			.mouseover(e=>{
			var top=e.offsetY-SIZE/2,
				  left=e.offsetX-SIZE/2;
			if(top )
			$("#mask").css({top,left});
		})





    //右上基本信息
    $("#show-details>h1").html(details.title);
    $("#show-details>h3>a").html(details.subtitle);
    $("#show-details .stu-price>span")
      .html("¥"+details.price);
    $("#show-details .promise")
      .append(details.promise);
    //规则
    var html="";
    for(var f of family.laptopList){
      html+=
        `<a href="product-details.html?lid=${f.lid}" class=${f.lid===details.lid?"active":""}>
          ${f.spec}
        </a>`;
    }
    $("#show-details>.spec>div").html(html);

    //下方规格参数
    $("#param>ul").html(`
<li><a href="#">商品名称：${details.lname}</a></li>
<li><a href="#">系统：${details.os}</a></li>
<li><a href="#">内存容量：${details.memory}</a></li>
<li><a href="#">分辨率：${details.resolution}</a>
</li>
<li><a href="#">显卡型号：${details.video_card}</a>
</li>
<li><a href="#">处理器：${details.cpu}</a></li>
<li><a href="#">显存容量${details.video_memory}</a>
</li>
<li><a href="#">分类：${details.category}</a></li>
<li><a href="#">硬盘容量：${details.disk}</a></li>`
    );
    $("#product-intro").html(details.details);
  })
})();