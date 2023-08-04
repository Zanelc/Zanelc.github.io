// 提示文章发布日期
(function() {
    // 获取时间标签
    var times = document.getElementsByTagName('time');
    if (times.length === 0) { return; }
    // 获取文章内容
    var posts = document.getElementsByClassName('post-content');
    if (posts.length === 0) { return; }
  
    var pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
    var nowTime = Date.now()  /* 当前时间戳 */
    var interval = parseInt(nowTime - pubTime)
    /* 发布时间超过指定时间（毫秒） */
    // if (interval > 3600*24*30*1000){
    var days = parseInt(interval / 86400000)
    posts[0].innerHTML = '<div class="note note-warning" style="font-size:0.9rem">' +
      '<p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。' +
      '</p></div>' + posts[0].innerHTML;
    // }
  })();