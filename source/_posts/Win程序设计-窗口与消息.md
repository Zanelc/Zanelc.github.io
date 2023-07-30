---
title: Win程序设计--窗口与消息
tags:
  - Window程序设计
  - API编程
  - 窗口与消息
categories:
  - Windows程序设计
abbrlink: 2044ef4b
date: 2023-07-30 17:35:31
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/2044ef4b/wallhaven-0q5zlr.jpg
---

《Windows程序设计(第5版)》--第3章

窗口与消息

**没有人会真正记住这种框架的所有细节，通常，windows程序员都是将已有的程序代码复制到新程序中。**

<!--more-->

### 窗口的创建

**用户对窗口的输入以“消息”的形式传递给窗口，而窗口也借助消息来与其他窗口进行通信。**

> 应用程序创建的每一个窗口都有一个与之相关联的窗口过程，windows正是通过调用该窗口过程来向窗口传递消息，窗口过程用于处理传递个窗口的消息。

#### 代码示例

```c
// HELLOWIN.C  -- Display "Hello,Windows 98!" in client area

#include<windows.h>
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PSTR szCmdLine, int iCmdShow)
{
	static TCHAR szAppName[] = TEXT("HelloWin*");
	HWND hwnd;
	MSG msg;
	WNDCLASS wndclass;
	wndclass.style = CS_HREDRAW | CS_VREDRAW;		// 保持 文本位置在窗口中心
	wndclass.lpfnWndProc = WndProc;					// 窗口过程，函数名相当于指向函数的指针
	wndclass.cbClsExtra = 0;
	wndclass.cbWndExtra = 0;
	wndclass.hInstance = hInstance;					// 应用程序的实例句柄
	wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
	wndclass.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
	wndclass.lpszMenuName = NULL;
	wndclass.lpszClassName = szAppName;				// 窗口类的名称
	if (!RegisterClass(&wndclass))
	{
		MessageBox(NULL, TEXT("This program requires Windows NT!"), szAppName, MB_ICONERROR);
		return 0;
	}
	hwnd = CreateWindow(
		szAppName,						// 窗口类名称
		TEXT("The Hello Program"),		// 窗口标题
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT,
		CW_USEDEFAULT,
		CW_USEDEFAULT,
		CW_USEDEFAULT,
		NULL,
		NULL,
		hInstance,
		NULL
	);
	ShowWindow(hwnd, iCmdShow);
	UpdateWindow(hwnd);
	while (GetMessage(&msg,NULL,0,0))	//注册窗口类
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);

	}
	return msg.wParam;

}

LRESULT CALLBACK WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)
{
	HDC hdc;
	PAINTSTRUCT ps;
	RECT rect;
	switch (message)
	{
	case WM_CREATE:
		PlaySound(TEXT("hellowin.wav"), NULL, SND_FILENAME | SND_ASYNC);
		return 0;
	case WM_PAINT:
		hdc = BeginPaint(hwnd, &ps);
		GetClientRect(hwnd, &rect);
		DrawText(hdc, TEXT("Hello,Windows 98!"), -1, &rect, DT_SINGLELINE | DT_CENTER | DT_VCENTER);
		EndPaint(hwnd, &ps);
		return 0;
	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProc(hwnd, message, wParam, lParam);
}
```

该程序创建了一个普通的应用程序窗口，运行效果如下（带有音频播放）：

![运行结果](/posts/2044ef4b/result.png)

#### 代码分析

##### WinMain函数

像main函数是C程序的入口一样，Windows程序的入口是**WinMain**，它总是以下面的形式出现：

```C
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PSTR szCmdLine, int iCmdShow)
```

第一个参数：**“实例句柄”**，在windows程序中，句柄无非就是一个数值，程序里用它来标识某些东西。在这个例子里，这个句柄就唯一标识了我们的程序。

第二个参数：上一个实例的句柄，在32位windows中，始终未空(定义为0)。

第三个参数：用来运行程序的命令行。

第四个参数：指明程序最初如何显示：或正常显示，或最大化到全屏，或最小化显示在任务栏上。

##### WndProc函数

该函数正是**窗口过程**，在本程序中，并未出现任何调用**WndProc**的代码，但在**WinMain**中，有一个对**WndProc**的引用，这也正是该函数在这段程序非常考前位置声明的原因。

