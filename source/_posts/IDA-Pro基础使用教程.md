---
title: IDA Pro基础使用教程
tags:
  - IDA pro使用教程
categories:
  - 逆向工具
  - IDA使用
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
