var e=`---
title: 在 macOS 应用上使用液态玻璃图标保姆级教程
comment: giscus
date: 2025-10-19 00:21:00
tags: [Develop, macOS]
mermaid: true
cover: /img/useLiquidGlassIcon.png
---

# 序言

2025 年苹果发布了 macOS Tahoe，引入了新的液态玻璃设计，同时也对图标进行了升级，可以进行更多的自定义，但是对于非 Xcode 项目而言，要成功应用这一套新的图标有不少阻碍，本文介绍一种方案，可以帮助大部分非 Xcode 项目在 macOS 上也可以用上液态玻璃图标。

# 原理

这里使用一个流程图进行表示 macOS 26+ 系统的图标获取过程（内容可能会有点不严谨）

\`\`\`mermaid
graph TD
    A["请求图标"] -- "读取 Info.plist" --> n1@{ label: "Info.plist 是否存在CFBundleIconName" }
    n1 -- 是 --> C{"是否存在 Assets.car"}
    n1 -- 否 --> n3@{ label: "Info.plist 是否存在 CFBundleIconFile" }
    n3 -- 是 --> n4["是否存在<br />指定的 icns"]
    n3 -- 否 --> n2[/"加载占位图标"/]
    n4 -- 否 --> n2
    n4 -- 是 --> E[/"加载 icns"/]
    C -- 是 --> n5["是否可以按照<br />Info.plist 数据获取图标"]
    n5 -- 是 --> D[/"加载 Assets.car 数据，<br />合成液态玻璃图标"/]
    C -- 否 --> n3
    n5 -- 否 --> n3
\`\`\`

可以看到，要实现液态玻璃图标，关键在于 \`Assets.car\` 文件，\`.icns\` 图标与 \`Assets.car\` 中的图标互不冲突

# 开始

## 准备

- **耐心**（毕竟各种奇奇怪怪的情况总会意外阻止你前进，被迫重新开始）
- **白苹果 Mac 或驱动完全的黑苹果**（Windows、Linux 下的虚拟机会可能卡顿，并且还有概率会引发 Kernel Panic 导致重头再来，如果你有图标工程文件但无 macOS，建议直接看[“附加”](#附加)部分在 GitHub Action 下用\`macos-latest\`镜像跑编译指令）
- **macOS 15 及更新版本**（以 Xcode 26 最低系统要求为准）
- **Xcode 26 及更新版本** + **macOS 26 SDK 及更新 SDK**
- **Icon Composer**（WWDC 2025 版本，用于制作液态玻璃图标，如果愿意也可以手搓不用它，这里不进行讲解）

## 须知

1. 如果你的项目已经包含了 \`Assets.car\`，您可以取其中一部分参考，这里默认认为你没有 \`Assets.car\`
2. 使用液态玻璃图标的硬性要求是 App Bundle，这也代表着 Java JAR 或者 Unix 可执行文件不进行打包无法使用液态玻璃图标
3. 如果软件在使用过程中会使用已有资源替代 Dock 上的图标，那么在 Dock 中你所创建的图标会被替代

## 过程

### 1. 创建一个液态玻璃图标

使用您下载的 Icon Composer 创建一个液态玻璃图标，这里不详细描述，若有需要，请查阅以下网站：

- [Creating your app icon using Icon Composer | Apple Developer Documentation](https://developer.apple.com/documentation/Xcode/creating-your-app-icon-using-icon-composer)
- B 站也有不少视频可以进行参考学习

![Icon Composer 制作图标](/img/icon_composer.png)

> 注意，如果你希望分发保存的项目，请别忘记先压缩一下，\`.icon\` 为后缀的文件本质上也是一个文件夹！

### 2. 新建 Xcode 项目

创建新项目，模板请选择 "App"

![Xcode新建项目类型选择](/img/Xcode_new1.png)

然后的 Xcode 会要求你提供软件的名称，随便填写，组织对于第一次使用的用户而言随便填写一个即可，其他图方便均选 “None" 即可

![Xcode新建项目选项](/img/Xcode_new2.png)

如果你正在使用 macOS 15，建议直接跳转到[“附加”](#附加)通过指令编译，个人测试图形化手段没有成功

至此，你已经成功完成了项目的创建！

### 3. 引入并提取图标

请先把 \`.icon\` 文件更名为 \`AppIcon.icon\`，不然依旧是占位图标：

![占位图标](/img/macOS_build_placholderIcon.png)

直接将图标文件拖到文件树导入，弹出的提示窗口在确保唯一的项目是被选中的前提下点击Finish完成导入

直接运行然后退出，然后在顶栏选择 “Product" -> "Show Build Folder in Finder"，这将在访达中打开 Debug 构建所在位置

![选项位置](/img/Xcode_ProductLocation.png)

进入 Debug 目录，你会发现那个 \`.app\` 文件正在静静地躺在那里

如果你遇到了在访达中看起来依旧在使用占位图标的问题，你可以在选中应用然后按下 <kbd>Space</kbd>，打开 Quicklook ，在这里你可以确定它是否成功应用了你自己设计的新图标

![Quicklook下的编译产物](/img/macOS_product_quicklook.png)

至此，图标资源的生成工作已经完成！

现在右键这个程序，选择“显示包内容”，导航到 \`/Contents/Resources\` 下，你所需要的两个文件就在这里了

![所需的两个文件](/img/macOS_assets_needed.png)

把这两个文件复制出来，提取工作也告一段落

### 4. 应用新图标

现在到你所开发的软件这里，同样的打开包文件，定位到 \`/Contents/Resources\` 下，将上面复制的文件替换进去（或者单一的 \`Assets.car\`）

我在前面提到，macOS 26+在读取过程中会使用 \`Assets.car\` 中的文件合成液态玻璃图标，但我没提到这个 \`.icns\` 文件是为了保证对老系统（macOS 15 及更老版本）的兼容而保留的，所以如果你希望在这些老系统不要应用液态玻璃图标，上图中的 \`AppIcon.icns\` 无需复制进来

然后需要做的就是让 macOS 认出来，用文本编辑器打开包中 \`/Contents/Info.plist\`（不太推荐使用 Xcode，它会使用自然语言来解释那些晦涩的代码，虽然更容易看懂用途但你不一定能找到正确的值）

在 \`dict\` 中添加...

~~~xml
<key>CFBundleIconName</key>
<string>AppIcon</string>
~~~

保存后，现在你的应用的液态玻璃图标在 macOS 26+ 应该可以被正确识别了！

如果你希望修改 \`.icns\` 图标，你可以选择直接改名字去替换 \`Resources\` 目录下已有的图标，或者把新图标放进去然后修改 \`Info.plist\`：

~~~xml
<key>CFBundleIconFile</key>
<string>AppIcon.icns</string>
~~~

意为把App Bundle的图标更换为生成的 \`AppIcon.icns\`

至此，一切大功告成，如果系统看起来没有更新图标，你可以选择重启一下设备~

# 附加

## 太复杂了，有什么简单的方法？

在最开始编写的时候没意识到可以直接用命令行编译，这里给一个模板，替换其中的占位内容即可！不过要注意如果你设备有多个 Xcode，一定要 \`xcode-select\` 到 Xcode 26+，如果只是命令行工具也要

~~~bash
xcrun actool "{.icon 工程文件}" \\
    --compile "{导出目录}" \\
    --platform macosx \\
    --target-device mac \\
    --minimum-deployment-target 26.0 \\
    --app-icon "AppIcon" \\
    --output-partial-info-plist "/dev/null" \\
    --include-all-app-icons \\
    --enable-on-demand-resources NO \\
    --development-region en
~~~

> 注意，直接对着你的 Icon Composer 项目执行此代码可能不会生成用于 Fallback 的 icns 传统图标集，只要把里面的\`AppIcon\`替换成工程文件名（例如 \`XXX.icon\`，则替换为 \`XXX\`），就会生成一个新的 \`Assets.car\` 和 \`icns\` 图标集；这个 \`Assets.car\` 也能用，但 \`CFBundleIconName\` 需要填工程文件名，包括\` CFBundleIconFile\` 也请以icns图标的实际名称为准

## 这个 Assets.car 里面有什么？

看图：

![Assets.car 内的资源，使用 Asset Catalog Tinkerer 工具](/img/inside_assetsCar.png)
`;export{e as default};