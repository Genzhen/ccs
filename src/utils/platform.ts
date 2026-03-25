// Cross-platform utilities

import os from 'os';
import path from 'path';

// Get config directory path
export function getConfigDir(): string {
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || '', 'ccs');
  }
  return path.join(os.homedir(), '.config', 'ccs');
}

// Get Claude Code settings.json path
export function getClaudeSettingsPath(): string {
  if (process.platform === 'win32') {
    return path.join(process.env.USERPROFILE || '', '.claude', 'settings.json');
  }
  return path.join(os.homedir(), '.claude', 'settings.json');
}

// Get providers config path
export function getProvidersPath(): string {
  return path.join(getConfigDir(), 'providers.json');
}

// Get secrets config path (encrypted API keys)
export function getSecretsPath(): string {
  return path.join(getConfigDir(), 'secrets.enc');
}

// Get current selection config path
export function getCurrentPath(): string {
  return path.join(getConfigDir(), 'current.json');
}

// Check if we're on Windows
export function isWindows(): boolean {
  return process.platform === 'win32';
}

// Check if we're on macOS
export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

// Check if we're on Linux
export function isLinux(): boolean {
  return process.platform === 'linux';
}

// Get machine hostname
export function getHostname(): string {
  return os.hostname();
}

// Get home directory
export function getHomeDir(): string {
  return os.homedir();
}