---
title: IDA Pro基础使用教程
tags:
  - IDA pro使用教程
categories:
  - [逆向工具,IDA使用]
abbrlink: e31f7c37
date: 2023-08-10 23:46:37
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/title.png
---
主要介绍IDA Pro工具的基本使用，以便能够在逆向工作中更加得心应手。
<!--more-->

### IDA文件加载

当拖动文件进入 **IDA** 时，会出现一个加载对话框，**IDA** 会生成一个可能的文件类型列表，并在对话框顶部显示这个列表。**Binary file** 是这个列表的最后一个选项，它会一直显示，它是 **IDA** 加载无法识别的文件的默认选项。绝大多数情况下，默认选项提供的都是最佳的反汇编选项，对于二进制文件，**IDA** 不会进行任何初始反汇编。

![文件加载](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811004152315.png)

### IDA数据库文件

**IDA** 加载文件时，会创建一个数据库，其组件分别保存在4个文件中，扩展名分别为 **.id0、.id1、.nam、.til**。当关闭项目时，这4个文件通常被存档，也可以选择将它们压缩成一个 **IDB** 文件，人们说到 **IDA** 数据库时实际上指的是 **IDB** 文件。

![IDA关闭](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811005823276.png)

- Don't pack database：不打包数据库，不创建 **IDB** 文件
- Pack databse(Store)：打包数据库(存储)，创建 **IDB** 文件，4个数据库组件文件被删除
- Pack database(Deflate)：打包数据库(压缩)，跟上面的区别是对 **IDB** 文件进行了压缩
- Collect garbage：通常在磁盘空间不足时才选择这个
- Don't Save the database：相当于撤销或还原功能

### IDA桌面

**IDA** 成功加载文件后，显示信息大致如下：

![加载文件](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811011226201.png)

**概况导航栏：** 导航带是被加载文件地址空间的线性视图。

![导航带](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811010924166.png)

**反汇编视图：** 它有两种不同的形式，图形视图和列表视图，使用 **空格键** 在图形视图和列表视图之间切换。

![图形视图](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811011500912.png)

**输出窗口：** 显示 **IDA** 输出的信息，输出窗口基本上等同于一个控制台输出设备。

**函数窗口：** 默认是IDA显示窗口的最后一部分。

当输出窗口提示 **The initial autoanalysis has been finished** ，表示初步分析已完成，这时，你可以对数据库进行任意更改。

### IDA数据显示窗口

**几乎所有的操作都有其对应的菜单项、热键和工具栏按钮，IDA的工具栏高度可配置。**

在 **IDA** 中，**ESC** 是一个非常有用的快捷键，它在反汇编窗口是非常有用，相当于浏览器中的后退按钮。

#### 反汇编窗口

**绿色箭头表示Yes，红色箭头表示No，只有一个后继块的基本块会使用蓝色箭头指向下一个即将执行的块。**

在图形模式下， **IDA一次显示一个函数**。

![图形视图](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811012647810.png)

**文本视图**：通常虚拟地址以 **[区域名称]:[虚拟地址]** 这种格式显示。左边部分叫做 **箭头窗口**： **实现箭头表示非条件跳转，虚线箭头表示条件跳转**。

![文本视图](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811013604017.png)

**代码交叉引用**，它表示另一个程序指令将控制权转交给交叉引用注释所在位置的指令。

![代码交叉引用](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811014041357.png)

#### 函数窗口

用于列举 **IDA** 在数据库中识别到的 **每一个函数**。

![函数窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811014256447.png)

#### 十六进制窗口

如果一个反汇编窗口和一个十六进制窗口 **同步**，在一个窗口中滚动鼠标，另一个窗口也会滚动到同一虚拟地址处。有时候，十六进制窗口中显示的都是 **??** 号，表示 **IDA** 无法识别给定的虚拟地址范围内的值，如果程序包含一个BSS节，就会出现这种情况。**bss节不占用文件的空间，但是加载器会扩展这一节，以适应程序的静态存储要求。**

![十六进制窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811015004528.png)

#### 导出窗口

**导出窗口列出文件的入口点，这包括程序的执行入口点，以及任何由文件导出给其他文件使用的函数和变量。** 导出的项目案 **名称、虚拟地址和序数** 排列，对于可执行文件，导出窗口中至少包含一个项目：**程序的执行入口点**，**IDA** 讲这个入口点取名为 **start**。

![导出窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811020025185.png)

#### 导入窗口

**导入窗口列出由被分析的二进制文件导入的所有函数。** **静态链接的二进制文件保存在外部依赖关系**，因此不需要导入其他内容。

导入窗口每个条目列出一个导入项目的名称，以及包含该项目的库的名称。由于被导入的函数位于共享库中，窗口中的每个条目列出的地址相关导入表条目的虚拟地址。，双击条目，**IDA** 将跳转到条目对应地址处，而内存中显示内容为 **?? ?? ?? ??**。 **因为IDA是一种静态分析工具，它无法获知程序在执行时会在这个内存输入什么地址。**

![导入表](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811020740746.png)

![导入表条目地址](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811020758335.png)

**String窗口**

**String窗口显示从二进制文件中提取的一组字符串，以及每个字符串所在的地址。**

忽略指令/数据定义：这个选项的作用是确保 **IDA** 会在所有可能发现字符串的地方扫描各种类型的字符串。

![String窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811021410454.png)

![忽略指令/数据定义](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811022048308.png)

#### Names窗口

**名称是对一个程序虚拟地址的符号描述。**

如果一个位置在程序符号表中命名，**IDA** 将采用该名称，如果没有名称，**则IDA会生成一个默认的名称**。

![Names窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230811022628217.png)

在 **IDA** 给某个位置命名时，它会使用 **该位置的虚拟地址和一个表示该位置的类型** 的前缀进行命名，常见的前缀包括下面这些：

