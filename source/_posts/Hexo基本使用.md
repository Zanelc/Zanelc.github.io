---
title: Hexo基本使用
categories:
  - Hexo 博客
tags:
  - hexo
abbrlink: 11292
date: 2023-07-28 00:35:07
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/11292/title.jpg
---

Hexo相关的一些基础配置说明。
<!-- more -->

### Front-matter

front-matter是文件最上方以 `---` 分隔的区域，用于指定个别文件的变量，例如

```yaml
---
title: Hello World
date: 1996/01/01 00:00:00
---
```

常用的参数如下：

| 参数       | 描述             | 默认值                |
| ---------- | ---------------- | --------------------- |
| layout     | 布局             | config.default_layout |
| title      | 标题             | 文件名                |
| date       | 建立日期         | 文件建立日期          |
| updated    | 更新日期         | 文件更新日期          |
| comments   | 开启评论         | true                  |
| tags       | 标签             | /                     |
| categories | 分类（文章分类） | /                     |
| hide       | 隐藏文章         | 默认false             |
| index_img  | 文章封面图       | /                     |
| banner_img | 文章顶部大图     | /                     |

###　配置文件

> "站点配置" 指的 Hexo 博客目录下的 _**config.yml**，"主题配置" 指的是 theme/fluid/_**config.yml** 或者 **_config.fluid.yml**

只要存在于 **_config.fluid.yml** 的配置都是高优先级，修改原 **_config.yml**是无效的，创建该文件主要是为了后续升级方便。

### 文字摘要

摘要默认自动开启，有两种方式来手动指定摘要：

```yaml
正文一部分作为摘要
<!-- more -->
正文
```

另一种是在**Front-matter**中指定，添加 `excerpt`字段：

```yaml
---
title:
date:
excerpt: 摘要
---
```

