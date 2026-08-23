var e=`---
title: 'UTM 下 Alpine aarch64 + Sway 安装指南'
date: 2026-07-22 13:42:07
tags: [Linux, VirtualMachine]
comment: giscus
license: cc-by-4.0
cover: /img/alpineUTM.png
---

# 序

Alpine Linux 是一个非常轻量化的 Linux 发行版。不同于传统发行版，它不使用 systemd、coreutils、glibc，而是使用 OpenRC、BusyBox、musl。好处是轻量，适合厌恶 systemd 的用户；使用 musl 也不必受 glibc 依赖版本问题的折磨。坏处是性能不一定最优，并且会遇到大量传统 Linux 上没有的问题。

Alpine Linux 总体还是更适合在容器环境下运行，在 UTM 里跑 aarch64 版本再装上 Sway，多多少少会踩一些坑——这就是本指南的意义：让你在安装时少走点弯路。

> [!NOTE]
> 介于 UTM 本质上是苹果的 Virtualization.framework 和 QEMU 的壳，且本指南使用的后端就是 QEMU，如果你正在使用 QEMU 或 Virt-Manager 等工具安装 aarch64 架构的 Alpine，本文还是有点借鉴意义的
> x86_64，也就是 Intel、AMD CPU 的处理器架构，与 aarch64 不同！如果你使用的是普通的电脑，除非用的是 \`qemu-system-aarch64\`，不然不适合你参考

## 效果

![效果 1](/img/alpine-final.png)
![效果 2](/img/alpine-final-m3.png)

> 请注意，上图中我还进行了多定制化工作，按照本指南一步步操作下来，最终效果与截图必定不同！
> Sway 最后怎么被你定制，是你的自由，我会在文末提及在后续定制中我还做了什么，提供参考

# 主

> [!IMPORTANT]
> 本文不能反映最新情况，如果你在安装过程中遇到了本文未提及的问题，请认准 Alpine Linux 的 Wiki：<https://wiki.alpinelinux.org/wiki/Main_Page>
> 本指南需要你对 Linux 有基础的使用与折腾能力，这里尽可能讲得细致一些

## 准备资源

访问 [Alpine Linux 下载](https://alpinelinux.org/downloads/)，下载 Virtual 版本的 aarch64 ISO；Standard 版本也能用，但针对虚拟化的优化稍少。

下载后你会得到一个不到 100MB 的 ISO 镜像——对，它就这么大。代价是很多必备软件都默认不包含，桌面也不例外。

## 创建虚拟机

> [!WARNING]
> 以 Apple Silicon Mac 为例，如果你使用的是 iPad、iPhone，甚至 Intel Mac，请勿盲从，按照实际情况选择！

### 新建虚拟机

在 UTM 下选择“+（新建）”->“虚拟化”->“Linux”，随后按以下页面配置：

- **硬件**：按设备情况分配内存。Alpine 所需内存很少，仅安装 Sway 及基础软件的话 2GB 打底。不推荐启用 OpenGL 硬件加速。
- **Linux**：切勿勾选“使用 Apple 虚拟化”，设置 Alpine 的安装 ISO 后下一步。
- **存储空间**：保持默认即可，磁盘占用按实际使用增长；愿意的话设为 8GB 也足够。
- **共享目录**：设置你希望共享的目录，当然也可以不管
- **总结**：名称自己写一个喜欢的，**勾选“打开虚拟机设置”**，点击完成。

### 添加串口（可选但推荐）

Alpine aarch64——至少本指南基于的 3.24 版本——存在 TTY 串扰问题，会影响后续的正常使用。虽然你可以通过快捷键 <kbd>⌃control</kbd>+<kbd>⌥option</kbd>+<kbd>fn</kbd>+<kbd>F2‑6</kbd> 切换 TTY，但我更推荐添加一个串口，还能方便地从宿主机粘贴指令。

在上一步勾选了“打开虚拟机设置”后，设置窗口会自动弹出。在窗口中点击左下角的 "+" 选择“串行”，保存即可。

![串口设备添加](/img/utm_serial_settings.png)

至此，虚拟机创建完成。

## 安装系统

启动虚拟机，等到 \`localhost login:\` 提示出现后，输入 \`root\` 登录账号，随后在命令行内输入 \`setup-alpine\` 开启安装程序。

![setup-alpine](/img/alpine-postinstall.png)

\`setup-alpine\` 会依次询问以下问题，按你的实际情况回答即可：

1. **Hostname（主机名）**：对于不进入生产流程的虚拟机，直接回车（默认 \`localhost\`）或随便输入点英文均可，虚拟机环境影响不大。
2. **网络接口（Interfaces）**：无脑回车即可，这是设置网络连接。**请注意：安装 Alpine Linux 时必须拥有稳定的网络连接！**
3. **Root 密码（Root password）**：务必输入能记住的密码。root 是 Linux 下拥有最高用户权限的账户，后续流程我们会经常用到它。输入密码时不会显示字符，这是正常现象。如果看到 \`Bad password\` 提示，说明密码强度偏低但不影响使用，在 \`Retype password\` 中再输入一次确认即可。
4. **时区（Timezone）**：中国大陆用户一般采用北京时间，设置为 \`Asia/Shanghai\`——先输入 \`Asia\`，回车，再输入 \`Shanghai\`，回车。如果你在新疆地区，则输入 \`Urumqi\`，注意大小写敏感！
5. **代理 / NTP 服务（Proxy / NTP）**：除非你知道自己在做什么，否则直接回车使用默认值即可。
6. **APK 镜像（APK Mirror）**：APK 是 Alpine 的包管理器，这里选择国内的镜像站。推荐使用清华源：按下 <kbd>S</kbd> + <kbd>⏎Enter</kbd> 进入搜索，在列表中找到 \`mirrors.tuna.tsinghua.edu.cn\` 对应的编号（3.24 版本中为 13），按 <kbd>Q</kbd> 退出列表。国内其他高校与公司也部署了相关镜像可供选择。如果你不想手动选，按 <kbd>F</kbd> + <kbd>⏎Enter</kbd> 让安装程序自动挑选即可，只是耗时稍长。
7. **用户创建（User）**：输入你希望创建的登录用户名（也将用于用户主目录名），回车；接着输入全名（Full Name），直接回车跳过即可。随后设置该用户的密码（同样不回显），输入两次确认。后续的 SSH 配置问题按需回车跳过。
8. **磁盘与安装（Disk & Install）**：多数情况依次输入 \`vda\` → \`sys\` → \`y\` 即可。**注意：此操作会清空虚拟磁盘内的所有数据，全新安装无需担心。**

![磁盘分区安装](/img/alpine-disk.png)

随后进入分区和安装流程。等待 \`Installation is complete. Please reboot.\` 出现后，推出 ISO 镜像并重启虚拟机。如果你能在 Alpine 的登录提示符处停住，并且输入你创建的新账号能够成功登录，说明安装流程已经完成！

![登录](/img/alpine-afterinstall.png)

## 环境配置 & 安装桌面

### APK 准备

Alpine Linux 缺乏大量传统 Linux 必备软件（例如 \`vim\`），而不少软件只能在默认未开启的 \`community\` 源中获取，故先对它进行处理。

如果当前是普通用户，先切换到 root：

~~~bash
su -
~~~

输入以下指令编辑 APK 的软件源列表：

~~~bash
vi /etc/apk/repositories
~~~

打开后找到第三行 community 源（以 \`#\` 开头），去掉行首的 \`#\`，保存并退出。

![APK 源编辑](/img/alpine-apk-source.png)

随后执行一遍 \`apk update\` 更新源，至此完成 APK 的相关准备。

### 基础应用

接下来你可以通过 \`apk\` 指令安装一些必备软件，这里提供一部分思路，请在 root 账户下运行：

~~~bash
apk add vim nano curl wget # 分别安装 vim、nano、curl、wget，按需增减
~~~

Alpine 不自带提权执行工具。通用选择是 \`sudo\`，更符合 Alpine 哲学的选择是 \`doas\`（Wiki 多用它），二选一即可。安装后取消注释对应配置文件中的 \`wheel\` 组限制（\`sudo\` 用 \`visudo\`，\`doas\` 编辑 \`/etc/doas.conf\`）。

![doas 配置](/img/alpine-doas-config.png)

另外建议还在 root 下执行以下命令，将新建的普通用户加入 \`wheel\` 组：

~~~bash
adduser <你的用户名> wheel
~~~

### 准备 Wayland

Sway 基于 Wayland 图形协议运行，因此在安装 Sway 之前需要先搭建 Wayland 环境。Alpine 提供了一键安装指令，在 root 下执行即可：

~~~bash
setup-wayland-base
~~~

该脚本会自动安装 Wayland 相关组件、启用必要服务并完成基础配置。

此外，建议将你的普通用户加入 \`video\` 组，以获得访问显卡设备的权限：

~~~bash
adduser <你的用户名> video
~~~

### 处理 TTY 串扰

为了提升使用体验，也为了方便后续在非串口终端下操作，我们最好手动修复 TTY 串扰问题。Alpine Linux 下 tty0 和 tty1 会共用同一个 VT。

在串口中以 root 账户执行以下指令：

~~~bash
vi /etc/inittab
~~~

找到 tty1 对应的行，在其开头添加 \`#\` 注释掉它：

~~~diff
- tty1::respawn:/sbin/getty 38400 tty1
+ # tty1::respawn:/sbin/getty 38400 tty1
~~~

保存并退出，然后重启系统。

### 安装 Sway VM

Alpine 提供了桌面安装工具，帮完成大部分配置。不过请注意：装完不代表重启就能直接进入桌面！

请在 root 账户下输入以下指令：

~~~bash
setup-desktop sway
~~~

随后执行以下指令设置 seatd，在 root 账户下执行：

~~~bash
apk add seatd
apk del elogind # setup-desktop 自动安装，但 Wiki 提及用不到，实际情况的确，且可能会与 seatd 冲突
adduser <你的用户名> seat
rc-service seatd start
rc-update add seatd default
~~~

### 配置普通用户环境

Sway 需要在用户环境中正确设置若干变量才能正常运行。现在切换到普通用户，配置其 \`.profile\` 文件。

如果你当前仍在 root 账户，**先退出回到普通用户**：

~~~bash
exit # 之前是 su - 切过来的，直接退出
su - <你的用户名> # 如果直接以 root 登录的，改用这条
~~~

然后用文本编辑器编辑家目录下的 \`.profile\`：

~~~bash
vi ~/.profile
~~~

一般来说这是新文件，通过串口窗口粘贴以下内容（vi 下按 <kbd>I</kbd> 进入 INSERT 模式）：

~~~bash
if [ -z "$XDG_RUNTIME_DIR" ]; then
        export XDG_RUNTIME_DIR=/run/user/$(id -u)
        if [ ! -d "$XDG_RUNTIME_DIR" ]; then
                doas mkdir -p "$XDG_RUNTIME_DIR" 2>/dev/null || true
                doas chown "$(whoami):$(whoami)" "$XDG_RUNTIME_DIR" 2>/dev/null || true
                chmod 700 "$XDG_RUNTIME_DIR" 2>/dev/null || true
        fi
fi

if [ -z "$WLR_RENDERER" ]; then
        export WLR_RENDERER=pixman
fi

if [ -z "$WAYLAND_DISPLAY" ] && [ "$(tty)" = "/dev/tty0" ]; then
        exec dbus-run-session sway
fi
~~~

保存并退出。然后执行以下指令让配置立即生效：

~~~bash
source ~/.profile
~~~

> [!NOTE]
> \`.profile\` 做了三件事：
>
> 1. 设置 \`XDG_RUNTIME_DIR\`（用 \`doas\` 创建目录时需输一次密码）;
> 2. 强制 \`pixman\` 软件渲染（VirtIO 硬件渲染有图形错误）;
> 3. 登录 tty0 时自动启动 Sway，其他 tty 需手动执行 \`dbus-run-session sway\`。

一般情况下 \`source\` 后环境变量即刻生效，不会出现错误提示。

![生效后进入 Sway](/img/alpine-sway-desktop.png)

![Sway 下 Foot 终端发行版信息](/img/alpine-sway-brand.png)

### 安装虚拟机增强工具

QEMU Guest Agent 是运行在虚拟机内部的后台服务，有利于虚拟机与虚拟机软件之间的通讯。

在 root 下执行：

~~~bash
apk add qemu-guest-agent
rc-service qemu-guest-agent start
rc-update add qemu-guest-agent default
~~~

> \`spice-vdagent\` 不推荐使用——其对 Wayland 的支持较为糟糕。

**到这一步，你的安装基本就完成了，恭喜！**
现在你已经有了一个能开机直接进 Sway 的 Alpine 虚拟机。接下来怎么打扮它——装什么软件、配什么主题、用哪个终端——就是你自己的事了。但如果你不知道后面怎么进一步折腾，我们继续。

## 自定义

### 软件推荐

下面分类列出常用软件，按需选择安装。以下均在 root 账户下执行，如果当前是普通用户记得加 \`doas\`。

#### 浏览器

~~~bash
# Firefox
apk add firefox

# Chromium
apk add chromium chromium-lang
~~~

> 在 pixman 软件渲染下，启动 Firefox 时建议加上 \`MOZ_ENABLE_WAYLAND=1 firefox\`，以获得更好的渲染效果。

#### 文件管理器

~~~bash
# Thunar —— Xfce 的文件管理器，轻量
apk add thunar thunar-lang

# PCManFM —— 同样轻量的选择
apk add pcmanfm

# Nautilus —— GNOME 文件管理器，功能最全但较重
apk add nautilus

# yazi —— TUI 文件管理器
apk add yazi
~~~

#### 终端模拟器

\`setup-desktop sway\` 已默认安装了 \`foot\`，如果你需要其他选择：

~~~bash
# Alacritty —— 轻量 GPU 加速终端
apk add alacritty

# Kitty —— 功能丰富的 GPU 加速终端
apk add kitty

# Ghostty —— 优秀的 GPU 加速终端
apk add ghostty

# Sakura —— 轻量 GTK 终端
apk add sakura
~~~

安装后记得修改 Sway 配置来指向你选择的终端。

#### 应用启动器与面板

~~~bash
# rofi —— 应用启动器（可替代 wmenu）
apk add rofi-x11-wayland

# waybar —— 高度可定制的 Wayland 状态栏（可替代 swaybar）
apk add waybar

# mako —— 轻量通知守护进程
apk add mako
~~~

#### 实用工具

~~~bash
# 系统信息显示
apk add fastfetch # 更现代、可自定义的 fetch

# 截图
apk add grim slurp # grim：截屏，slurp：区域选择
apk add wl-clipboard # Wayland 剪贴板工具（wl-copy / wl-paste）

# 图片查看
apk add imv # 轻量 Wayland 原生图片查看器

# 媒体播放
apk add mpv # 终端播放器，Wayland 下表现良好

# 压缩/解压
apk add unzip zip tar xz zstd

# 系统监控
apk add htop btop # htop 经典，btop 图形化更丰富

# 网络工具
apk add iwd # iNet Wireless Daemon，无线网络管理
apk add networkmanager # 图形化网络管理
~~~

以上软件均可自由组合，不必全部安装。Alpine 的 aarch64 仓库覆盖了大部分日常应用，遇到找不到的包可以先去 [pkgs.alpinelinux.org](https://pkgs.alpinelinux.org/) 搜索确认。

### 中文环境

#### 字体与 locale

安装中文字体：

~~~bash
doas apk add font-noto-cjk
~~~

安装 musl 的 locale 数据包：

~~~bash
doas apk add musl-locales
~~~

检查当前可用的 locale：

~~~bash
locale -a
~~~

> 如果 \`locale -a\` 中不包含 \`zh_CN\`，不必强求——musl 会安静地回退到 C/POSIX 行为，不影响功能。

#### 输入法

安装 fcitx5：

~~~bash
doas apk add fcitx5 fcitx5-configtool fcitx5-qt fcitx5-gtk
~~~

回到 \`~/.profile\`，在 Sway 启动块之前加入 locale 与 fcitx5 环境变量：

~~~bash
# 中文 locale
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8

# fcitx5 输入法
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export SDL_IM_MODULE=fcitx
export GFLW_IM_MODULE=fcitx
~~~

> 如果希望串口保持英文、仅 Sway 使用中文，将 locale 变量放到 Sway 启动块内部，开头加 \`export LANG=C.UTF-8\` 作为全局默认。

最后在 \`~/.config/sway/config\` 末尾添加 fcitx5 自启动：

~~~
exec --no-startup-id fcitx5 -d
~~~

> 首次编辑 Sway 配置建议先复制默认配置：\`cp /etc/sway/config ~/.config/sway/config\`

重载 Sway 后 fcitx5 会自动启动。运行 \`fcitx5-configtool\` 添加你需要的输入法（如拼音、双拼、五笔等）。

![设置 Fcitx5](/img/alpine-ime.png)

> 如果你愿意的话，ibus + libpinyin 这个组合也未尝不可。fcitx 和 ibus 均可搭配 Rime 使用获取更好的中文输入体验。

### 优化 VT 显示

Alpine 的 VT 默认关闭了 Unicode 支持，且 VT 字体在高分屏下偏小。开启 Unicode 并换用大字体后，VT 的显示会更舒适。

#### 开启 Unicode

~~~bash
doas sed -i 's/^# *unicode=.*/&\\nunicode="YES"/' /etc/rc.conf
~~~

#### 调整 VT 字体

> 如果你使用了 \`kmscon\` 等取代默认的 VT，这部分可能不适合你！

安装 Terminus 字体包：

~~~bash
doas apk add terminus-font
~~~

编辑控制台字体配置：

~~~bash
doas vi /etc/conf.d/consolefont
~~~

写入以下内容：

~~~
consolefont="ter-132n.psf.gz"
~~~

然后启用 consolefont 服务：

~~~bash
doas rc-update add consolefont boot
~~~

重启后生效。\`ter-132n\` 是 Terminus 字体的大号版本，你也可尝试其他尺寸，如 \`ter-116b\`（加粗）或 \`ter-132b\` 等。

![更换后效果，左改，右原](/img/alpine-vtfont.png)

### 音频

> 这里采用 PulseAudio，如果愿意，PipeWire 也行

#### 安装与服务

~~~bash
apk add pulseaudio pulseaudio-utils alsa-utils
addgroup <你的用户名> audio
rc-service alsa start
rc-update add alsa default
rc-service alsa save
~~~

随后处理静音——以普通用户运行 \`alsamixer\`，找到 \`Master\` 和 \`PCM\`，如果下方显示 \`MM\`（静音），按 \`M\` 键切换为 \`00\`（开启），<kbd>Esc</kbd> 退出。

如需图形化控制音频，可额外安装 \`pavucontrol\`。

#### 在 Sway 中启用

在 \`~/.config/sway/config\` 末尾添加：

~~~
exec --no-startup-id pulseaudio --start --exit-idle-time=-1
~~~

### 文件传输

宿主机与虚拟机之间传文件，目前有以下方式：

**VirtFS**：

在 UTM 的共享目录设置中添加共享后，将“目录共享模式”设置为“VirtFS”，虚拟机内手动挂载，请在终端输入：

~~~bash
doas mkdir -p /mnt/shared
doas mount -t 9p share /mnt/shared -o trans=virtio,version=9p2000.L
~~~

若要卸载则输入 \`doas umount /mnt/shared\` 即可。请注意，\`/mnt/shared\` 需要 root 权限才能读写！

如需开机自动挂载，将 mount 命令写入 \`/etc/fstab\`。

**SCP / SFTP**：

这两玩意均依赖 SSH，一般来说当你知道虚拟机的 Guest IP，即可访问！

获取 IPv4 地址，请在终端输入：

~~~bash
ip -4 addr
~~~

然后使用你习惯的工具，例如 FileZilla 访问即可。

![SFTP 登录后](/img/alpine-sftp.png)

> 请注意，请务必指明协议为 SCP 或 SFTP（即 \`scp://\` 或 \`sftp://\` 开头），用户名为你的登录用用户名，密码为你的登录密码，如果你修改了端口，也请务必指定！

### 进一步自定义

Sway 生态的组件几乎都是配置驱动的，下面直接给出官方文档与社区资源的入口。

#### 官方资源

| 项目 | 说明 | 链接 |
|------|------|------|
| **Sway** | 合成器本体，配置参考 \`man 5 sway\` | [swaywm.org](https://swaywm.org/) |
| **Waybar** | 状态栏，配置用 JSON + CSS | [GitHub Wiki](https://github.com/Alexays/Waybar/wiki/Configuration) |
| **Rofi** | 应用启动器 | [GitHub](https://github.com/davatorium/rofi) |
| **Alpine Wiki - Sway** | Alpine 下的 Sway 指南 | [wiki.alpinelinux.org](https://wiki.alpinelinux.org/wiki/Sway) |

#### 社区参考

- **GitHub 搜索 \`sway dotfiles\`**：[快速跳转](https://github.com/search?q=sway+dotfiles)——数千份公开配置可直接借鉴（直接搜索 \`dotfiles\` 选择更多，但也更乱）
- **Alpine Linux 社区**：在[官方社区](https://alpinelinux.org/community/)指向的地方掘宝

#### 快速上手建议

1. **从默认配置开始**：\`cp /etc/sway/config ~/.config/sway/config\`，逐行读注释，边读边改
2. **改一样、观察一样**：不要一次性贴大段网上的配置，逐个选项调整才能理解每行的作用
3. **盯住 Sway 的 man 页**：\`man 5 sway\` 是最完整准确的参考，遇到配置项不生效时优先查它（需要安装 \`macdoc\` 和 \`sway-doc\`）

另外一说，如果你选择了 zsh，[Oh My Zsh](https://ohmyz.sh/) 是高质量自定义配置起点，安装后可从数千款主题和插件中选择。具体配置注意事项见下方 FAQ“如何更换 Shell？”。

![指引](/img/alpine-custom.png)

还有像 SwayLock、Grub 这些也可以自定义：这是你的自由发挥时间！但是请做好备份防止搞坏系统，搞来搞去被迫重装。

## FAQ

### VirtIO GPU 到底有什么问题？

简单说：在选择硬件加速，VirtIO GPU 的 3D 加速会导致画面撕裂、花屏、窗口内容不刷新等图形异常。这短期内无解。

因此本文全程使用 \`pixman\` 软件渲染——没有硬件加速，但胜在稳定。日常浏览网页、写代码、看文档完全够用，只是视频播放和图形密集操作会感觉吃力，但你选择玩虚拟机应该也没想过干这些事吧。

![VirtIO GPU 硬件加速](/img/alpine-virt-gpu-crash.png)

### 如何更换 Shell？

Alpine 默认使用 BusyBox 自带的 \`sh\`，如果你更喜欢 bash、zsh 或 fish：

~~~bash
doas apk add bash zsh fish
~~~

然后使用 \`chsh\` 切换：

~~~bash
chsh -s /bin/bash # 切换到 bash
chsh -s /bin/zsh # 切换到 zsh
# 重新登录后生效
~~~

> 注意：更换 Shell 后，\`.profile\` 不一定会被自动读取。请将之前配置的环境变量迁移到对应的文件，或设置在全局 \`/etc/profile\` 中。
> 当然对于 bash，应该没啥事；zsh，你可以在 \`.zprofile\` 中写入 \`emulate sh -c 'source ~/.profile'\` 解决；fish 暂不清楚。

### 如何安装登录管理器？

本指南直接使用 \`.profile\` 自动启动 Sway，不依赖登录管理器。如果你偏好图形化登录界面，或者说厌烦输两次密码，SDDM 是与 Sway 兼容性较好的选择。

具体安装流程不提供，因为我也没安装成功。

安装后**从 \`.profile\` 中删除或注释掉 Sway 的自启动行**，避免 \`sddm\` 与 \`exec dbus-run-session sway\` 冲突。

如果你希望轻量化，Ly 也未尝不可，但是一方面这要在 \`edge\` 分支的 \`testing\` 仓库获取（截止发文），另一方面，你可能还要被 TTY 串扰折磨。

### elogind 和 seatd 到底用哪个？

- **seatd**：轻量，设计简洁，本文选择了它，Wiki 也说明它有用，elogind 没用

检查当前运行状态：

~~~bash
rc-service seatd status
rc-service elogind status
~~~

如果两个都在运行，停掉 elogind。本文在 seatd 安装后执行了 \`apk del elogind\` 来彻底移除。

### 如何手动启动 Sway？

如果 Sway 没有自动启动，以普通用户登录后执行：

~~~bash
dbus-run-session sway
~~~

> 前提是 \`XDG_RUNTIME_DIR\` 已设置，否则 Sway 会报错退出。如果还没配置 \`.profile\`，请先完成「配置普通用户环境」步骤。

### TTY 串扰具体是什么表现？

Alpine aarch64 的 3.24 版本中，tty0 和 tty1 被映射到了同一个 VT 中。在两者间切换时会看到同一个会话——你在一个终端输入的内容会出现在另一个终端上。这会严重影响内容输入输出体验。

### Sway 的部分快捷键与 macOS 冲突怎么办？

Sway 的默认修饰键是 \`Mod4\`（Super 键，对应 macOS 的 Command 键）。在 Mac 上这意味着 \`Mod4+Q\` 关闭窗口会与 macOS 的退出应用冲突，\`Mod4+Shift+Q\` 退出 sway 同理。此外还有很多快捷键都会与 macOS 本身的快捷键冲突。

解决办法是**将 Sway 的修饰键改为 \`Mod1\`（即 Option 键）**。在 \`~/.config/sway/config\` 中将以下行：

~~~
set $mod Mod4
~~~

改为：

~~~
set $mod Mod1
~~~

重载 Sway 配置后生效（\`$mod+Shift+C\` 或重启 Sway）。这样大部分快捷键（如 <kbd>⌥option</kbd> + <kbd>⏎Enter</kbd> 打开终端、<kbd>⌥option</kbd> + <kbd>D</kbd> 启动应用）多数情况不再与 macOS 系统快捷键冲突。

# 结

玩得愉快~~~

最开始想试试 Niri 的，折腾了很久也没啥成果，放弃转而研究 Sway。

这篇文章 AI 代写了很多，但也没办法，毕竟上面整个文章可是折腾了一整天不断试错的成果捏~（累

_附：我自己乱配的 dotfile：https://github.com/WhatDamon/dotfiles_
`;export{e as default};