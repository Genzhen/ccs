# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-03-25

### Added

- Initial release
- CLI commands:
  - `ccs init` - Initialize configuration
  - `ccs <provider> [model]` - Switch provider and model
  - `ccs model <model>` - Switch model only
  - `ccs set-key <provider> [api-key]` - Set API key
  - `ccs list` / `ccs ls` - List all providers and models
  - `ccs current` - Show current configuration
  - `ccs models [provider]` - List models for a provider
  - `ccs edit` - Open config file for editing
  - `ccs reload` - Send reload signal to Claude Code
- Supported providers:
  - 阿里百炼 (Aliyun) - Qwen series models
  - 智谱 GLM (Zhipu) - GLM-4/5 series models
  - 火山引擎豆包 (Volc) - Doubao series models
  - DeepSeek - Chat and Reasoner models
  - Moonshot Kimi - Kimi series models
  - MiniMax - abab series models
  - Anthropic - Claude series models
- Features:
  - Encrypted API key storage using AES-256-CBC
  - Cross-platform support (macOS, Linux, Windows)
  - Hot reload via SIGHUP signal
  - Dynamic provider commands (e.g., `ccs aliyun`, `ccs zhipu`)
  - Machine-specific encryption keys

### Security

- API keys are encrypted with AES-256-CBC before storage
- Encryption keys are derived from machine-specific identifiers
- Secrets file has restricted permissions (0600)

---

## Future Plans

- [ ] Auto-detect rate limit status
- [ ] Support for more providers via community contributions
- [ ] API for programmatic access
- [ ] VS Code extension integration
- [ ] Configuration sync across devices