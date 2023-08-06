// 图片预加载，主题配置文件中直接写预加载图片路径即可，不用自定义函数，此函数废弃
(function(){
    var imgs=document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var tempImage=new Image();
        tempImage.src="/img/load.gif";
        tempImage.addEventListener("load",function(){
            img.src=tempImage.src;
            img.classList.add("fade-in");
        })
      }
})();