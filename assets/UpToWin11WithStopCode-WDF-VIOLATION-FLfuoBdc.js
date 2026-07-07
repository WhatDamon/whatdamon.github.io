var e=`---
title: 升级到 Windows 11 后黑屏死机：WDF VIOLATION
date: 2021-10-05 21:39:53
tags: [Windows, Experiences]
comment: giscus
cover: /img/bsodwdfviolation.png
---

# Begin

2021 年 10 月 5 日，Windows 11 21H1 正式发布，很多人都进行了更新，我也一样[doge]

但是从不符合最低配置的设备更新，驱动上总会有那么点问题，我遇到了一个，错误代码为 **WDF VIOLATION**

![](/img/bsod-wdf.jpg)

死机后我进入了安全模式查了 Dump，发现问题所在，网上对于这个问题的解决方法大多时惠普的，不够完整，这次我带来了两个，当然为了方便，惠普也会提到

# BODY

## 老款 Mac 电脑

我就是用老款 Mac 的，这件事情整了我半天，现在告诉你哪里有问题

先看看报告

![](/img/BSV-wdf.png)

会发现主要问题出在一个叫 \`MacHALDriver.sys\` 的驱动文件，还有 \`ntoskrnl.exe\` 和 \`Wdf01000.sys\` 都不是最重要的

先说一下，\`MacHALDriver.sys\` 是 \`Bootcamp\`（启动助理）安装时释放的驱动程序，这是硬件抽象层驱动，但是删除它似乎并不影响设备使用

好，开始教你如何解决

1. 关机
2. 启动，出现 Windows 标志(也有可能是自定义的图标)时，**马上关闭电源**
3. 再次启动，出现 Windows 标志(也有可能是自定义的图标)时，**马上关闭电源**
4. 继续启动，启动 Windows RE(如果你**启用了 BitLocker**，需要输入**加密密钥**)
5. **不要点击重新启动**，点击另外一个选项进入“选择一个选项”，然后依次点击“疑难解答”>“高级选项”>“命令提示符”
6. 输入 \`C:\`，回车
7. 输入 \`cd c:\\windows\\system32\\drivers\`，回车
8. 输入 \`ren MacHALDriver.sys MacHALDriver.sys.bak\`，回车
9. 输入 \`exit\`，回车

电脑重启后，问题应该修复了

## 惠普

我没有惠普电脑，但按照网上教程，大概是这样

1. 关机
2. 启动，出现 Windows 标志(部分设备是 OEM 厂商标识)时，**马上关闭电源**
3. 再次启动，出现 Windows 标志(部分设备是 OEM 厂商标识)时，**马上关闭电源**
4. 继续启动，启动 Windows RE(如果你**启用了 BitLocker**，需要输入**加密密钥**)
5. **不要点击重新启动**，点击另外一个选项进入“选择一个选项”，然后依次点击“疑难解答”>“高级选项”>“命令提示符”
6. 输入 \`C:\`，回车
7. 输入 \`cd c:\\windows\\system32\\drivers\`，回车
8. 输入 \`ren HpqKbFiltr.sys HpqKbFiltr.sys.bak\`，回车
9. 输入 \`exit\`，回车

# End

你这么一看，两者解决方法是不是很像

其实就是把不支持的驱动给硬核禁用掉（改驱动名），当然不要再主系统尝试，权限不够的！

以上操作也可以再 Windows PE 中进行，其实就是改改名嘛，安全模式应该不行，有文件保护机制

------

**相关链接：**

[蓝屏错误疑难解答 (microsoft.com)](https://support.microsoft.com/zh-cn/sbs/windows/解决蓝屏错误-5c62726c-6489-52da-a372-3f73142c14ad?ui=zh-CN&rs=zh-CN&ad=CN)

[WDF VIOLATION 你的电脑遇到问题，需要重新启动-百度经验 (baidu.com)](https://jingyan.baidu.com/article/fd8044fa0bf3085030137a79.html)

`;export{e as default};