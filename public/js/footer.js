$(()=>{
  ajax("get","footer.html")
  .then(html=>{
      $("#footer").html(html);
    })
})