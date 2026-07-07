var e=`---
title: 为正式版 Windows 11 安装新 Media Player
date: 2021-11-21 00:39:07
tags: [Windows, Software]
comment: giscus
cover: /img/wmpnew.png
---



> 内容已经过时！

# 前言

前些时候，新版的 Media Player 面向 Dev 渠道的 Windows 11 发布

![](/img/nmphome.png)

然后这是官方的文章：

[New Media Player for Windows 11 begins rolling out to Windows Insiders | Windows Insider Blog](https://blogs.windows.com/windows-insider/2021/11/16/new-media-player-for-windows-11-begins-rolling-out-to-windows-insiders/)

但是，使用正式版的我不甘心，于是就有了这个教程

# 教程

1.1 打开https://store.rg-adguard.net/

1.2 把 **RP** 换成 **Fast**，把 **URL(links)** 换成 **PackageFamilyName**

1.3 输入 \`Microsoft.ZuneMusic_8wekyb3d8bbwe\` 并按下 勾

![](/img/nmpdown.png)

（如果要用 **CategoryID**，请输入 \`16db93bf-8748-449a-96ba-e9ed3a5f872d\`）

1.4找到 \`Microsoft.ZuneMusic_11.2110.34.0_neutral_~_8wekyb3d8bbwe.msixbundle\`

（偷懒用：11.2110.34.0版本安装包：[下载](http://tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/729cb045-df0e-46cc-8503-207c15320403?P1=1639289015&P2=404&P3=2&P4=eLQCUAh9TrKHrIm665BhurLdcbaWSTJAZJZgBUJIf2fc7htKcChR1M2OKvr0klnL2NmkUO%2f2pOyd%2bEiuVRXskg%3d%3d)）

![](/img/nmplink.png)

1.5 下载这个文件，但不要直接打开

2.1 使用例如7zip的解压缩软件打开包

2.2 找到 \`App_11.2110.34.0_x64.msix\` 包文件，并解压

![](/img/nmpfile.png)

3.1 再解压文件夹中删除 **AppxBlockMap.xml、AppxSignature.p7x、[Content_Types].xml、AppxMetadata 文件夹**

3.2 打开 **AppxManifest.xml**

3.3 替换11行为 \`<TargetDeviceFamily Name="Windows.Universal" MinVersion="10.0.22000.0" MaxVersionTested="10.0.22471.0" />\`

4.1 打开**开发者设置**，并打开**开发人员模式**

![](/img/nmpset.png)

4.2 管理员方式打开 **Powershell**

![](/img/nmppowershell.png)

4.3 在这里分别输入 \`Get-AppxPackage zune | Remove-AppxPackage -AllUsers\`

​						   		\`Add-AppxPackage -Register "(AppxManifest.xml的文件路径)"\`

完成安装

# 问题

Q:提示无法安装

**A:检查是否删除了相应文件，如果不行，请检查是否使用管理器权限，或者开发人员模式**

Q:软件不正常

**A:可以重新安装一遍**

Q:删除文件夹后软件失效

**A:安装文件后不可以删除文件夹，否则会丢失文件，这很重要，建议解压在 C:\\Program Files\\WindowsApps，也可以随便解压在一个目录**

# 注意

本软件会覆盖 Groove Music，但不会覆盖经典版本的 WMP，并且目前还没法安装中文，由于还在早期阶段，存在不少 BUG，并且目前视频播放还没有做好，体验可能不如 VLC 这些播放器



`;export{e as default};