- sub_xxxxxx：地址xxxxxx处的子例程
- loc_xxxxxx：地址xxxxxx处的一个指令
- byte_xxxxxx：位置xxxxxx处的8位数据
- word_xxxxxx：位置xxxxxx处的16位数据
- dword_xxxxxx：位置xxxxxx处的32位数据
- unk_xxxxxx：位置xxxxxx处的大小未知的数据

**loc和sub指令区别**：loc指令相当于一处标记，一般都是跳转到loc处，如：jmp loc_xxxxxx；而sub指令相当于一个函数，一般是进行函数调用，如：call sub_xxxxxx。

### 导航

记住大量地址并非易事，这促使早期的程序员给他们希望引用的程序位置分配符号名称，**给符号分配名称，与给程序操作码分配助记指令名称并无不同**。

#### 交叉引用

**IDA** 的交叉引用通常简称为 **XREF** ，**IDA** 中有两类基本的交叉引用：**代码交叉引用** 和 **数据交叉引用** ，所有的引用的都是在 **一个地址引用另一个地址** 。

如下是一个交叉引用，地址中总有一个上行或下行箭头，表示 **引用位置的相对方向** ，由函数调用导致的交叉引用使用后缀 **p** ，跳转交叉引用使用后缀 **j**。下图中下行箭头表示  **.text:004011E6** 地址比当前行地址高，需要向下才能到达该地址。 

![代码交叉引用](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813010358980.png)

**数据交叉引用** 用于跟踪二进制文件访问数据的方式。**IDA** 中最常用的三种数据交叉引用分别用于表示某个位置何时被 **读取**、何时被 **写入** 以及何时被 **引用** 。

**后缀r** 表示读取交叉引用，**后缀w** 表示写入交叉引用，**后缀o** 表示偏移量交叉引用，它表示引用的是某个位置的地址而不是内容。

![数据交叉引用](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813011728966.png)

双击 **sub_401000+1E** 处交叉引用，可以看到引用的为该处地址 **offset dword_402004**，而非内容。通常，代码或数据中的 **指针** 操作会导致偏移量交叉引用，例如：数组访问操作通常在数组的起始地址上加一个偏移量来实现。

![偏移量交叉引用](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813012039296.png)

**跳转到地址**

使用 **Jump>Jump to Address** 命令或者使用快捷键 **G** 快速导航到指定位置，使用快捷键 **ESC** 可立即跳转到当前位置的上一个位置。

![快捷键G](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813012800389.png)

### 栈帧

**编译器通过栈帧使得对函数参数和局部变量分配和释放的过程对程序员透明。**

```assembly
push ebp
mov  ebp，esp
sub  esp，76
```

如果希望 **EBP** 作为栈指针，那么在修改它之前，必须保存 **EBP** 的当前值，并且在返回调用方时恢复 **EBP** 的值，局部变量的空间在 **sub** 处分配。

**使用一个专用的栈指针，所有变量相对于栈指针寄存器的偏移量都可以计算出来，许多时候，正偏移量用于访问函数参数，而负偏移量用于访问局部变量。**

典型的 **尾声** 代码：恢复调用方的栈指针。

```assembly
mov esp,ebp
pop ebp
ret
```

栈帧是一个 **运行时概念** ，没有 **栈** 和 **运行中** 的程序，栈帧就不可能存在。

下面这片代码中， **IDA** 认为这个函数使用 **EBP** 寄存器作为栈指针，变量处表明 **IDA** 提供了一个 **摘要栈视图** ，列出了 **栈帧内直接被引用的每一个变量，以及变量的大小和他们与栈指针的偏移距离。**

![摘要栈视图](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813020138237.png)

局部变量以 **var_** 为前缀，函数参数以 **arg_** 为前缀，**IDA只会为那些在函数中直接引用的栈变量自动生成名称。**

**除了摘要栈视图外，IDA还提供了一个详细栈帧视图**，这种视图会显示一个栈帧所分配道德每个字节。显示的两个特殊值分别为 **s** 和 **r**，表示被保存的返回地址 **r** 和 被保存的寄存器值 **(s，在本例中，s仅代表EBP)**。

![栈帧视图](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813021210966.png)

### 搜索数据库

#### 文本搜索

**IDA文本搜索相当于对反汇编窗口进行子字符串搜索，通过search>Text(alt+t)启动命令搜索**。

![文本搜索](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813022103868.png)

#### 二进制搜索

**使用search>sequence of bytes(alt+b)即可启动二进制搜索**。

![二进制搜索](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813022524275.png)

### 名称和命名

在分析一个程序时，操作反汇编代码清单最常用的一个方法，是将默认名称更改为更有意义的名称。要更改一个名称，只需单击需要修改的名称，并使用 **N** 键打开更名对话框，或者右键选择 **Rename** 选项。

![Rename](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813163735795.png)

栈变量有关的名称是反汇编清单中最简单的名称，它们 **与特定的虚拟地址无关** ，因而从未出现在名称窗口中。

![栈变量重命名](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813164014444.png)

输入框中输入 **空白名称** ，将生成默认的名称。

### 注释

绝大多数 **IDA注释** 以分号为前缀，表示这一行分号以后的部分都属于注释。

#### 常规注释

常规注释位于现有汇编代码的 **尾部**，使用 **:** 热键，可以打开 **输入注释** 对话框，常规注释可以跨越多行。

![常规注释](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813171352618.png)

#### 可重复注释

可重复注释的行为与交叉引用的概念有关，热键为 **;** ，

#### 函数注释

通过函数注释，可以为函数的反汇编代码清单顶部显示的注释分组。

![函数注释](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/e31f7c37/image-20230813172357843.png)
