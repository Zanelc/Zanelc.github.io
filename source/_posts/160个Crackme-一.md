---
title: 160个Crackme--一
tags:
  - crackme
  - 逆向学习
categories:
  - 160个Crackme系列
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/title.jpg
abbrlink: a1e7b9f1
date: 2023-10-12 23:31:26
---

160个Crackme系列（1-5）

<!--more-->

### 1.Acid burn

使用 **DIE** 工具查看程序信息，程序使用 **Delphi** 编写的，无加壳信息。

![DIE](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012233744343.png)

运行程序，发现总共有两处需要破解的地方，分别为 **Serial、Serial/Name**。

#### Serial

使用 **x32dbg** 加载程序，运行 **Serial** ，随便输入一个序列号 **crackme** ,弹窗错误。

![Serial](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012234825557.png)

![弹窗错误](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012234853017.png)

重新加载程序，**shift+D** 查看字符串窗口,发现多处 **Try Again** ，在该字符串处下断点。

![Try Again](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012235020424.png)

程序成功中断，可以看到错误提示的上面有一个 **正确提示和关键跳转** ，再往上看有一个 **比较函数**，推断出 **程序将输入的Serial与 "Hello Dude!" 进行比较，如果相同就弹窗正确。**

![程序中断](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012235229078.png)

输入 **Hello Dude!** 验证是否成功，弹窗正确！

![输入正确序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012235610569.png)

#### Serial/Name

需要输入 **Name** 和 **Serial** ，猜测 **Name** 根据某种算法来生成 **Serial**，先测试一下弹窗。

![输入用户名和序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012235857783.png)

在字符串窗口搜索关键提示，并下断点。

![字符串窗口](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231012235947456.png)

**F9** 运行程序，输入 **Serial和name** 成功中断，回溯函数发现 **比较与关键跳转**，将用户输入的 **Serial** 与 **CW-8118-CRACKED** 比较。

![中断](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014003409138.png)

输入其他值，查看序列号是否变化，输入 **testacc** ，此时序列号变化为 **CW-9512-CRACKED** ，根据注释信息，**推测** 序列号由 三部分拼接而成，**CW、XXXX、CRACKED**，**XXXX** 由用户输入的 **Name** 计算得到。

![更换Name](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014003548226.png)

![序列号变化](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014003655765.png)

接下来使用 **IDA** 对程序进行静态分析，查看程序的大致流程，程序存在两处跳转，**一处是与4比较跳转，另一处是序列号比较跳转**。

![IDA分析](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014003949255.png)

查看 **sub_406930** 函数,发现该函数用来获取字符串长度。

![sub_406930](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014004105104.png)

推测程序通过该函数获取 **Name** 长度，长度大于4，跳转，使用 **x32dbg** 动态调试来验证我们的猜想，在函数上方设置断点，单步执行分析。

![设置断点](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014005128188.png)

![获取用户名](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014005221706.png)

![长度比较](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014010505785.png)

由于输入的 **Name** 长度大于4，跳转继续执行，获取输入 **Name** 的第一个字节，此时我们输入的为 **testacc**，获取的为 **t**，**将t的值*0x29**，得到 **EAX值为1294**

![image-20231014011059311](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014011059311.png)

将 **1294** 存储在 **431750** 处，add指令将值变为 **2528（扩大一倍）**。

![扩大一倍](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014011421409.png)

继续执行函数，发现 **call sub_406718** 执行后，产生序列号的中间部分数字 **9512**，此时 **细心的话就会发现9512恰好是2528的十进制形式。**

![产生序列号](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014011623896.png)

![十六进制转换十进制](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014011731603.png)

由此猜测上述函数 **sub_406718** 将十六进制数字转换为十进制数字！根据上述规则编写注册机代码

```C++
#include<iostream>
using namespace std;
int main()
{
	string str;
	printf("请输入Name：");
	cin >> str;
	if (str.length() < 4)
		perror("字符串长度必须大于等于4");
	else
	{
		char s = str[0];
		int num = s * 0x29 * 2;
		printf("序列号为：CW-%d-CRACKED .", num);
		return 0;
	}
}
```

测试数据，弹窗正确！

![success](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/a1e7b9f1/image-20231014012957867.png)
