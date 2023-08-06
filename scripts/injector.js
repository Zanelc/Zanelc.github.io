// 文章时效提醒   为了简便，后续多余的功能能写到time.js文件中的就写到该文件中了
hexo.extend.injector.register('body_end', '<script src="/js/time.js"></script>', 'default');
// emoji点击效果
hexo.extend.injector.register('body_end', '<script src="/js/emoji.js"></script>', 'default');
// 网站运行时长
hexo.extend.injector.register('body_end', '<script src="/js/duration.js"></script>', 'default');
// 文章图片浮动
hexo.extend.injector.register('body_end', '<script src="/js/imghover.js"></script>', 'home');
// 添加花瓣飘落
// hexo.extend.injector.register('body_end', '<script src="/js/sakura.js"></script>', 'home');
// 图片预加载动画，在主题中修改
// hexo.extend.injector.register('body_end', '<script src="/js/load.js"></script>', 'default');
// 自定义js实现
hexo.extend.injector.register('body_end', '<script src="/js/custom.js"></script>', 'default');