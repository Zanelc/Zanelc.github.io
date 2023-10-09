---
title: ollydbg反调试一
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

了解了反调试原理，我们有多种方法来绕过反调试，首先运行程序到 **IsDebuggerPresent** 调用处，运行完该函数后，会有个条件跳转，将此处修改为无条件跳转，再次打开修补后的文件，即可正常调试。

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

### 进程名检测

使用 **x32dbg** 打开 **DaXXoR.ExE** 程序，**F9** 运行程序弹出报错，如何应对这种检测呢，重新加载该程序。

![弹窗错误](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010000442300.png)

查看当前程序的 **API** 函数，发现有很多都不是用于检测进程名的， **如果程序不直接导入API的话，会使用GetProcAddress这个API函数来获取这些API函数的地址进行间接调用。**

![GetProcAddress函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010000720413.png)

对该函数下断点，运行起来，当前待获取的函数是 **__CPPdebugHook**，该函数检测进程名没有关系，继续运行。

![当前获取函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010000846919.png)

运行到获取 **EnumProcesses** 这个函数的地址，接着运行到返回获取得到函数地址，对该地址设置断点。

![EnumProcesses函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010001053262.png)

![设置断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010001232179.png)

> EnumProcesses函数：
>
> BOOL EnumProcesses(
>   [out] DWORD   *lpidProcess,
>   [in]  DWORD   cb,
>   [out] LPDWORD lpcbNeeded
> );
>
> [out] lpidProcess
>
> 指向接收进程标识符列表的数组的指针。
>
> [in] cb
>
> pProcessIds 数组的大小（以字节为单位）。
>
> [out] lpcbNeeded
>
> pProcessIds 数组中返回的字节数。

**EnumProcesses** 函数运行后进程ID保存在地址 **0019ED98** 处，大小共计 **3E8** 个字节，之前多次测试都没有找到当前进程的ID，后来手动调用 **EnumProcesses** 函数发现返回结果中可以查到当前进程的PID，最终发现原因是数组太小，此时提前修改数组大小，修改为 **1000**。

以下是一个简单的C++调用 **EnumProcesses** 函数示例。

```C++
#include <windows.h>
#include <iostream>
#include <Psapi.h>
int main()
{
    DWORD processIds[1024], bytesReturned;
    if (!EnumProcesses(processIds, sizeof(processIds), &bytesReturned))
    {
        std::cout << "EnumProcesses failed with error code: " << GetLastError() << std::endl;
        return 1;
    }

    DWORD processCount = bytesReturned / sizeof(DWORD);
    std::cout << "Number of processes: " << processCount << std::endl;

    for (DWORD i = 0; i < processCount; i++)
    {
        std::cout << "Process ID: " << processIds[i] << std::endl;
    }

    return 0;
}
```

![EnumProcesses入参分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010003114870.png)

继续运行到返回，查看地址 **0019ED98** 处内容，发现返回所有进程ID信息全部在这里。

![image-20231010003622837](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010003622837.png)

windows 任务管理器查看 **x32dbg** 进程ID，PID为13204（0x3394），成功枚举处进程ID，在 **0019F2AC** 处设置内存访问断点。

![PID](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010003806612.png)

![成功找到PID](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010004029406.png)

继续运行函数，程序访问该处地址断下来，发现此时将要调用 **OpenProcess** 函数，如果调用成功，就会获取 **x32dbg** 进程的句柄。

![OpenProcess函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010004504188.png)

**F8** 步过函数，获取进程句柄为 **1DC** ，返回值保存在 **EAX** 中，句柄窗口中成功找到该句柄。

![获取句柄](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010004654485.png)

![句柄窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010004731477.png)

继续单步执行，发现 **EnumProcessModules** 函数，该函数枚举指定进程的模块，**F7** 跟进到函数入口处。

![image-20231010005143222](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010005143222.png)

中途有重新加载程序，操作跟之前一样，获取的句柄为 **1E8，当我们请求获取进程中模块句柄的时候,系统会返回该模块在进程内存中基地址(模块起始地址)** ，系统返回的是 **400000**。

![EnumProcessesModules](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010010445396.png)

继续跟进，发现 **GetModuleBaseNameA** 函数，该函数是获取指定进程模块的名称，跟进该函数，成功获取到进程的名称 **x32dbg.exe**。

![image-20231010011314805](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010011314805.png)

![进程模块名称](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010011526800.png)

继续运行，程序使用 **CloseHandle** 来关闭句柄，然后调用 **sub_45DAC0** 函数来将进程名称转为大写，再对 **X32DBG.EXE** 与 **OLLYDBG.EXE** 进行比对。

![字符串比较](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010012018857.png)

显然，二者不等，跳转实现，不会执行下面的 **TerminateProcess** 函数，如果后台确实有 **X32DBG.EXE** ,进程最终退出。**实际执行结果有出入，因为使用了x32dbg来调试的，通过前面的分析，我们可以得知如果出现OLLYDBG.EXE进程的话，程序最终会退出。** 于是在启动 **x32dbg** 后，后台启动了 **OLLYDBG** ，也成功获取到了 **PID** ，但是最后还是没有实现退出程序，因为最后进程名称对比时，并不是跟 **OLLYDBG.EXE** 对比，而是跟其他的名称对比，看了一下字符串窗口，发现程序不止检测 **OD**，应该还会检测其他匹配名称的调试工具，**后来发现程序会多次调用EnumProcesses，猜测每次调用EnumProcesses时使用不同的字符串来进行匹配比对**。

![字符串窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010013637109.png)

具体原理不再一一分析，绕过检测的方法也比较简单，可以继续使用 **x32dbg** 自带的 **隐藏调试器** 功能来绕过，成功运行该程序。

![成功运行](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010014438469.png)

查看日志窗口，发现通过卸载 **psapi.dll** 来实现反调试功能。

![日志窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/df09543b/image-20231010014526216.png)

同样可以使用 **ScyllaHide** 插件来绕过。
