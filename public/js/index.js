(()=>{
  var bannerImgs=$("[data-load=bannerImgs]")[0],
      bannerInds=$("[data-load=bannerInds]")[0],
      n=0,LIWIDTH=960,TRANS=300,INTERVAL=2000,
      timer=null;
  ajax("get","banner")
    .then(data=>{
      data=JSON.parse(data);
      var banners=[...data];
      banners.push(banners[0]);
      var strImgs="";
      for(var img of banners){
        strImgs+=
          `<li>
            <a href="${img.href}">
              <img src="${img.img}">
            </a>
          </li>`
      }
      var strInds="<li></li>".repeat(banners.length-1);
      bannerImgs.innerHTML=strImgs;
      bannerImgs.style.width=960*banners.length+"px";
      bannerInds.innerHTML=strInds;
      bannerInds.children[0].className="hover";
      return new Promise(resolve=>resolve());
    })
    .then(()=>{
      function moveOnce(){
        n++;
        var left=LIWIDTH*n;
        bannerImgs.style.left=-left+"px";
        bannerInds.children[n-1].className="";
        if(n==bannerImgs.children.length-1){
          bannerInds.children[0].className="hover";
          setTimeout(()=>{  
            bannerImgs.style.transition="";
            bannerImgs.style.left=0;
            n=0;
            setTimeout(()=>{
              bannerImgs.style.transition=
                "all ."+TRANS/100+"s linear";
            },100);
          },TRANS);
        }else
          bannerInds.children[n].className="hover";
      }
      timer=setInterval(moveOnce,INTERVAL+TRANS);
      return new Promise(resolve=>resolve(moveOnce));
    })
    .then((moveOnce)=>{
      bannerImgs.parentNode.onmouseover=function(){
        clearInterval(timer);
        timer=null;
      }
      bannerImgs.parentNode.onmouseout=function(){
        timer=setInterval(moveOnce,INTERVAL+TRANS);
      }
      for(let i=0;i<bannerInds.children.length;i++){
        bannerInds.children[i].onclick=function(){
          n=i;
          bannerImgs.style.left=-n*LIWIDTH+"px";
          bannerInds.find(".hover")[0].className="";
          bannerInds.children[i].className="hover";
        }
      }
      $("[data-move=left]")[0].onclick=function(e){
        e.preventDefault();
        if(n>0){
          n--;
          bannerImgs.style.left=-n*LIWIDTH+"px";
          bannerInds.children[n+1].className="";
          bannerInds.children[n].className="hover";
        }else{
          bannerImgs.style.transition="";
          n=bannerImgs.children.length-1;
          bannerImgs.style.left=-n*LIWIDTH+"px";
          setTimeout(()=>{
            bannerImgs.style.transition=
              "all ."+TRANS/100+"s linear";
            n--;
            bannerImgs.style.left=-n*LIWIDTH+"px";
            bannerInds.children[0].className="";
            bannerInds.children[n].className="hover";
          },100)
        }
      }
      $("[data-move=right]")[0].onclick=function(e){
        e.preventDefault();
        if(n<bannerInds.children.length-1){
          n++;
          bannerImgs.style.left=-n*LIWIDTH+"px";
          bannerInds.children[n-1].className="";
          bannerInds.children[n].className="hover";
        }else{
          n++;
          bannerImgs.style.left=-n*LIWIDTH+"px";
          bannerInds.lastElementChild.className="";
          bannerInds.firstElementChild.className="hover";
          setTimeout(()=>{
            bannerImgs.style.transition="";
            bannerImgs.style.left=0;
            n=0;
            setTimeout(()=>{
              bannerImgs.style.transition=
                "all ."+TRANS/100+"s linear";
            },100)
          },TRANS)
        }
      }
    })
    .catch(err=>console.log(err))
})();
(()=>{
  ajax("get","floors")
  .then(data=>{
      data=JSON.parse(data);
    var {
      recommendedItems: rcmds,
      newArrivalItems: nas,
      topSaleItems: tss
    }=data;
    for(var i=0,html="";i<rcmds.length;i++){
      html+=i<2?
        `<div>
        <div class="desc">
          <p class="name">${rcmds[i].title}</p>
          <p class="details">${rcmds[i].details}</p>
          <p class="price">¥${rcmds[i].price}</p>
          <a href="${rcmds[i].href}" class="view">查看详情</a>
        </div>
        <img src="${rcmds[i].pic}">
      </div>`:
      i<3?
      `<div>
        <div class="desc">
          <p class="name">${rcmds[i].title}</p>
          <p class="price">¥${rcmds[i].price}</p>
          <a href="${rcmds[i].href}" class="view">查看详情</a>
        </div>
        <img src="${rcmds[i].pic}">
      </div>`:
      `<div class="product">
        <img src="${rcmds[i].pic}">
        <p class="name">${rcmds[i].title}</p>
        <p class="price">¥${rcmds[i].price}</p>
        <a href="${rcmds[i].href}">查看详情</a>
      </div>`
    }
    $('#f1 .floor-content')[0].innerHTML=html;
    for(var i=0,html="";i<nas.length;i++){
      html+=i<2?
        `<div>
        <div class="desc">
          <p class="name">${nas[i].title}</p>
          <p class="details">${nas[i].details}</p>
          <p class="price">¥${nas[i].price}</p>
          <a href="${nas[i].href}" class="view">查看详情</a>
        </div>
        <img src="${nas[i].pic}">
      </div>`:
      i<3?
      `<div>
        <div class="desc">
          <p class="name">${rcmds[i].title}</p>
          <p class="price">¥${rcmds[i].price}</p>
          <a href="${rcmds[i].href}" class="view">查看详情</a>
        </div>
        <img src="${rcmds[i].pic}">
      </div>`:
      `<div class="product">
        <img src="${nas[i].pic}">
        <p class="name">${nas[i].title}</p>
        <p class="price">¥${nas[i].price}</p>
        <a href="${nas[i].href}">查看详情</a>
      </div>`
    }
    $('#f2 .floor-content')[0].innerHTML=html;
    for(var i=0,html="";i<tss.length;i++){
      html+=i<2?
        `<div>
        <div class="desc">
          <p class="name">${tss[i].title}</p>
          <p class="details">${tss[i].details}</p>
          <p class="price">¥${tss[i].price}</p>
          <a href="${tss[i].href}" class="view">查看详情</a>
        </div>
        <img src="${tss[i].pic}">
      </div>`:
      i<3?
      `<div>
        <div class="desc">
          <p class="name">${rcmds[i].title}</p>
          <p class="price">¥${rcmds[i].price}</p>
          <a href="${rcmds[i].href}" class="view">查看详情</a>
        </div>
        <img src="${rcmds[i].pic}">
      </div>`:
      `<div class="product">
        <img src="${tss[i].pic}">
        <p class="name">${tss[i].title}</p>
        <p class="price">¥${tss[i].price}</p>
        <a href="${tss[i].href}">查看详情</a>
      </div>`
    }
    $('#f3 .floor-content')[0].innerHTML=html;
    return new Promise(resolve=>resolve());
  })
  .then(()=>{
    var fTops=$(".floor>.floor-top");
    var strLis="";
    for(var fTop of fTops){
      strLis+=
        `<li class="lift_item">
          <a href="javascript:;" class="lift_btn">
            <span class="lift_btn_txt">${
              fTop.innerHTML.slice(0,4)
            }</span>
          </a>
        </li>`
    }
    var ulLift=$("#lift>ul")[0];
    ulLift.innerHTML=strLis;
    ulLift.children[0].className="lift_item lift_item_on";
    function getOffsetTop(elem){
      var offsetTop=elem.offsetTop;
      while(elem.offsetParent){
        elem=elem.offsetParent;
        offsetTop+=elem.offsetTop;
      }
      return offsetTop;
    }
    var floors=[...$(".floor")];
    for(var f of floors){
      f.totalTop=getOffsetTop(f);
    }
    var DIST=0,DURA=500,STEPS=100,
        moved=0,step=0,interval=DURA/STEPS,
        timer=null;
    function moveTo(i){
      if(timer!=null){
        clearInterval(timer);
        timer=null;
        moved=0;
      }
      DIST=floors[i].totalTop-document.body.scrollTop;
      step=DIST/STEPS;
      timer=setInterval(moveStep,interval);
    }
    function moveStep(){
      moved++;
      window.scrollBy(0,step);
      if(moved==STEPS){
        clearInterval(timer);
        timer=null;
        moved=0;
        checkOn();
      }
    }
    for(let i=0;i<ulLift.children.length;i++){
      ulLift.children[i].onclick=function(){
        moveTo(i);
      }
    }
    window.addEventListener("scroll",function(){
      var minTop=floors[0].totalTop-innerHeight/2;
      if(document.body.scrollTop>=minTop)
        ulLift.parentNode.style.display="block";
      else
        ulLift.parentNode.style.display="";
      checkOn();
    })
    var FHEIGHT=parseFloat(getComputedStyle(floors[0]).height)+20;
    function checkOn(){
      var scrollTop=document.body.scrollTop;
      for(var i=0;i<floors.length;i++){
        if(scrollTop>=floors[i].totalTop-innerHeight/2
            &&scrollTop<floors[i].totalTop+FHEIGHT-innerHeight/2)
          ulLift.children[i].className="lift_item lift_item_on";
        else
          ulLift.children[i].className="lift_item";
      }
    }
  })
})();