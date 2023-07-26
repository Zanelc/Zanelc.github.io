---
title: Hexo 备份、恢复
date: 2023-07-26 23:13:45
tags:
---

hexo网上搭建教程很多，这里就不再复述了，鉴于每次重装系统后都需要重新部署环境，特意重新写一篇教程来讲述博客备份及恢复。

## 备份

Hexo博客搭建并部署至github上之后，创建一个新分支用来存放源代码，我这里博客网页静态文件分支为 **main**，新建一个**source**分支来存放代码:

```bash
## 创建新分支之前，需要先初始化git仓库，在本地博客目录下执行:
git init
## 创建新分支 ， 这里命名为 source
git checkout -b "source"
## 添加远程仓库 ， 这里仓库名称为博客所在仓库
git remote add origin 仓库名称
```

添加远程仓库成功后，配置**.gitignore**文件，该文件用来指示哪些文件在push时候忽略，默认已经配置好了，我这里内容为:

```bash
## gitignore文件内容
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
_multiconfig.yml
```

接下来使用组合技:

```bash
git add .
git commit -m "注释信息"
## 要提交的是 source 分支
git push origin source
```

提交成功后，仓库会新增一个**source**分支，该分支内容如下:

```bash
.github
scaffolds
source
themes
.gitignore
_config.fluid.yml
_config.yml
package-lock.json
package.json
```

至此博客的备份任务已经完成，当博客源代码有改动时候，便可将改动提交到该分支。

## 恢复

**注意：**如果用的是windows备份的，最好恢复也是在windows平台，不然在安装依赖时候，会出现很多问题，大概率是不同版本的依赖文件有差异。

这里用windows平台举例，假设windows机器刚装完系统，未配置任何环境，先安装**git**、**nodejs**环境。

```bash
## 配置git信息
git config --global user.name yourname
git config --global user.email youremail
## 如果已经有公钥，将公钥上传到github，若无，重新创建
ssh-keygon -t rsa -C youremail
## 安装完nodejs环境后,安装hexo命令
npm install hexo-cli -g
```

克隆远程仓库，注意，拉取 **source** 分支即可

`git clone -b source 仓库名称`

进入该仓库目录，安装依赖：

`npm install`

至此博客恢复部署完成，可以在本地尝试一下，看是否正常运行:

```bash
hexo c //删除public文件夹
hexo g //在hexo站点根目录下生成public文件夹
hexo s //本地启动服务
hexo d //部署站点，在本地生成.deploy_git文件夹，并将编译后的文件上传至 GitHub
```
## 小Tips
每次手动部署推送还是挺麻烦的，使用python脚本一键部署：

```python
## 一键部署
import os
static_cmd="hexo c && hexo g && hexo d"
source_cmd="git add . && git commit -m 'source update' && git push origin source"
try:
    os.system(static_cmd)
    print("网页push成功！")
    os.system(source_cmd)
    print("源代码push成功！")
except:
    print("部署失败，请手动检查情况！")
```

### 注意

有时候出现测试git连接失败、或推送失败、部署失败，大概率是因为**代理**问题，关闭代理或参考以下方法重新部署：

```bash
## 在clash规则里面添加的，用于22端口直连，因为ssh使用的是22端口
- DST-PORT,22,DIRECT 
## 测试git连接
ssh git@github.com
```

