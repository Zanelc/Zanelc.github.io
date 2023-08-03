---
title: Ollydbg--硬编码序列号寻踪三
categories:
  - 使用Ollydbg从零开始Cracking
tags:
  - Ollydbg基础使用
  - 硬编码寻踪
  - 菜鸡逆向
abbrlink: f0bbe23d
date: 2023-08-03 21:12:30
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/title.png
---

继续增加难度，对程序序列号进行破解。

<!--more-->

### Splish

**OD** 打开该程序，断在函数入口点 **401000** 处：

![OD载入](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803211731113.png)

**查找字符串** ，发现成功输入正确序列号时字符串提示，双击来到引用字符串处：

![查找字符串](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803212230713.png)

可以看到通过 **GetWindowTextA** 来获取用户输入，用 **MessageBoxA** 来提示序列号正确性，对 **GetWindowTextA** 处下断点：

![跳转到字符串引用处](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803212607309.png)

继续 **查看当前模块API函数** ，找到 **GetWindowTextA** 和 **MessageBoxA** 函数，对这两个函数下断点：

![当前模块API函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803211923320.png)

**F9** 一键运行程序到断点，用户输入保存至缓冲区 **403215** 处，然后将 **“hardCoded“ 地址赋给eax，输入序列号地址赋给ebx**：

![获取用户输入](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803235313814.png)

**对两个字符串逐个字符比较，当字符为空时，跳出循环，如果字符不一致，弹窗错误。**

![比较过程分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230803235828910.png)

由此处可以确定序列号为 **HardCoded** ，将**EIP设置为40138C，跳出循环**，此时继续往下执行，**弹窗正确**。

![此处设置为新EIP](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804000400469.png)

![弹窗正确](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804000437108.png)

#### 程序破解

程序的判断逻辑：**对输入的序列号与正确序列号逐字符进行比较，发现字符不同就弹窗错误，只有字符都相同，才会弹窗正确**，知道了逻辑后，程序的破解就很简单了，破解方法有很多，这里只演示一种常规方法，将逐字符比较的判断语句 **nop** 掉即可：

![程序破解](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804001023137.png)

保存修改，运行程序输入任意序列号，均可以弹窗正确！

![弹窗正确](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804001141116.png)
