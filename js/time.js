// 提示文章发布日期
function time_show() {
  // 增加一个页脚的美化
  var foot = document.getElementsByClassName("footer-inner")
  foot_con = '<div style="margin:5px">©2023 <i class="heart-icon fa-fw fas fa-heartbeat"></i> 永远相信美好的事情即将发生</div>'
  foot[0].insertAdjacentHTML('beforeend', foot_con);

  // 为页脚增加样式
  var footer=document.getElementsByClassName("footer-inner");
  fish='<div id="jsi-flying-fish-container" style="margin-top:-90px;line-height: 0;"></div>'
  footer[0].insertAdjacentHTML('afterend',fish);
  
  // 获取时间标签
  var times = document.getElementsByTagName('time');
  if (times.length === 0) { return; }
  // 获取文章内容
  var posts = document.getElementsByClassName('post-content');
  if (posts.length === 0) { return; }
  var pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
  var nowTime = new Date();  /* 当前时间戳 */
  var interval = parseInt(nowTime - pubTime)
  /* 发布时间超过指定时间（毫秒） */
  // if (interval > 3600*24*30*1000){
  var days = parseInt(interval / 86400000)
  // posts[0].innerHTML = '<div class="note note-warning" style="font-size:0.9rem">' +
  //   '<p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。' +
  //   '</p></div>' + posts[0].innerHTML;
  // }
  /*对js不是很理解，这里调试好久，用上述代码会导致图片加载不出来，原因是启动了懒加载，而innerHTML写入
  代码时候，有的图片还没有加载出来，这时候重新写入所以会导致一系列图片都加载不出来，所以尽量不要使用innerHTML方法
  */
  var html_con = '<div class="note note-warning" style="font-size:0.9rem">' +
    '<p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。' +
    '</p></div>'
  posts[0].insertAdjacentHTML('afterbegin', html_con);   // 直接将想要写的代码插入到元素后面
};
time_show();