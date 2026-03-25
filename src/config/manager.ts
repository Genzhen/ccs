// Configuration manager for CCS

import fs from 'fs';
import path from 'path';
import {
  getConfigDir,
  getProvidersPath,
  getSecretsPath,
  getCurrentPath,
  getClaudeSettingsPath
} from '../utils/platform.js';
import { decryptObject, encryptObject } from './crypto.js';
import { defaultProviders, type ProviderId, type ProviderConfig } from '../providers/defaults.js';

// Types
export interface CurrentSelection {
  provider: ProviderId | string;
  model: string;
}

export interface CCSConfig {
  providers: Record<string, ProviderConfig>;
  current: CurrentSelection;
  secrets: Record<string, string>; // encrypted API keys
}

// Ensure config directory exists
export function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize configuration
export function initConfig(): void {
  ensureConfigDir();

  // Create providers.json if not exists
  const providersPath = getProvidersPath();
  if (!fs.existsSync(providersPath)) {
    fs.writeFileSync(providersPath, JSON.stringify(defaultProviders, null, 2));
  }

  // Create current.json if not exists
  const currentPath = getCurrentPath();
  if (!fs.existsSync(currentPath)) {
    const defaultCurrent: CurrentSelection = {
      provider: 'aliyun',
      model: 'qwen-turbo'
    };
    fs.writeFileSync(currentPath, JSON.stringify(defaultCurrent, null, 2));
  }

  // Create secrets.enc if not exists
  const secretsPath = getSecretsPath();
  if (!fs.existsSync(secretsPath)) {
    const emptySecrets = encryptObject({});
    fs.writeFileSync(secretsPath, emptySecrets, { mode: 0o600 });
  }
}

// Load providers configuration
export function loadProviders(): Record<string, ProviderConfig> {
  const providersPath = getProvidersPath();

  if (fs.existsSync(providersPath)) {
    try {
      const content = fs.readFileSync(providersPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return defaultProviders;
    }
  }

  return defaultProviders;
}

// Save providers configuration
export function saveProviders(providers: Record<string, ProviderConfig>): void {
  ensureConfigDir();
  fs.writeFileSync(getProvidersPath(), JSON.stringify(providers, null, 2));
}

// Load current selection
export function loadCurrent(): CurrentSelection {
  const currentPath = getCurrentPath();

  if (fs.existsSync(currentPath)) {
    try {
      const content = fs.readFileSync(currentPath, 'utf8');
      return JSON.parse(content);
    } catch {
      // Return default
    }
  }

  return { provider: 'aliyun', model: 'qwen-turbo' };
}

// Save current selection
export function saveCurrent(current: CurrentSelection): void {
  ensureConfigDir();
  fs.writeFileSync(getCurrentPath(), JSON.stringify(current, null, 2));
}

// Load secrets (decrypted)
export function loadSecrets(): Record<string, string> {
  const secretsPath = getSecretsPath();

  if (fs.existsSync(secretsPath)) {
    try {
      const content = fs.readFileSync(secretsPath, 'utf8');
      return decryptObject(content);
    } catch {
      return {};
    }
  }

  return {};
}

// Save secrets (encrypted)
export function saveSecrets(secrets: Record<string, string>): void {
  ensureConfigDir();
  const encrypted = encryptObject(secrets);
  fs.writeFileSync(getSecretsPath(), encrypted, { mode: 0o600 });
}

// Get API key for a provider
export function getApiKey(provider: string): string | null {
  const secrets = loadSecrets();
  return secrets[provider] || null;
}

// Set API key for a provider
export function setApiKey(provider: string, apiKey: string): void {
  const secrets = loadSecrets();
  secrets[provider] = apiKey;
  saveSecrets(secrets);
}

// Claude Code settings operations
export interface ClaudeSettings {
  env?: {
    ANTHROPIC_AUTH_TOKEN?: string;
    ANTHROPIC_BASE_URL?: string;
    ANTHROPIC_MODEL?: string;
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
}

// Load Claude Code settings
export function loadClaudeSettings(): ClaudeSettings {
  const settingsPath = getClaudeSettingsPath();

  if (fs.existsSync(settingsPath)) {
    try {
      const content = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  return {};
}

// Save Claude Code settings
export function saveClaudeSettings(settings: ClaudeSettings): void {
  const settingsPath = getClaudeSettingsPath();
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

// Update Claude Code settings with provider configuration
export function updateClaudeSettings(provider: ProviderId | string, model: string): void {
  const providers = loadProviders();
  const providerConfig = providers[provider];

  if (!providerConfig) {
    throw new Error(`Provider not found: ${provider}`);
  }

  const apiKey = getApiKey(provider);
  if (!apiKey) {
    throw new Error(`API key not set for provider: ${provider}`);
  }

  const settings = loadClaudeSettings();

  // Update environment variables
  settings.env = settings.env || {};
  settings.env.ANTHROPIC_AUTH_TOKEN = apiKey;
  settings.env.ANTHROPIC_BASE_URL = providerConfig.base_url;
  settings.env.ANTHROPIC_MODEL = model;

  saveClaudeSettings(settings);

  // Update current selection
  saveCurrent({ provider, model });
}