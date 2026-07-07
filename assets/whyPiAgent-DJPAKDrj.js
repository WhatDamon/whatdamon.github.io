var e=`---
title: '为什么我选择 Pi Agent'
date: 2026-07-02 18:10:01
tags: [AI, Agent, Develop]
comment: giscus
license: cc-by-4.0
cover: /img/whypiagent.png
---

# 序

2026 年初，一个名叫 Pi 智能体在开发者社区大受欢迎，在 OpenRouter 榜单中排名居高不下。它的作者 Mario Zechner（他也是知名游戏引擎 libGDX 的开发者）因"讨厌所有现有的 Coding Agent"，自己写了一个。结果它不仅大受开发者社区的欢迎，在 GitHub 夺得数万颗 Star，并且还成为了 OpenClaw 这个驰名项目的核心

> There are many agent harnesses, but this one is yours. Pi is a minimal agent harness. Adapt Pi to your workflows, not the other way around.
> 智能体框架种类繁多，但这款专为你而设。Pi 是一款极简主义的代理框架。你可以根据你的的工作流来调整 Pi，而不是让工作流去适应它。
> -- 来自 [Pi 官网](https://pi.dev/)

Pi 是一个极简的 AI 智能体工具。不像 Claude Code 替你做事，Pi 将很大一部分控制权交给了用户，这与其他 AI Agent 相比很不一样。它深受 Unix 哲学影响，让 Pi 就像 Unix 命令行工具——它不试图变得智能，它只默默地做你说的事。

# 为什么选它

## 极简，高度自定义

Pi 的系统提示词不到 1000 tokens，出厂没有子智能体，没有待办，没有计划模式，没有 MCP，没有代码回退，默认就是 YOLO，内置工具就应付个基本的开发。它的出厂生态看起来平平无奇，但它可以安装多到数不胜数的包、扩展、主题等，轻松配置你喜欢的模型，将 Pi 打造为属于你自己的智能体

例如，你喜欢极简，开箱即用也未尝不可，它能够应付大部分工作；你喜欢花哨，Pi 的可自定义性与插件开发难度比 OpenCode 低不少，借助 Pi，你能玩出自己的个性，甚至你还能在 Pi 中玩 DOOM（只要能计算的就有 DOOM 的影子）

![Pi 运行 DOOM](https://pi.dev/doom-extension.png)

> If you want something that works on day one, you can use other coding agents as they are polished products. If you are a minimalist or want to actually own your context and workflow, Pi is ideal for you.
> 如果你想要一款开箱即用的工具，可以选择其他开发工具，因为它们都是经过精心打磨的产品。如果你是极简主义者，或者希望真正掌握自己的工作环境和工作流程，那么 Pi 就是你的理想之选。
> -- 来自 [OrewaDeveloper 的文章](https://jayvanzyl.me/i-tried-pi-open-source-coding-agent-after-watching-mario-zechners-talk/)

借此机会提供我所使用的插件列表：

> [!NOTE]
> 撰文时我的主用模型为 DeepSeek V4，用于项目开发，以下插件不一定是最好的，个人使用过程中也有可能会调整

| 插件 | 用途 |
|---|---|
| \`pi-web-access\` | 网页访问 |
| \`pi-subagents\` | 子智能体 |
| \`context-mode\` | 管理上下文压缩 |
| \`@hypabolic/pi-hypa\` | 减少工具输出噪音 |
| \`pi-mcp-adapter\` | MCP 支持 |
| \`@juicesharp/rpiv-ask-user-question\` | 询问用户 |
| \`@juicesharp/rpiv-todo\` | 待办 |
| \`@ayulab/pi-rewind\` | 会话与代码回退 |
| \`pi-lens\` | LSP、代码格式等处理 |
| \`pi-import-claude-history\` | 导入 Claude Code 会话 |
| \`pi-intercom\` | 跨会话通信 |
| \`pi-prompt-template-model\` | 提示词模板 -> 特定模型 |
| \`pi-extension-manager\` | 插件管理器 |
| \`pi-reasonix\` | DeepSeek 提高缓存命中率 |
| \`superpowers-zh\` | AI 编程超能力 |
| \`pi-btw\` | 中途询问 |
| \`@alexanderfortin/pi-deepseek-usage\` | DeepSeek 余额显示 |
| \`pi-markdown-preview\` | Markdown、LaTeX 渲染 |
| \`@vanillagreen/pi-session-manager\` | 更好的会话管理 |
| \`@vanillagreen/pi-skills-manager\` | 技能管理，顺便防止技能清单霸屏 |
| \`pi-spark\` | 体验优化打磨 |
| \`@upstash/context7-pi\` | Context7 文档使用 |

![效果](/img/piwindow.png)

BTW 上面的清单中并没有 Plan 模式和权限管理，**如果你是用的是中转站服务，特别是不正规的小型中转站**，请一定，务必，安装权限管理插件，人工审查 AI 尝试进行的操作，谨防中转站利用 AI 在你的设备中偷敏感数据（包括但不限于你的隐私，机密，API Key，安全凭证，甚至你的加密货币密钥），或其他供应链攻击[^1]

## 透明，可信任

前段时间 Reddit 用户 LegitMichel777 爆出 Claude Code 会暗中标记中国用户[^2]，通过偷偷摸摸的方式发送给 Anthropic，成为模型降智、打击中转站、封号的重要信息支撑。虽然口头称这是为了防止滥用，反蒸馏，并且在发文时代码应该已经删除，但其引起了不少用户对其安全性的质疑[^3]：Claude Code 有这么高的权限，今天你用它追踪中国用户，明天是不是一个更新，你就暗中发送我电脑中的隐私数据？

Pi 是一个开源项目，相较于 Claude Code 的闭源模式，你拥有审查代码的权利，这种透明带来的就是信任：结合本地 AI 你可以将你的项目放心地交给 Pi 去处理，只要你安装的插件是干净的，就不用过分担心你的智能体偷偷摸摸把你的隐私发送给第三方

另外 Pi 相较于 Claude Code，或其他部分 AI Agent，模型的思考与工作流是完全打印在屏幕上的，不用看着 Tokens 消耗却不知道发送了什么，也不会干巴巴给你最终结果，你可以借此机会发现 AI 在决策阶段的错误，及时止损。不仅如此，其它工具还可能会内部注入开发者看不见的提示词（例如 Claude Code 的隐藏提示词会影响 DeepSeek 的缓存命中，导致用下来特别烧钱），Pi 除非装额外插件，不这么干，结果就是你的智能体不会随便自作主张，对于 Token 计费，你的花销会更少

也因此，Pi 特别适合想对智能体完全控制的用户，也适合对隐私有部分顾虑的用户，更适合想尽可能摆脱大公司控制的人

> Pi is such a joy to use! It's easy, customizable, and fits my workflow perfectly. I use Pi inside my VScodium terminal with opensource models. Pi makes my entire dev workflow FOSS, which means I no longer worry about large tech companies making changes to their models.
> Pi 使用起来真的太令人愉悦了！它简单易用、支持自定义，而且完美契合我的工作流程。我会在 VSCodium 的终端中使用 Pi，搭配开源模型。Pi 让我的整个开发工作流都变成了自由开源软件，这意味着我再也不用担心那些大型科技公司会对他们的模型进行修改了。
> -- 来源 [ProductHunt 针对 Pi 的评价，来自 Gurbax (Ashwini Gurbaxani)](https://www.producthunt.com/products/pi-coding-agent-3/reviews?review=530033)

> Vulnerability breeds trust, concealment breeds distance
> 脆弱孕育信任，隐瞒孕育距离
> -- 来源 [Pi 开发者 Earendil Inc. 官网，价值观](https://earendil.com/values/)

## 快速响应

只要你不装太多插件，AI 服务提供商别出岔子，Pi 的速度还是相当可观的：启动不磨叽，任何按键按下几乎秒响应，具体的输出速度和首字延迟方面，这点受到影响的因素太多，不再赘述

即便客观上讲，不去测量具体数值，速度这个东西还是有点主观，但我还想援引一个未知网友的评价：

> 同一个编程任务，同一个模型。Pi：2 分钟，Claude Code：10 分钟
> 同一个 prompt，同一个模型，差了 5 倍。
> -- 来自 [C114](https://www.c114.net.cn/industry/71556.html)

## 不止代码

不像 Claude Code、OpenCode、Codex 这些工具，Pi 的能力不限于给你编写代码，对于更多人而言，日常更需要一个智能体能够帮助他们搜资料、读文档、整理表格、写汇报、做 PPT，甚至做视频，Pi 在安装了所需要的包，技能和 MCP 后，它可以自然地成为多数人工作流的一部分，服务用户。相较而言，Claude Code 等就稍显逊色，虽然不是不能做

Pi 的这么多特性也让它受到了 OpenClaw 的青睐：每一台跑着官方 OpenClaw 的机器，都运行着一个 Pi

> [!TIP]
> 如果你想用 Pi 做些偏演讲的视频，可以看看 \`hyperframes\` 这个项目，如果再接入个 TTS，Pi 还能说话

## 它确实好用

我用过 OpenCode、Claude Code，为了提高 DeepSeek 的缓存命中我也用过 Reasonix，Pi 是近期少有的给我这么多折腾乐趣的 AI 智能体：折腾插件，配置，不断试错。此外我还顺带解决了过去因为使用 PKG 安装包安装 Node.js 导致的一堆让人头疼的权限问题，还搞定了 \`nvm\` 等工具的部署，为未来玩前端奠定了更好的基础，也算是意外之喜吧

顺便一说，本站的代码背后就有 Pi + DeepSeek V4 Flash 的功劳

> [!TIP]
> 如果你还同时使用 OpenCode，可以看看 \`pi-opencode-config-reader\` 插件，一定程度能帮你省下不少事

# 但它不是神

上文多次次强调：它是极简的，但代价是，它有入门门槛，学习曲线相较于其他智能体，算比较曲折

> Pi is one such agent harness, and it’s hands-down my favorite AI app for DevOps, coding, and regular tinkering tasks – provided I use a certain pre-configured extension to get rid of its biggest drawback.
> Pi 是这样一款智能体，它毫无疑问是我最喜欢的用于 DevOps、编程和日常折腾任务的人工智能应用——前提是我要使用某个预配置的扩展程序来消除它最大的缺点。
> -- 来源 [Ayush Pande 的 XDA Developers 文章](https://www.xda-developers.com/i-refuse-to-run-pi-without-this-extension/)

当然正如上文所言，你要开箱即用也未尝不可，但要好用，要用的安心，离不开折腾：装插件、试错、配置，甚至从头开始......

> 没有子 Agent。Pi 不会自动把复杂任务拆成多个子任务去并行处理。它就是一个单一的 Agent，线性执行。
> 没有计划模式。它不会先给你一个计划让你确认再开始写代码。你告诉它做什么，它就开始做。
> 权限控制弱。没有像 Claude Code 那样的权限审批机制——它直接执行你给的命令。
> 学习曲线。相比"开箱即用"的 Cursor 或 Claude Code，Pi 需要更多的命令行操作和配置。
> -- 来源[威易网](https://www.weste.net/2026/05-27/Pi-Agent.html)

个人在配置过程中也频频出问题，例如上文提到的重装 Node.js 就是因为装插件被权限问题逼迫的结果（Pi 的插件安装非常依赖 NPM）

虽然目前有诸如 \`oh-my-pi\` 的分支做了很多整合工作，让 Pi 更加接地气，Pi 的扩展中也没少有一体包，安装一个包就能带来大部分其他智能体自带功能，但千万别想着原版 Pi 自带，毕竟做太多加法与 Pi 的设计理念相悖

## 哪些人不适合 Pi？

1. **电子文盲**：你们可能更加适合低代码平台？
2. **不会用或畏惧命令行的用户**：不像 OpenCode、Codex、Claude 都提供了 GUI 版本，点点鼠标就能用，Pi 虽然你也能用 GUI，但初始配置依旧离不开对着命令行，看着输出调试
3. **只喜欢开箱即用**：Pi 的开箱即用体验不一定是最好的，它只提供一个极简的基座，对于多数用户而言，Pi 很难满足你花样的需求。真求个开箱即用，个人还是更推荐 OpenCode 或其他智能体
4. **设备糟糕但想白嫖的用户**：白嫖不是不行，本地部署 AI 模型即可，但它对设备性能要求并不低，特别是能满足日用的；此外正规中转站的免费 AI 基本都有或这或那的限制，高强度使用除非用不正规的公益中转站，免不了花钱
5. **订阅了 Claude Pro 并计划使用它的用户**：可能是 A➗ 神力，你能够用，但要额外计费，而不是算在 Pro 计划内，考虑到国外 AI 模型价格可能会爆预算[^4]

# 总结

我的智能体工具使用路径大致为：OpenCode -> Claude Code -> Reasonix -> Pi，如果 Pi 没啥变故，并且没啥更优秀的选项，Pi 大概率将成为我的主力智能体工具，故向各位推荐 Pi

但是，无论你使用的是什么 AI 智能体工具，请永远不要忘记你是一个有主观能动性的人类（假设这篇文章不被机器人阅读），使用这些 AI 工具一定要有分寸：AI 不是万能的，它也有可能犯错，而你是一切的掌舵人

> In a world hurtling towards AI, we believe humans are the best agents. AI is possibly the most powerful tool humanity has ever seen, but we wield the hammer, the hammer does not wield us.
> 在一个向人工智能飞速推进的世界里，我们相信人类是最优秀的“智能体”。人工智能可能是人类见过的最强大的工具，但我们掌握的是锤子，锤子不掌控我们。
> -- 来源 [Pi 开发者 Earendil Inc. 官网，目标](https://earendil.com/purpose/)

[^1]: [Your Agent Is Mine: Measuring Malicious Intermediary Attacks on the LLM Supply Chain](https://arxiv.org/pdf/2604.08407)
[^2]: [Anthropic embedded spyware in Claude Code — and attempted to hide it from you : r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1ujila1/anthropic_embedded_spyware_in_claude_code_and/)
[^3]: [International Cyber Digest on X: "‼️ BREAKING: Anthropic has embedded hidden spyware-like code in Claude Code that covertly targets Chinese users. It then sends information regarding every user by injecting it into their prompt message. Claude Code is sending info like timezone, proxy and possible AI Lab https://t.co/EjfwtirhES" / X](https://x.com/IntCyberDigest/status/2071971609183678544)
[^4]: [I tried Pi after watching its founder explain why he quit Claude Code - DEV Community](https://dev.to/urvvil/i-tried-pi-after-watching-its-founder-explain-why-he-quit-claude-code-2oef)`;export{e as default};