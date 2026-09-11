# cy-pi-config

个人 pi coding agent 配置合集，根据个人需求更新，欢迎参考或直接使用。

A collection of personal configuration for the [pi coding agent](https://github.com/earendil-works/pi), updated as personal needs evolve. Feel free to use or fork.

## 安装 / Installation

```
将 .ts 文件复制到 ~/.pi/agent/extensions/，重启 pi 生效。
Copy .ts files to ~/.pi/agent/extensions/, then restart pi.

  cp extensions/status-footer.ts ~/.pi/agent/extensions/    # 单个扩展 / single
  cp -r extensions/subagent ~/.pi/agent/extensions/         # 含子目录 / with subdir
  cp -r skills/cross-session-msg ~/.pi/agent/skills/        # skill（可选）/ optional

  ⚠️ pi 扩展加载是 fail-fast：任一扩展语法错误会导致全部不加载。
     改动后建议完全重启（/reload 实测多次不生效）。
     Extension loading is fail-fast: one syntax error blocks all.
     A full restart is recommended (/reload has been unreliable).
```

## 内容清单 / Contents

```
cy-pi-config/
│
├─ extensions/ ────────────────── pi 扩展 · 17 extensions
│  │
│  ├─ 权限与安全 ──────────────── Permission & Safety
│  │  ├─ permission-gate.ts ───── 权限拦截：allow/ask/deny 三级
│  │  │                           + normal/yolo/plan 模式 + 受保护文件硬拦截
│  │  │                           Three-level gate, 3 modes, protected-file block
│  │  └─ pre-tool-auto-commit.ts  改写文件前自动 git checkpoint，方便回滚
│  │                              Auto git checkpoint before overwrite
│  │
│  ├─ 界面与状态 ──────────────── UI & Status
│  │  ├─ pi-header.ts ─────────── 像素 Pi logo + 版本/目录/模型/会话名信息栏
│  │  │                           （绿色系，配 dark-purple 主题）
│  │  │                           Pixel-art Pi logo header with info bar
│  │  ├─ status-footer.ts ─────── 底部状态栏：模型/目录/分支/时间/token/
│  │  │                           上下文/权限模式/缓存命中率
│  │  │                           Catppuccin footer with cache hit rate
│  │  ├─ api-speed.ts ─────────── 实时 API 速度（3s 滑动窗口 tok/s，
│  │  │                           结束显示平均速度 + 耗时）
│  │  │                           Live API speed monitor
│  │  └─ session-header.ts ────── session 名嵌入编辑器顶部边框（金色粗斜体）
│  │                              Session name in editor top border
│  │
│  ├─ 会话管理 ────────────────── Session
│  │  ├─ session-inject.ts ────── 把 session 路径/名称/模型注入 agent 上下文
│  │  │                           Inject session metadata into context
│  │  ├─ session-namer.ts ─────── 自动命名：YYMMDD <定名>，已有名不覆盖
│  │  │                           Auto naming, freeze once named
│  │  ├─ session-msg.ts ───────── /msg <短id> <消息> 跨 session 发消息，
│  │  │                           结果气泡渲染（Tab 补全 session）
│  │  │                           Cross-session messaging with completion
│  │  └─ session-end-auto-commit.ts  session 退出时自动 commit
│  │                                 Auto-commit on session end
│  │
│  ├─ 交互与输入 ──────────────── Interaction & Input
│  │  ├─ ask-user.ts ──────────── AI 弹选项列表让用户选择（SelectList +
│  │  │                           自定义输入兜底）
│  │  │                           Interactive user-choice dialog
│  │  ├─ stash.ts ─────────────── Ctrl+S 暂存/恢复输入框内容
│  │  │                           Ctrl+S stash / restore
│  │  ├─ tools.ts ─────────────── /tools 命令交互式开关工具
│  │  │                           Interactive tool toggling
│  │  └─ sound.ts ─────────────── 会话结束时播放系统提示音
│  │                              System sound on session end
│  │
│  ├─ 多 Agent ────────────────── Multi-Agent
│  │  ├─ subagent/ ────────────── 子代理：single/parallel/chain 三模式，
│  │  │                           spawn 独立 pi 进程获得隔离上下文
│  │  │                           Subagent delegation, isolated context
│  │  └─ roundtable.ts ─────────── /talk 点名对话 + /roundtable 圆桌（含分身 xN）
│  │                              + /debate 自由对辩
│  │                              Multi-agent talk / roundtable / debate
│  │
│  └─ 外部集成 ────────────────── Integration
│     └─ obsidian-auto-open.ts ── edit/write 后自动在 Obsidian 打开 .md
│                                 Auto-open edited files in Obsidian
│
├─ skills/ ────────────────────── pi skills
│  └─ cross-session-msg/ ──────── 跨 session 补问/交接/补记
│                                 （与 session-msg.ts 配套：skill=AI 主动调用）
│                                 Cross-session messaging skill for AI
│
└─ themes/ ────────────────────── pi themes
   └─ dark-purple.json ────────── 深紫主题：用户消息底 #535394、工具状态三色、
                                  紫色调强调色
                                  Dark purple theme

  安装主题 / Install theme:
    cp themes/dark-purple.json ~/.pi/agent/themes/
    然后在 pi 设置里切换为 dark-purple / switch to it in pi settings
```

## 依赖 / Dependencies

```
扩展使用 pi 官方 SDK 类型，请确保版本兼容。
Extensions use the pi official SDK types; ensure a compatible version.

  npm install -g @earendil-works/pi-coding-agent
```

## 许可证 / License

MIT
