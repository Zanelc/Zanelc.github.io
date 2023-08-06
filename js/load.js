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