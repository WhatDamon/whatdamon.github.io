var e=`---
title: 'macOS 虚拟机跨软件迁移指南'
date: 2026-07-05 13:54:23
tags: [macOS, VirtualMachine]
comment: giscus
license: cc-by-4.0
cover: /img/osxVmMigrate.png
---

# 序

## 前情提要

如果**不符合以下这几点要求**，那么本文可能不适合你！

- 你必须要有足够的耐心接受复杂的步骤，并且能够按照实际情况随机应变
- 你必须对计算机有基本认识
- 你的主机系统是 macOS
- 你有更换虚拟化软件的实际需求
- 你所使用的虚拟机软件为 UTM、VirtualBuddy、GhostVM、virtualOS 等其他底层使用苹果的 \`Virtualization.framework\` 的虚拟机
- 客户机也是 macOS，并且确信虚拟机的确由 \`Virtualization.framework\` 驱动
- 你的设备剩余存储空间很大

> 一般来说 macOS 下虚拟 macOS，特别是 Apple Silicon，大部分都在用 \`Virtualization.framework\`，极少部分可能会使用更底层的 \`Hypervisor.framework\`

如果全部符合，恭喜你这篇文章特别适合你！

## 基本

再开始操作前，有这些东西你必须知道：

- \`AuxiliaryStorage\`：引导链的 NVRAM 变量等数据，纯二进制文件
- \`HardwareModel\`：硬件模型标识符，二进制 Plist
- \`MachineIdentifier\`：虚拟硬件 UUID/MLB 或类似机器特定标识符，二进制 Plist

没有它们，即便有硬盘文件，你的虚拟机也无法完成迁移工作，虚拟机无法完成引导启动！所以这三者必须准备好，单一一个硬盘完全不够！

# 操作指南

## 文件结构

一般情况下，大部分虚拟机的目录结构都是 Flat 的，即所有核心文件（排除配置等文件）存放在同一目录就像这样：

~~~
/
├── AuxiliaryStorage
├── Disk.img
├── HardwareModel
└── MachineIdentifier
~~~

像 GhostVM 有点区别也只不过是这样

~~~
/
├── AuxiliaryStorage.bin
├── disk.img
├── HardwareModel.bin
└── MachineIdentifier.bin
~~~

但 UTM 比较特殊，算上配置文件 \`config.plist\` 目录结构长这样

~~~
/
├── Data/
│   ├── AuxiliaryStorage
│   └── [UUID].img
└── config.plist
~~~

你可能会想 \`HardwareModel\` 和 \`MachineIdentifier\` 这两个核心内容去那里了？其实是通过 Base64 藏在了 \`config.plist\`，因为这两个文件的大小都是以字节为单位的

## 进行迁移

> [!IMPORTANT]
> 在确保迁移成功前，请不要删除源文件，避免损失
> \`AuxiliaryStorage\`、\`HardwareModel\`、\`MachineIdentifer\` 和硬盘文件是相互绑定的，为了成功迁移请不要随意替换

### UTM -> VirtualBuddy

如果你正计划从 UTM 迁移到 VirtualBuddy，那么恭喜你 VirtualBuddy 支持打开 \`.utm\` 格式的包来完成快速迁移。但请注意，UTM 下 CPU 核心数通常为 0，撰文时 VirtualBuddy 并不能按照预期处理，只会按部就班，所以导入后，请务必手动检查 CPU 核心数，不然无法启动！

### 多数情况

一般情况下只要做到三个必备文件和硬盘文件按照迁移到的虚拟机的文件结构一一对应，最多重命名以下，重新做好配置就完工了，在 99% 的情况下，这是奏效的

有些虚拟机不支持创建空配置，所以你可能需要准备一个 macOS 的 IPSW 恢复镜像完成一次安装后再去替换，请注意这会消耗非常多的空间（macOS 的 IPSW 大小在 macOS 12 已经有 10GB+ 了，macOS 27 更是突破的 20GB 大关）。建议选择低版本，例如 macOS 12，恢复镜像小，并且一般可以直接部署不用装 Device Support，随用随删

### 其他 -> UTM

正如上面所言，UTM 部分内容存储方式与其他虚拟机有区别，所有步子也要稍微绕一点

你需要明确 \`HardwareModel\` 和 \`MachineIdentifier\` 的路径，然后分别在终端中输入：

~~~bash
base64 -i /path/to/HardwareModel
base64 -i /path/to/MachineIdentifer
~~~

> [!NOTE]
> 请将 \`/path/to/HardwareModel\` 和 \`/path/to/MachineIdentifer\` 替换成对应文件的所在路径！并不要无脑复制粘贴

随后你会得到两个 Base64 字符串，一长一短，留存备用

打开一个 UTM 虚拟机的配置文件 \`config.plist\`，定位到 \`MacPlatform\` 这个 Key：

~~~xml
<key>MacPlatform</key>
<dict>
	<key>AuxiliaryStoragePath</key>
	<string>AuxiliaryStorage</string>
	<key>HardwareModel</key>
	<data>
	    XXXXXXXXXXXXX
	</data>
	<key>MachineIdentifier</key>
	<data>
	    XXXXXXXXXXXXX
	</data>
</dict>
~~~

按照 \`HardwareModel\` 和 \`MachineIdentifer\` 这两个 Key 分别填入你留存的 Base64 内容，请注意，务必一一对应，长的是 \`HardwareModel\`，短的是 \`MachineIdentifer\`

随后将 \`AuxiliaryStorage\` 无任何后缀地放在 \`Data\` 目录下

然后再定位到 \`Drive\` 这个 Key：

~~~xml
<key>Drive</key>
<array>
	<dict>
		<key>Identifier</key>
		<string>[UUID]</string>
		<key>ImageName</key>
		<string>Disk.img</string>
		<key>Nvme</key>
		<false/>
		<key>ReadOnly</key>
		<false/>
	</dict>
</array>
~~~

生成一个 UUID 替换上面的“[UUID]”或使用你的 \`config.plist\` 中已有的 UUID，将硬盘 \`Disk.img\` 存到 \`Data\` 目录下

随后你再使用 UTM 完成一些基础操作配置，测试启动虚拟机，如果显示了白苹果则迁移成功，黑屏则失败

### UTM -> 其他

反向操作相对更简单，按照上一部分的提示从 \`config.plist\` 提取出 \`HardwareModel\`、\`MachineIdentifer\` 的 Base64 内容，分别执行：

~~~bash
echo '[HardwareModel 的 Base64]' | base64 -D > HardwareModel
echo '[MachineIdentifer 的 Base64]' | base64 -D > MachineIdentifer
~~~

你会得到这两个文件，随后从 \`Data\` 目录中提取出 \`AuxiliaryStorage\` 和硬盘文件，然后按照[多数情况部分](#多数情况)的方式、思路完成迁移即可！

### Parallel Desktop 呢？

PD 可能也在使用 \`Virtualization.framework\`，若是理论上这一套思路也行，但我已经卸载了 PD 虚拟机，按照我粗糙的回忆并不能拼接出完整的内容，我也不想重头再来，若可，欢迎在评论中提供指南！

# 末

其实文章看起来复杂，来来回回就这 4 个核心文件，拿稳了这 4 个文件，相互迁移就易如反掌

但也额外说明一下，为了体验，我建议迁移后尽可能安装一下虚拟机软件的 Guest 工具来实现主机与虚拟机互通，方便文件传输等，如果有前虚拟机软件的 Guest 工具，也建议卸载。如果你创建这个虚拟机的目的就是高度隔离，别去安装 Guest 工具！

## Linux？

我查阅了苹果的开发文档[^1]，API 好像存在差异，模拟的硬件一个是虚拟的苹果设备一个是 VirtIO，相关文件也有所不同：

- \`Disk.img\`：硬盘
- \`MachineIdentifier\`：应该同 macOS
- \`NVRAM\`：如其名，EFI 变量存储

并且上文提到的虚拟化软件中除了 UTM 均不支持 Linux 客户机，PD 在 Linux 客户机可能使用到了更底层的 \`Hypervisor.framework\`，缺乏通用型，不过多赘述

## 其他

使用 \`Virtualization.framework\` 驱动的 macOS 客户机，其硬盘文件一般情况下是可以被 macOS 正常挂载的。并且因为 APFS 的一些特性，这个硬盘文件看似很大实际占用的只有你使用的空间。还有直接复制无修改的前提下，APFS 只会存一份文件，但考虑到完成迁移后你会启动测试是否能够正常引导，期间一般不建议删旧文件，引导成功了文件出现差异，硬盘占用就会翻倍，因此剩余空间一定要大，外部存储也行

[^1]: [Running GUI Linux in a virtual machine on a Mac | Apple Developer Documentation](https://developer.apple.com/documentation/virtualization/running-gui-linux-in-a-virtual-machine-on-a-mac)`;export{e as default};