# CCS - Claude Code Switcher

一个极简风格的 CLI 工具，用于在 Claude Code 中即时切换 AI 提供商和模型。

## 功能特点

- **快速切换**: 一条命令即可切换提供商和模型
- **多提供商支持**: 支持阿里百炼、智谱 GLM、DeepSeek、火山引擎等主流 AI 平台
- **安全存储**: API 密钥加密存储在本地
- **热加载**: 自动发送重载信号，无需重启 Claude Code
- **跨平台**: 支持 macOS、Linux、Windows

## 安装

```bash
# npm
npm install -g ccs

# 或使用 pnpm
pnpm add -g ccs

# 或使用 yarn
yarn global add ccs
```

## 快速开始

### 1. 初始化配置

```bash
ccs init
```

这将引导你设置各个平台的 API 密钥。

### 2. 切换提供商

```bash
# 切换到阿里百炼（使用默认模型）
ccs aliyun

# 切换到智谱 GLM 并指定模型
ccs zhipu glm-5

# 切换到 DeepSeek
ccs deepseek

# 仅切换模型（保持当前提供商）
ccs model qwen-max
```

### 3. 查看状态

```bash
# 列出所有提供商和模型
ccs list

# 查看当前配置
ccs current

# 查看特定提供商的模型列表
ccs models zhipu
```

## 支持的提供商

| 提供商 | 命令 | 默认模型 |
|--------|------|----------|
| 阿里百炼 | `ccs aliyun` | qwen-turbo |
| 智谱 GLM | `ccs zhipu` | glm-4-flash |
| 火山引擎豆包 | `ccs volc` | doubao-pro-32k |
| DeepSeek | `ccs deepseek` | deepseek-chat |
| Moonshot Kimi | `ccs moonshot` | moonshot-v1-8k |
| MiniMax | `ccs minimax` | abab6.5s-chat |
| Anthropic 官方 | `ccs anthropic` | claude-sonnet-4-6 |

## 命令参考

### `ccs init`

初始化 CCS 配置，交互式引导设置 API 密钥。

### `ccs <provider> [model]`

切换到指定提供商和模型。

```bash
ccs aliyun           # 切换到阿里百炼（默认模型）
ccs zhipu glm-5      # 切换到智谱 GLM 的 glm-5 模型
```

### `ccs model <model>`

仅切换模型，保持当前提供商不变。

```bash
ccs model qwen-max   # 切换到 qwen-max 模型
```

### `ccs set-key <provider> [api-key]`

设置提供商的 API 密钥。

```bash
ccs set-key zhipu              # 交互式输入
ccs set-key aliyun sk-xxx      # 直接设置
```

### `ccs list` / `ccs ls`

列出所有可用的提供商和模型。

### `ccs current`

显示当前的提供商和模型配置。

### `ccs models [provider]`

列出提供商的所有可用模型。

```bash
ccs models          # 当前提供商的模型
ccs models zhipu    # 智谱 GLM 的所有模型
```

### `ccs edit`

打开提供商配置文件进行编辑。

### `ccs reload`

发送重载信号到 Claude Code 进程。

## 配置文件

配置文件存储位置：

| 平台 | 配置目录 |
|------|----------|
| macOS/Linux | `~/.config/ccs/` |
| Windows | `%APPDATA%\ccs\` |

### 文件说明

- `providers.json` - 提供商和模型配置
- `current.json` - 当前选择的提供商和模型
- `secrets.enc` - 加密存储的 API 密钥
- `.key` - 本地加密密钥（请勿分享）

## 添加自定义提供商

编辑 `~/.config/ccs/providers.json`：

```json
{
  "my-provider": {
    "name": "我的提供商",
    "base_url": "https://api.example.com/v1",
    "models": {
      "model-1": { "name": "Model 1", "default": true },
      "model-2": { "name": "Model 2" }
    }
  }
}
```

## 热加载机制

CCS 支持自动重载 Claude Code 配置：

1. 切换提供商后，自动检测 Claude Code 进程
2. 发送 SIGHUP 信号触发重载
3. 如使用 Shell wrapper，会话自动继续

### Shell Wrapper（推荐）

创建 `~/bin/claude-wrapper.sh`：

```bash
#!/bin/bash
while claude "$@"; [ $? -eq 129 ]; do
  set -- -c
done
```

然后在终端中使用此脚本启动 Claude Code。

## 开发

```bash
# 克隆仓库
git clone https://github.com/anthropics/ccs.git
cd ccs

# 安装依赖
npm install

# 构建
npm run build

# 测试
npm test

# 开发模式（监听文件变化）
npm run dev
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关项目

- [Claude Code](https://github.com/anthropics/claude-code) - Anthropic 官方 CLI 工具