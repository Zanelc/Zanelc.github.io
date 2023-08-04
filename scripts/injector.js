// 文章时效提醒
hexo.extend.injector.register('body_end', '<script src="/js/time.js"></script>', 'default');
// emoji点击效果
hexo.extend.injector.register('body_end', '<script src="/js/emoji.js"></script>', 'default');
// 网站运行时长
hexo.extend.injector.register('body_end', '<script src="/js/duration.js"></script>', 'default');