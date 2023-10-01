---
title: ollydbg反调试
categories:
  - [使用Ollydbg从零开始Cracking,xdbg使用]
tags:
  - xdbg基础使用
  - 反调试基础
  - 菜鸡逆向
abbrlink: df09543b
date: 2023-09-30 11:57:35
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/title.png
---

很多程序会检测自身是否正在被调试，如果检测到正在被调试的话，就会结束自身进程或者不按常规流程运行，所以绕过程序对工具的检测是很有必要的。

<!--more-->

### IsDebuggerPresent检测

使用X32dbg来加载程序 **Crackme1.exe** ，**F9** 一键运行程序，程序直接终止。

![调试结束](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001012411540.png)

该 **Crackme** 可能使用的是最常见的 **API函数IsDebuggerPresent** 来检测是否被调试，重新加载程序，查看API函数列表，发现该函数。

![IsDebuggerPresent](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001012611448.png)

> IsDebuggerPresent函数解释：
>
> 作用
>     确定调用进程是否由用户模式的调试器调试。
> 语法
>     BOOL WINAPI IsDebuggerPresent(void);
> 参数
>     该函数没有参数
> 返回值
>     如果当前进程运行在调试器的上下文，返回值为非零值。
>     如果当前进程没有运行在调试器的上下文，返回值是零。

对这个函数下断点，查看调用情况，运行函数，执行到返回发现返回值为非零值，检测出当前属于调试模式。

![断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001012949225.png)

![执行到返回](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001013058433.png)

此时处于调试模式，继续执行，发现调用 **PostQuitMessage** 函数。

![PostQuitMessage](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001013321096.png)

> PostQuitMessage函数解释：
>
> PostQuitMessage 函数将WM_QUIT消息发布到线程的消息队列并立即返回;函数只是向系统指示线程正在请求在将来的某个时间退出。
>
> 当线程从其消息队列中检索 WM_QUIT 消息时，它应退出其消息循环，并将控制权返回到系统。 返回到系统的退出值必须是WM_QUIT消息的 wParam 参数

继续耐心跟踪过程，发现程序调用 **ExitProcess** 来退出进程，此时已经很清楚，程序通过 **IsDebuggerPresent** 来检测是否被调试，如果被调试就直接退出。

![ExitProcess](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001013736771.png)

知道了反调试原理，我们有多种方法来绕过反调试，首先运行程序到 **IsDebuggerPresent** 调用处，运行完该函数后，会有个条件跳转，将此处修改为无条件跳转，再次打开修补后的文件，即可正常调试。

![修改为无条件跳转](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001014112138.png)

![修补文件](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001014424835.png)

我们进一步分析 **IsDebuggerPersent** 原理，继续运行到函数处。

![image-20231001015006119](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001015006119.png)

![FS 寄存器](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001015419326.png)

在这里看到一个非常重要的寄存器 **FS** 的值，其实 **FS** 的值就是指向了一个结构体，该结构体包含了有关正在运行的程序的一些非常重要的信息，我们在数据窗口定位到这个地址。

![定位到FS](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001021541157.png)

该结构被称为TEB或TIB(线程环境块)，该结构保存了有关当前程序的非常重要的信息。例如：TIB被存储在哪里，程序堆栈从哪里开始以及从哪里结束。

在数据窗口中定位到 **FS:[0x30]** 地址为 **0039E000** ，查看该处地址，发现 **[EAX+0x2]** 处值为 **1**，此处就是我们要找的特殊字节，手动将此处值修改为 **0** ，**F9** 运行程序，因为修改了特殊字节的值，此时程序被认为未被调试。

![定位FS:[0x30]](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001022042288.png)

![eax+2](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001022142429.png)

![正常运行](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001022439534.png)

很多基于此的反调试插件，其实为我们做的就是上述的事情。尝试使用 **x32dbg** 本身的隐藏调试器功能，使用上述方法发现此时特殊字节的值修改为 **0**， **F9** 成功运行程序。

![隐藏调试器](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001142742796.png)

![特殊字节值被修改](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001143137469.png)

同理，使用插件 **ScyllaHide** 插件来反调试，特殊字节的值被修改为 **0**。

![image-20231001143241139](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001143241139.png)

![ScyllaHide](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231001143339972.png)
