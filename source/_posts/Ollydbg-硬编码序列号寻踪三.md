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

继续增加难度，对程序序列号进行破解。						--未完待续

<!--more-->

### Splish

#### 程序分析

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

### SamBo

#### 程序分析

用 **OD** 载入该程序，提示该程序可能被 **加壳** ，我们先不管它，尝试加载，程序断在入口点 **4D4001** 处：

![提示加壳](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804004429485.png)

![OD载入](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804004456842.png)

**查看程序内存窗口（alt+M）**，发现程序入口点所属区段起始地址为4D4000，大小为2000H，入口点 **4d4001** ，代码段开始于 **401000**。

![内存窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804005102033.png)

从当前入口点开始解密其他区段，然后会跳转到真正的入口点处，**F9** 执行程序。

![程序窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804005359472.png)

弹出Crackme窗口，等待输入序列号，**表明该程序已经在内存中解密区段结束了，现在在执行代码段中的代码，我们在.text区段上设置一个内存访问断点，让程序执行代码段中的代码中断下来。**

![内存访问断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804005557395.png)

设置断点后，程序断在 **45c85f** 处，程序正在解密内存中的各种区段，我们手动分析一下源代码，**鼠标右键--分析--分析代码**。

![分析代码](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804005730190.png)

![分析代码](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804005949971.png)

可以看到分析后的代码，现在我们位于代码段，查看当前模块使用了哪些API函数，**为什么刚刚程序加载时候不查看，因为当时查看模块使用的API的话是查看的壳所在模块使用的API函数**。

![分析后的代码](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010104736.png)

![API函数列表](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010241817.png)

很不幸API函数列表中显示的是一些比较陌生的字符串，接下来尝试查看 **全局字符串** ，看看有没有有用信息，**发现提示成功的字符串**。

![全局字符串](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010459387.png)

查看字符串引用地方，发现这里存在 **比较指令和跳转指令，附近还有提示错误的代码块，但是并不是通过调用MessageBoxA函数来提示。**

![字符串引用](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010700724.png)

在 **test指令** 处设置断点，并清除之前设置的 **内存断点** ，然后运行程序，输入序列号。

![设置断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010840952.png)

![删除内存断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804010936972.png)

![输入序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011026150.png)

程序断下来之后，继续单步执行，发现跳转实现，**F9** 继续运行，弹窗提示成功。

![戏耍弹窗](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011302041.png)

点击确定，发现上一步弹窗是假的，只是**戏耍**我们。

![弹窗二](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011352103.png)

再次输入序列号提交，程序依然断在 **test指令** 处，这次修改标志位尝试不跳转：

![修改标志位](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011610215.png)

运行程序，弹窗成功！

![弹窗成功](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011641045.png)

得到结论：**这个跳转是觉得序列号是否正确的关键跳转** ，接下来分析一下跳转的具体代码：**test指令前还存在一个call指令，我们这次把断点设置在call指令，查看一下堆栈情况**。

![堆栈分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804011952145.png)

**堆栈中存在刚刚输入的序列号，数据窗口跟随定位到字符串，此时可以看到数据窗口中存在字符串 1556555 ，可能是正确序列号，我们对错误序列号设置内存访问断点，当错误序列号与正确序列号进行比较的话，就会断下来。**

![内存访问断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/f0bbe23d/image-20230804012218874.png)

**F9** 运行程序，如果 **call** 指令中有访问该内存，就会中断下来，实际运行发现中断下来了(文档教程中明确说明：不会中断下来， **此处的call指令并没有对序列号进行对比**)，目前没有搞清楚原因在哪里，也可能是太菜了，先暂停！

