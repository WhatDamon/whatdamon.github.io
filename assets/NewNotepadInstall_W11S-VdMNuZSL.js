var e=`---
title: 为正式版 Windows 11 安装新 Notepad（记事本）
date: 2021-12-12 00:01:53
tags: [Windows, Software]
comment: giscusn
cover: /img/ntptitle.png
---



> 内容已经过时！

本文是基于上一篇文章修改而成的📕~

# 前言

前些时候，新版的记事本面向 Dev 渠道的 Windows 11 发布

![](/img/ntphome.png)

![](/img/ntpsetting.png)

然后这是官方的文章：

[Redesigned Notepad for Windows 11 begins rolling out to Windows Insiders | Windows Insider Blog](https://blogs.windows.com/windows-insider/2021/12/07/redesigned-notepad-for-windows-11-begins-rolling-out-to-windows-insiders/)

但是，使用正式版的我不甘心，于是就有了这个教程

# 教程

1.1 打开https://store.rg-adguard.net/

1.2 把 **RP** 换成 **Fast**

1.3 输入\`https://www.microsoft.com/store/productId/9MSMLRH6LZF3\`并按下 勾

![](/img/ntpdown.png)

（如果要用 **CategoryID**，请输入 \`0cfabdcb-e35f-4ee5-8ca1-76660ea27185\`）

1.4找到 \`Microsoft.WindowsNotepad_11.2110.64.0_neutral_~_8wekyb3d8bbwe.msixbundle\`

（千万不要用 \`Microsoft.WindowsNotepad_10.2103.12.0_neutral_~_8wekyb3d8bbwe.msixbundle\`，除非你要恢复，偷懒用：11.2110.64.0 版本安装包：[下载](http://tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/e71b4770-93c5-400e-9b1e-31e39ab67dec?P1=1639231406&P2=404&P3=2&P4=B%2fkCTDZKHVyCwazM8cgWpUHs%2bIUjel%2buNJ1EY3nOTww7Hq0C6wqLM6z4CH7GGfG6mYkxjDvcO0wPak44oAJK2g%3d%3d)，要旧版的，10.2103.12.0 版本：[下载](http://tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/2036b52d-f4fa-452c-867d-77a1dbb68b3c?P1=1639231305&P2=404&P3=2&P4=gksmOzl2IQaNSzhVkbSi5jUeBtDn8SmtGFGdpBEUYlIMXTTLIHuxyztLULszthDcAJ7uaXpyGyqAVUHjPpUyJg%3d%3d)）

![](/img/ntplink.png)

1.5 下载这个文件，但不要直接打开

2.1 使用例如 7zip 的解压缩软件打开包

2.2 找到 \`App_11.2110.34.0_x64.msix\` 包文件，并解压

![](/img/ntpfile.png)

3.1 再解压文件夹中删除 **AppxBlockMap.xml、AppxSignature.p7x、[Content_Types].xml、AppxMetadata 文件夹**

3.2 打开**AppxManifest.xml**

3.3 替换13行为 \`<TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.22000.0" MaxVersionTested="10.0.22468.0"/>\`

4.1 打开**开发者设置**，并打开**开发人员模式**

![](/img/nmpset.png)

4.2 管理员方式打开**Powershell**

![](/img/nmppowershell.png)

4.3 在这里分别输入 \`Get-AppxPackage Microsoft.WindowsNotepad | Remove-AppxPackage -AllUsers\`

​						   		\`Add-AppxPackage -Register "(AppxManifest.xml的文件路径)"\`

完成安装

# 问题

Q:提示无法安装

**A:检查是否删除了相应文件，如果不行，请检查是否使用管理器权限，或者开发人员模式，也有可能是没有卸载掉旧版本**

Q:软件不正常

**A:可以重新安装一遍**

Q:删除文件夹后软件失效

**A:安装文件后不可以删除文件夹，否则会丢失文件，这很重要，建议解压在 C:\\Program Files\\WindowsApps，也可以随便解压在一个目录**

# 注意

虽然有中文，但我不知道怎么安装，如果你是英语渣，还是别用了，Dev 渠道在 Microsoft Store 直接安装



`;export{e as default};