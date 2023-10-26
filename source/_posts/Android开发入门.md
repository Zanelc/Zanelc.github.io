---
title: Android开发入门
categories:
  - - 纸上得来终觉浅
    - Android开发
tags:
  - Android开发入门
  - 逆向学习
abbrlink: c9fbe089
date: 2023-10-26 01:22:04
index_img: https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/title.png
---

Android开发学习笔记

<!--more-->

**App工程目录结构**

App工程分为两个层次，第一个层次是项目，另一个层次是模块，每个项目至少有一个模块。

一般所言的 **编译运行App** ，指的是运行某个模块，而非运行某个项目，因为 **模块才对应实际的App**。

### App项目目录说明

主要有两个分类：**app（代表app模块）、Gradle Scripts（工程的编译配置文件）**

![示例](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026023322789.png)

![image-20231026020827545](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026020827545.png)

| 目录            | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| manifests子目录 | 下面只有一个XML文件，即AndroidManifest.xml，它是App运行配置文件 |
| java子目录      | 下面有三个com.example.myapp包，其中第一个包存放当前模块的java源代码，后面两个包存放测试用的java代码 |
| res子目录       | 存放当前模块的资源文件                                       |

res目录下面主要文件：

![res目录文件介绍](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026022129492.png)

#### Gradle

> Gradle 是一个项目自动化构建工具，帮我们做了依赖、打包、部署、发布、各种渠道的差异管理等工作

Gradle Scripts下面主要是工程的编译配置文件，主要有：

| 文件名             | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| build.gradle       | 分为项目级与模块级两种，用于描述App文件的编译规则            |
| proguard_rules.pro | 该文件用于描述java代码的混淆规则                             |
| gradle.properties  | 该文件用于配置编译工程的命令行参数，一般无须改动             |
| settings.gradle    | 配置了需要哪些模块，初始内容为include ':app'，表示只编译app模块 |
| local.properties   | 项目的本地配置文件，它在工程编译时自动生成，用于描述开发者电脑的环境配置，包括SDK的本地路径等 |

#### AndroidManifest.xml

每个应用的根目录都必须包含一个 **AndroidManifest.xml** 文件，并且文件名必须一模一样，这个文件中包含了APP的 **配置信息** 、系统需要根据里面的内容运行APP的代码，显示界面。

**包名** 一般放在 **头部<manifest>中**，项目中并没有放在这里，而是放在了 **build.gradle** 文件中，但是最终生成的apk文件中，包名还是存在于 **manifest** 中。**android:label** 用于指示手机屏幕上App显示的名称。

![清单文件](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026030746581.png)

![applicationId](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026030941113.png)

![apk解包后查看包名](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026031109892.png)

#### Activity

> Activity 是一个应用程序组件，提供一个屏幕，用户可以用来交互为了完成某项任务。

Activity是活动页面的注册声明，只有在AndroidManifest.xml文件中正确配置了activity节点，才能在运行时访问对应的活动页面，初始配置的 **MainActivity** 正是App的 **默认主页** ，之所以说该页面时App主页，是因为他的activity节点内部还配置了其他过滤信息：

```xml
<activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
</activity>
```

action节点设置入口页面，启动App时会最先打开该页面；category设置是否在手机屏幕上显示App图标，默认主页必须同时配置这两种过滤规则。

### 界面显示与逻辑处理

利用 **XML** 标记描绘应用界面，使用 **java** 代码书写程序逻辑。

界面设计与代码逻辑分开的好处：

1. 使用 **XML** 文件描述APP界面，可以很方便的在Android Studio上预览界面效果。
2. 一个界面布局可以被多处代码复用，反过来，一个 **Java** 代码也可能适配多个界面布局。

示例：

![activity_main.xml文件](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026233121097.png)

![MainActivity.java](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026233229216.png)

新建一个 **layout** 文件，将 **text** 内容写入到 **string.xml** 中，

![strings.xml](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026233746417.png)

![activity_main2.xml](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026233904920.png)

新建一个 **MainActivity2** 类，重写 **onCreate** 方法：

![MainActivity2.java](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026234140383.png)

在清单文件中 **注册** MainActivity2:

![注册](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026234340751.png)

在 **activity_main.xml** 文件中添加一个按钮，实现 **activity跳转到activity2**。

![添加按钮](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231026234718753.png)

添加跳转事件，实现点击按钮跳转。

![添加跳转事件](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231027000434672.png)

也可以直接创建Activity，同时会创建好xml文件。

![创建activity](https://cdn.jsdelivr.net/gh/Zanelc/Zanelc.github.io@main/posts/c9fbe089/image-20231027001246548.png)
