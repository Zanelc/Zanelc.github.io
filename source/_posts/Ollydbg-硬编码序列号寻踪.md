---
title: Ollydbg--硬编码序列号寻踪
categories:
  - 使用Ollydbg从零开始Cracking
tags:
  - Ollydbg基础使用
  - 硬编码寻踪
  - 菜鸡逆向
abbrlink: f1a53511
date: 2023-07-31 23:24:39
---
介绍Ollydbg的基础用法，通过实例来学习ollydbg的基础操作，了解基本的逆向思路。
<!--more-->

> 序列号是最难的工作之一，特别是当我们遇到了强力的加密算法的时候，就更难了，先从简单的情况分析开始，慢慢的延伸到复杂的情况，逐步锻炼寻找序列号的能力。

#### 示例一：Leccion_13_HARDCODED_1

##### 程序分析

最简单的情况下，正确的序列号是作为**全局字符串**出现在程序中的，我们先用OD打开该程序，程序停在了函数入口点(401000)处：

![OD载入](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230731234434167.png)

搜索全局字符串，如果安装有插件的话，直接使用“**中文搜索引擎--智能搜索**”即可搜索到全局字符串，也可以使用另外一种方式搜索，“**查找--所有参考文本子串**”，其实在使用这种方式搜索时候，并没有找到全部的字符串，猜测可能是字符编码的问题，**建议还是使用插件去搜索，比较全**。

![中文搜索引擎搜索](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230731234735665.png)

![查找字符串](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230731235143887.png)

搜索的全部字符串结果如下：

![image-20230801002630829](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801002630829.png)

其实看到**“FIACA”**这个字符串，我们猜测它可能就是我们要找的序列号，但有些程序也会故意放置一些假的序列号在字符串列表中，引诱我们上当，接下来我们去检查字符串的正确性。

查看当前模块的API函数列表(快捷键**ctrl+N**)，发现有几个比较熟悉的API函数**GetDlgItemTextA** 和 **MessageBoxA**：

![image-20230801002846244](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801002846244.png)

![image-20230801003012079](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003012079.png)

给这两个API函数设置断点，也可以在命令栏输入 **bp GetDlgItemTextA**:

![image-20230801003210578](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003210578.png)

![image-20230801003331018](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003331018.png)

断点设置完成后，当程序运行到端点处就会断下来，按 **F9** 运行程序：

![image-20230801003438364](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003438364.png)

![image-20230801003534063](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003534063.png)

输入序列号后，点击 **Verificar** ，程序断在 **GetDlgItemTextA** 入口处，在堆栈区可以看到，该函数指定的缓冲区地址Buffer为 **403010**，我们在数据窗口中跟随该位置（右键--数据窗口中跟随）：

![image-20230801003741801](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801003741801.png)

![image-20230801004135535](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801004135535.png)

暂时不关心具体函数是怎么执行的，我们只关心结果，**执行到返回(F9)**，此时用户输入的数据已经被写入该缓冲区：

![image-20230801004326799](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801004326799.png)

继续单步执行 **F7** 到用户代码，可以看到有比较和跳转指令，程序获取到用户输入后，将正确的序列号 **FIACA**存放着EDX处，将用户的输入存放在EBX里，然后两个值进行比较，分别对应下面两个分支：

![image-20230801004741217](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801004741217.png)

执行CMP指令时，两个地方存储的数据可以在下方状态窗口看到，显然二者数据不等：

![image-20230801005532580](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801005532580.png)

比较过后，**ZF**标志位置0，无法跳转至正确弹窗：

![image-20230801011314334](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801011314334.png)

**F9**运行程序， 结果如下：

![image-20230801010114032](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801010114032.png)

##### 程序破解

好了，现在我们已经知道了整个的序列号，我们使用 **FIACA** 测试一下是否正确，结果如下(其实这个就是正确弹窗，只是没有修改窗口标题)：

![image-20230801010324846](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801010324846.png)

接下来，尝试对程序进行破解，使错误的序列号也能正确弹窗，继续运行程序到跳转位置，将跳转语句改为无条件跳转**JMP**，使其跳转至正确弹窗，结果如下：

![image-20230801011511665](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801011511665.png)

![image-20230801011546147](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801011546147.png)

每次修改太麻烦，可以选择对修改进行保存，右键“复制到可执行文件--所有修改”，选择全部复制，然后保存文件即可。

![image-20230801011706716](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801011706716.png)

![image-20230801011827679](E:\Zanelc_blog\source\_posts\Ollydbg-硬编码序列号寻踪\image-20230801011827679.png)

**注：**其实上面有个细节，真正的序列号并不是 **FIACA**，而是 **FIAC**，因为比较时，**ebx**和 **dword ptr** 都是32位的，实际上只比较了 **4个字节**。
