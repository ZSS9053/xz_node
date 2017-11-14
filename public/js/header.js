(()=>{
  ajax("get","header.html")
  .then(html=>{
    $("#header")[0].innerHTML=html;
    document.head.innerHTML=
      document.head.innerHTML+
        '<link rel="stylesheet" href="css/header.css">';
    var shelper=
      $("#shelper")[0],txtSearch=$("#txtSearch")[0];
    if(location.pathname.endsWith("products.html")
          &&location.search!="")
      txtSearch.value=
        decodeURIComponent(location.search.split("=")[1]);
    window.onclick=function(e){
      if(e.target.id!="shelper"&&e.target.id!="txtSearch")
        shelper.style.display="none";
    }
    txtSearch.onfocus=
    txtSearch.onkeyup=function(e){
      var txt=this;
      if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=13){
        if(txt.value!=""){
          shelper.style.display="block";
          ajax("get","product/search/"+txt.value)
          .then(data=>{
            data=JSON.parse(data);
            if(data.length>0){
              var html="";
              for(var obj of data){
                html+=
                `<li title="${obj.title}">
                  <div class="search-item">${obj.title}</div>
                </li>`
              }
              shelper.innerHTML=html;
            }else{
              shelper.innerHTML="未找到匹配商品";
            }
            return new Promise(resolve=>resolve())
          })
          .then(()=>{
            shelper.onclick=function(e){
              if(e.target.nodeName=="DIV"){
                txt.value=e.target.parentNode.title;
                setTimeout(
                  ()=>location="products.html?kw="+txt.value
                ,500);
              }
            }
            $("[data-trigger=search]")[0].onclick=function(e){
              e.preventDefault();
              if(txt.value!="")
                location="products.html?kw="+txt.value;
            }
          })
        }else
          shelper.style.display="none";
      }
    };
    txtSearch.onkeydown=function(e){  
      var txt=this; 
      if(shelper.style.display=="block"&&shelper.children.length!=0){
        if(e.keyCode==38||e.keyCode==40){
          var focusLi=shelper.find(".focus")[0];
          if(focusLi===undefined){
            shelper.children[0].className="focus";
          }else{
            switch(e.keyCode){
              case 38:
                if(focusLi==shelper.children[0]){
                  focusLi.className="";
                  shelper.lastElementChild.className="focus";
                }else{
                  focusLi.className="";
                  focusLi.previousElementSibling.className="focus";
                }
                break;
              case 40:
                if(focusLi==shelper.lastElementChild){
                  focusLi.className="";
                  shelper.firstElementChild.className="focus";
                }else{
                  focusLi.className="";
                  focusLi.nextElementSibling.className="focus";
                }
                break;
            }
          }
          txt.value=shelper.find(".focus")[0].title;
        }else if(e.keyCode==13){
          location="products.html?kw="+txt.value;
        }
      }
    }
    //为window绑定scroll事件
    $(window).scroll(()=>{
      //如果滚动距离>=60
      if($("body").scrollTop()>=60)
        //找到id为header-top的div，添加fixed_nav
        $("#header-top").addClass("fixed_nav");
      else//否则
        //找到id为header-top的div，移除fixed_nav
        $("#header-top").removeClass("fixed_nav");
    });
    function loadUser(){
      $.ajax({
        type:'get',
        url: 'users/checkLogin',
        success: function(result){
          if(result.uname){
            $('.login_info_1').html('&nbsp;欢迎:'+result.uname+' <a href="users/logout"' +
                ' title="退出登录">退出</a><b>|</b>');
            $('.login_info_2').html('<a href="uc_basic.html" title="用户中心">用户中心</a>');
            $('[href="users/logout"]').click(function(e){
              e.preventDefault();
              $.ajax({
                url: 'users/logout',
                success: function(result){
                  if(result.code===200){
                    alertMsg('<h4>退出成功</h4>点击确定重新返回登录页面');
                    $('#alertMsg').on('click', '#alertMsg_btn1 cite', function (e) {
                      e.preventDefault();
                      location.href = 'login.html';
                    })
                  }else {
                    alertMsg('登录退出失败！原因：'+result.msg);
                  }
                }
              })
            });
          }
        }
      });
    }
    loadUser();
    //mode为空，即只有一个确认按钮，mode为1时有确认和取消两个按钮
    function alertMsg(msg, mode) {
      msg = msg || '';
      mode = mode || 0;
      var top = document.body.scrollTop || document.documentElement.scrollTop;
      var isIe = (document.all) ? true : false;
      var isIE6 = isIe && !window.XMLHttpRequest;
      var sTop = document.documentElement.scrollTop || document.body.scrollTop;
      var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      var winSize = function(){
        var xScroll, yScroll, windowWidth, windowHeight, pageWidth, pageHeight;
        // innerHeight获取的是可视窗口的高度，IE不支持此属性
        if (window.innerHeight && window.scrollMaxY) {
          xScroll = document.body.scrollWidth;
          yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
          xScroll = document.body.scrollWidth;
          yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
          xScroll = document.body.offsetWidth;
          yScroll = document.body.offsetHeight;
        }
      
        if (self.innerHeight) {    // all except Explorer
          windowWidth = self.innerWidth;
          windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
          windowWidth = document.documentElement.clientWidth;
          windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }
      
        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
          pageHeight = windowHeight;
        } else {
          pageHeight = yScroll;
        }
      
        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
          pageWidth = windowWidth;
        } else {
          pageWidth = xScroll;
        }
      
        return{
          'pageWidth':pageWidth,
          'pageHeight':pageHeight,
          'windowWidth':windowWidth,
          'windowHeight':windowHeight
        }
      }();
      //遮罩层
      var styleStr = 'top:0;left:0;position:absolute;z-index:10000;background:rgba(0,0,0,.6);width:' + winSize.pageWidth + 'px;height:' +  (winSize.pageHeight + 30) + 'px;';
      var shadowDiv = document.createElement('div'); //添加阴影DIV
      shadowDiv.style.cssText = styleStr; //添加样式
      shadowDiv.id = "shadowDiv";
      //如果是IE6则创建IFRAME遮罩SELECT
      if (isIE6) {
        var maskIframe = document.createElement('iframe');
        maskIframe.style.cssText = 'width:' + winSize.pageWidth + 'px;height:' + (winSize.pageHeight + 30) + 'px;position:absolute;visibility:inherit;z-index:-1;filter:alpha(opacity=0);';
        maskIframe.frameborder = 0;
        maskIframe.src = "about:blank";
        shadowDiv.appendChild(maskIframe);
      }
      document.body.insertBefore(shadowDiv, document.body.firstChild); //遮罩层加入文档
    
    
      //弹出框
      var styleStr1 = 'display:block;position:fixed;_position:absolute;left:' + (winSize.windowWidth / 2 - 200) + 'px;top:' + (winSize.windowHeight / 2 - 150) + 'px;_top:' + (winSize.windowHeight / 2 + top - 150)+ 'px;'; //弹出框的位置
      var alertBox = document.createElement('div');
      alertBox.id = 'alertMsg';
      alertBox.style.cssText = styleStr1;
      //创建弹出框里面的内容P标签
      var alertMsg_info = document.createElement('P');
      alertMsg_info.id = 'alertMsg_info';
      alertMsg_info.innerHTML = msg;
      alertBox.appendChild(alertMsg_info);
      //创建按钮
      var btn1 = document.createElement('a');
      btn1.id = 'alertMsg_btn1';
      btn1.href = 'javascript:void(0)';
      btn1.innerHTML = '<cite>确定</cite>';
      btn1.onclick = function () {
        document.body.removeChild(alertBox);
        document.body.removeChild(shadowDiv);
        return true;
      };
    
      alertBox.appendChild(btn1);
      if (mode === 1) {
        var btn2 = document.createElement('a');
        btn2.id = 'alertMsg_btn2';
        btn2.href = 'javascript:void(0)';
        btn2.innerHTML = '<cite>取消</cite>';
        btn2.onclick = function () {
          document.body.removeChild(alertBox);
          document.body.removeChild(shadowDiv);
          return false;
        };
        alertBox.appendChild(btn2);
      }
      document.body.appendChild(alertBox);
    }
  });
})();

