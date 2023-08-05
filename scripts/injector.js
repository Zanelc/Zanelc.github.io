// 文章时效提醒
hexo.extend.injector.register('body_end', '<script src="/js/time.js"></script>', 'default');
// emoji点击效果
hexo.extend.injector.register('body_end', '<script src="/js/emoji.js"></script>', 'default');
// 网站运行时长
hexo.extend.injector.register('body_end', '<script src="/js/duration.js"></script>', 'default');

// 文章图片浮动
hexo.extend.injector.register('body_end', '<script src="/js/imghover.js"></script>', 'home');
// 添加花瓣飘落
hexo.extend.injector.register('body_end', '<script src="/js/sakura.js"></script>', 'home');
hexo.extend.injector.register('body_end', '<script src="/js/load.js"></script>', 'home');
