var e=`---
title: 一切都变了，关于 VirtualBox 7.1.0 BETA1
comment: giscus
date: 2024-08-11 17:56:38
tags: [Software, VirtualMachine]
cover: /img/vbox710cover.png
---

# 序

> 正式版很早就已经发布，大伙儿看一乐就行

> [!CAUTION]
> 如果你是企业用户，不推荐使用 VirtualBox 7.1+，更别结合拓展包！神必甲骨文的更新的相关许可证，不管是否评估都可以向你索要商业授权费！看看远处的 QEMU/KVM 吧...

估计很多人都没意识到 VBox 悄悄更新了这个新测试版本，它在主页新闻中只字未提。

不管这么多，先看看这是什么玩意！

# 主

## 时代变啦！！！


第一条绝对要重磅一点，VBox 换图标了！

![新图标！图源 OMG! Ubuntu](https://149366088.v2.pressablecdn.com/wp-content/uploads/2024/07/virtualbox-new-logo-1.jpg)

个人感觉缺乏辨识度，稍微还有点小丑，但最少看起来简单了很多，即便在当初 7.0 发布的时候格格不入的设计风格就让我预见到 VBox 必然会改图标

当然这个更改也有牺牲，首当其冲的就是长期以来一直很有设计感的传统 BIOS 启动图标变得更加平庸：

![新BIOS](/img/vbox710b1bios.png)

当然受到影响的还有关于界面：

![关于界面](/img/vbox710about.png)

## 新框架

看上面的关于界面是否关注到了一个小细节？

没错，VirtualBox 终于用上了 Qt6，非常巧的是，Qt6.5 这个版本正是去年官方论坛一个请求Qt更新时提到的大版本号，不算过时，即便最新版本已经来到了 Qt6.7

对于使用深色模式且 DPI 不是 100 的整数倍的用户而言，这一次更新变化可谓巨大，尤其是对于Windows 用户而言，标题栏终于变成黑色了，UI 尺寸终于正常了

当然新框架下 UI 也被修改了，比如设置界面，多出了 Basic（基础）和 Expert（专家）两个模式，前者提供的设置项更加基础，并且设置的页面内容被放在了同一页，这点见仁见智了。不过新加的搜索功能的确对新用户非常友好

![新设置](/img/vbox711newsettings.png)

## Apple Silicon用户狂喜系列

VBox 7.1 版本正式支持 Apple Silicon，现在用户可以在搭载M系列直接处理器的 Mac 上虚拟化Linux和BSD虚拟机，Windows on Arm 没人测试，也不知道

不过对于直接虚拟化这件事情，x86-on-ARM 并不支持 OOTB，即便可以手动开启，但启用性能会变差，尤其是带有图形界面的虚拟机操作系统而言。

只不过什么时候推出适用于 Windows on Arm 和 Linux Arm 的 VBox？最少 macOS 这一步已经走出来了

## Linux 用户狂喜系列

这一次，VBox 终于支持 Wayland 主机与虚拟机之间的剪贴板共享了，即便 Wayland 未来替换掉 X11 还有很长的路，但这也是好兆头之一

其他的，更完善的新内核支持这些废话也没必要多说了

## 其他无关紧要的小更新

1. 改进了屏幕录制性能
2. 远程桌面扩展证书改进
3. NAT 使用了支持 IPv6 的新引擎
4. EFI 添加了 Microsoft DB/KEX 到新的虚拟机

# 尾

这个版本变化幅度相当大，即便里面有很多东西让用户等了好几年

注意，该版本属于 Beta 测试版，可能存在严重的 BUG，非专业用户不要随便升级，安安心心用稳定版吧，还有一点就是中文还不完全，英语不好的也不太推荐升级

顺便盲猜一波，估计未来很多图标都会重绘

下载链接：https://download.virtualbox.org/virtualbox/7.1.0_BETA1
`;export{e as default};