##### Windows函数调用

绝大多数根据名字就能猜到具体功能，这里只解释部分函数的调用

| 函数名称        | 功能                                                     |
| --------------- | -------------------------------------------------------- |
| GetStockObject  | 获取一个图形对象，本例中是用来对窗口的背景进行重绘的画刷 |
| RegisterClass   | 为应用程序的窗口注册一个窗口类                           |
| GetMessage      | 从消息队列获取消息                                       |
| DispatchMessage | 将消息发送给窗口过程                                     |
| GetClientRect   | 获取窗口客户区的尺寸                                     |
| PostQuitMessage | 将**”退出“**消息插入消息队列                             |
| DefWindowProc   | 执行默认的消息处理                                       |

##### 四种数据结构

| 结构        | 含义       |
| ----------- | ---------- |
| MSG         | 消息结构   |
| WNDCLASS    | 窗口类结构 |
| PAINTSTRUCT | 绘制结构   |
| RECT        | 矩形结构   |

##### 理解句柄

各种类型的句柄，有以下三种大写标识符：

| 标识符    | 含义               |
| --------- | ------------------ |
| HINSTANCE | 实例句柄--程序本身 |
| HWND      | 窗口句柄           |
| HDC       | 设备环境句柄       |

**句柄本质上是引用某个对象的数值（通常为32位）。**一般情况下，应用程序几乎总是通过调用Windows函数来获取句柄，应用程序通过在其他Windows函数中使用句柄来引用相应对象。

##### 匈牙利标记法

**即变量名以表明该变量数据类型的小写字母开始。**

| 前缀 | 数据类型             |
| ---- | -------------------- |
| by   | BYTE                 |
| n    | short                |
| B或f | BOOL：f标识flag      |
| w    | word（无符号短整型） |
| l    | long（长整型）       |
| fn   | 函数                 |
| sz   | 以0结束的字符串      |
| h    | 句柄                 |
| p    | 指针                 |

#### 窗口类的注册

**窗口总是基于窗口类来创建的，窗口类确定了处理窗口消息的窗口过程。**

在创建窗口应用程序之前，必须调用函数**RegisterClass**来注册窗口类。

#### 窗口的创建

窗口类只是定义了窗口的一般特征，基于同一窗口类可以创建许多不同的窗口。

**CreateWindow**函数的返回值为一个指向所创建窗口的句柄，该句柄保存在变量hwnd中，该变量被定义为HWND类型。许多Windows函数都以hwnd为输入参数，以便Windows获知该函数是对哪个窗口进行引用。

#### 窗口的显示

> 当**CreateWindow**调用返回时，窗口已在Windows内部被创建，这句话的基本意思时，Windows已经分配了一块内存来保存**CreateWindow**调用中指定的窗口信息以及一些其他信息。

要将窗口显示在屏幕上，还需要调用另外两个函数：**ShowWindow**和**UpdateWindow**

#### 消息循环

**Windows为每一个Windows程序都维护了一个“消息队列”，**当输入事件发生后，Windows会自动将这些事件转换为“消息”，并将其放置在应用程序的消息队列中。

```C
while (GetMessage(&msg,NULL,0,0))
{
	TranslateMessage(&msg);
	DispatchMessage(&msg);
}
```

Windows调用了窗口过程，当**WndProc**处理完消息后，将控制器转回给Windows。

#### 窗口过程

**窗口过程决定了窗口客户区的显示内容以及窗口如何对用户的输入做出响应。**窗口过程的名称可以任意命名，一个windows程序可以包含多个窗口过程，但是一个窗口过程总是与一个通过调用**RegisterClass**注册的特定窗口类相关联。

```C
LRESULT CALLBACK WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)
```

窗口过程的4个参数与MSG结构的前4个字段时一一对应的，应用程序通常并不直接对窗口过程进行调用，窗口过程几乎总是由Windows自身调用。

#### 消息的处理

通常，使用switch-case结构来确定窗口过程所接收到的消息的类型以及相应的处理方法，当窗口过程对消息进行处理后，应返回0。

所有窗口过程不进行处理的消息都必须传给名称为**DefWindowProc**的Windows函数。

