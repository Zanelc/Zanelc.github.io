---
title: Ollydbg--硬编码序列号寻踪二
categories:
  - 使用Ollydbg从零开始Cracking
tags:
  - Ollydbg基础使用
  - 硬编码寻踪
  - 菜鸡逆向
abbrlink: b2e77430
date: 2023-08-01 22:12:54
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/title.png
---

上一章节中已经讲了OD的一些常用基本操作，并尝试对两个简单的程序进行破解，本章节继续熟悉OD的操作，并增加难度，对两个相对难一点的程序序列号进行破解。

<!--more-->

### 示例一：mielecrackme1

#### 程序分析

老规矩，打开OD加载程序，程序断在函数入口点(**401000**)处：

![OD加载程序](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801232749135.png)

使用 **中文搜索引擎** 查找全局字符串，发现大量字符串，有经验的话，对字符串进行分析，大概能猜测到序列号：

![查找字符串](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801232850239.png)

无法确定具体序列号，查看 **当前模块API函数列表（ctrl+n）**，发现几个比较重要的API函数：**GetWindowTextA** 用于获取用户输入，**lstrcmpA** 用于字符串的比较，**MessageBoxA** 显示弹窗：

![当前模块API函数列表](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801233131850.png)

根据上一章的经验，我们对 **lstrcmpA** 函数下断点，看看函数是如何进行比较的，**F9** 运行程序：

![输入序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801233533768.png)

程序断在 **lstrcmpA** 函数这里，查看堆栈窗口，发现两个字符串，一个为我们的输入，一个大概率为正确的序列号：

![程序断在lstrcmpA入口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801233729491.png)

对该函数进行分析，可以发现，**两条mov指令其实就是将两个字符串地址存储在寄存器edx和ecx中**：

![lstrcmpA分析一](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801234320345.png)

![lstrcmpA分析二](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801234651857.png)

具体API函数的细节我们不再分析，接下来执行到返回，继续单步执行 **F7** 跳转到主模块，发现 **or指令和jnz跳转指令 ，判断返回的eax是否为0，如果不为0则跳转至错误弹窗**：

![判断EAX是否为0](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801235135739.png)

![跳转实现，弹窗错误](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801235527313.png)

**F9** 运行程序，弹窗错误：

![弹窗错误](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801235644233.png)

接下来我们尝试一下输入正确的序列号 **cannabis** ，看看程序的执行过程：

![输入正确序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801235822439.png)

可以看到，当输入正确序列号时，**lstrcmpA** 函数执行过后 **EAX的值为0**，此时将跳转失败，弹窗正确：

![EAX=0](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230801235954012.png)

![弹窗正确](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802000105776.png)

![运行结果](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802000141188.png)

#### 程序破解

程序的破解也很简单，知道了整个流程，只需将程序的跳转语句 **nop** 掉，不执行跳转即可：

![nop掉跳转语句](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802000401501.png)

将文件保存后运行，输入任意字符串，破解成功：

![破解成功](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802000559343.png)

**注：** 此例中新增了个函数 
[lstrcmpa]: https://learn.microsoft.com/zh-cn/windows/win32/api/winbase/nf-winbase-lstrcmpia

，该函数对两个字符串进行比较，如果相等则返回0，在此例中，返回结果保存在 **EAX** 中，用 **OR** 判断 **EAX** 是否为0，若为0，则证明两个字符串相等。

![lstrcmpa函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802000855166.png)