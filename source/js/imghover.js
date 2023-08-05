(function(){
    var imgs=document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        img.style.transition = "transform 0.3s ease";   //添加过渡，不让缩放太突兀
        img.addEventListener("mouseover", function() {
          this.style.transform = "scale(1.1)"; // 添加缩放效果
        });
        img.addEventListener("mouseout", function() {
          this.style.transform = "scale(1)"; // 恢复原始缩放
        });
      }
})();