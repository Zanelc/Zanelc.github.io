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

**注：** 此例中新增了个函数 [lstrcmpA](https://learn.microsoft.com/zh-cn/windows/win32/api/winbase/nf-winbase-lstrcmpa)，该函数对两个字符串进行比较，如果相等则返回0，在此例中，返回结果保存在 **EAX** 中，用 **OR** 判断 **EAX** 是否为0，若为0，则证明两个字符串相等。

![lstrcmpa函数](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802003105878.png)

### 示例二：crakmeeasy

#### 程序分析

使用 **OD** 载入该程序，程序断在函数入口点（**4011F0**）处：
![OD载入](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802200907261.png)

**查找全局字符串**，发现一组神秘数字：

![查找字符串](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802201009416.png)

仅凭数字是无法确定序列号的，**查看该模块的API函数列表** ，发现可能有关的API函数 **GetDlgItemTextA** 和 **memset** ，对 **GetDlgItemTextA** 函数下断点：

![API函数列表](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802201252164.png)

**F9** 运行程序，输入序列号 **test1234**：

![输入序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802202234413.png)

程序断在 **GetDlgItemTextA** 处，继续执行到返回，用户输入存储在 **0FE3CB10** 处：

![执行到返回](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802202458948.png)

继续 **F7** 单步执行程序返回到主模块，可以看到，下面两个API函数分别为 **memset** 和 **strlen**:

![单步执行](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802202617459.png)

分析程序逻辑，**EAX存储字符串 “10445678951” 的地址，当执行到lea指令时，该字符串的值都已经存储在堆栈处的位置**：

![程序分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802203256502.png)

接下来调用 **memset** 函数，该函数有三个参数 **(n,c,s)**:

> s： 待填充的内存单元的起始地址
>
> n：需要填充的字节数
>
> c：待填充的值

**F8** 步过该条语句，发现地址 **0240F674** 的前8个字节成功初始化为0：

![初始化成功](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802205621286.png)

继续运行程序，**lea获取常量字符串在堆栈中存储的地址 0240F668 并赋值给EAX**：

![F7单步执行](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802210135944.png)

**F8** 步过 **strlen** 函数，该函数获取字符串长度，并将结果存在 **EAX** 中，**0000000B 表示长度为11个字符**：

![获取字符串长度](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802210512925.png)

接下来将继续执行到 **movsx指令** 处，此时，输入字符串和常量字符串的的地址分别存放在 **EAX** 和 **ECX** 中：

![执行到movsx](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802211533531.png)

**movsx：带符号扩展指令，如果为负数，符号位补1；在此处将用户输入的字符串的第一个字符传送到edx中**，第一位为 **‘t’，ascii对应74**，根据扩展规则，EDX为 **00000074** ：

![movsx扩展](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802212020051.png)

继续执行，**EAX=EDX-14，将常量字符串的地址赋给EDX，ECX=0，MOVSX指令将常量字符串的第一个字符扩展后送到edx中，然后对两个字符进行比较**：

![程序分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802212844833.png)

继续执行函数，发现程序跳转至上面依次遍历字符：

![遍历字符](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802214016301.png)

重新运行一遍程序，将程序断在这里，分析一下程序是如何跳出循环的，**当所有字符都按照上述规则：输入字符串字符-14h=常量字符** 遍历完，就会跳出循环：

![跳出循环](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802215102029.png)

对程序跳出执行后的部分进行分析，程序对两个字符进行比较时，如果两个字符相同，**堆栈处两个地方的值将分别+1**，若不同，则只有一处+1，如果两个字符串规则运算后完全相同，最后这两处的值将相等，弹窗正确！

![实际比较结果](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802220535834.png)

#### 程序破解

理清楚整个程序的思路后，破解就相对简单了，可以采用之前通用思路，将条件跳转改为无条件跳转，这里就不再演示，这次采用另外一种方法，通过注册机来实现破解，根据先前的代码分析，可以得到：**输入字符-14h=字符串常量中的字符**，因此，正确的序列号为 **字符串常量中的字符依次+14h**，实现上述过程：

```c
#include<iostream>
int main(void)
{
	char st[] = "10445678951";
	char* ptr = st;
	while (*ptr != '\0')
	{
		*ptr = (*ptr) + 20;
		ptr++;
	}
	printf("Key: %s", st);
	return 0;
}

// 得到正确序列号为 EDHHIJKLMIE
```

**注：** 其实这里有一点没有说明，真正的序列号其实不是 **EDHHIJKLMIE**，真正的序列号是 **EDHHIJKLMI**，比前面少一位，因为字符串实际判断时候，只判断了 **10** 位，并没有判断第 **11**位，具体原因在这里：

![判断10次](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802222840955.png)

**edx一直为字符串长度-1，也就是10，ebp-10最开始为0，也就是**

| EDX  | EBP-10 | 判断第几位 |
| ---- | ------ | ---------- |
| 10   | 0      | 1          |
| 10   | 1      | 2          |
| 10   | 2      | 3          |
| ...  | ...    | ...        |
| 10   | 10     | 11         |

可以看到，当地**EBP-10为10时，该判断第11位，此时还未开始判断，但是上面的条件，当二者相等时，跳出循环，所以没有判断第11位，实际只判断了10位数。**

<!-- #### 扩展 -->

其实这个程序用 **IDA** 分析更简单，将程序拖入 **IDA** 后，**F5** 一键反汇编，查看程序伪代码：

![IDA查看](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/b2e77430/image-20230802223648398.png)

发现与我们 **OD** 动态分析的没有区别，逻辑完全相同，**Amazing!**
