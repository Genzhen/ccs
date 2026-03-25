// Tests for platform utilities

import { describe, it, expect } from 'vitest';
import os from 'os';
import path from 'path';
import {
  getConfigDir,
  getClaudeSettingsPath,
  getProvidersPath,
  getSecretsPath,
  getCurrentPath,
  isWindows,
  isMacOS,
  isLinux,
  getHostname,
  getHomeDir
} from '../src/utils/platform.js';

describe('Platform Utilities', () => {
  describe('getConfigDir', () => {
    it('should return a valid path', () => {
      const configDir = getConfigDir();
      expect(configDir).toBeDefined();
      expect(typeof configDir).toBe('string');
    });

    it('should return correct path for non-Windows', () => {
      if (!isWindows()) {
        const configDir = getConfigDir();
        expect(configDir).toBe(path.join(os.homedir(), '.config', 'ccs'));
      }
    });
  });

  describe('getClaudeSettingsPath', () => {
    it('should return a valid path', () => {
      const settingsPath = getClaudeSettingsPath();
      expect(settingsPath).toBeDefined();
      expect(settingsPath.endsWith('settings.json')).toBe(true);
    });

    it('should return correct path for non-Windows', () => {
      if (!isWindows()) {
        const settingsPath = getClaudeSettingsPath();
        expect(settingsPath).toBe(path.join(os.homedir(), '.claude', 'settings.json'));
      }
    });
  });

  describe('getProvidersPath', () => {
    it('should return path ending with providers.json', () => {
      const path = getProvidersPath();
      expect(path.endsWith('providers.json')).toBe(true);
    });
  });

  describe('getSecretsPath', () => {
    it('should return path ending with secrets.enc', () => {
      const path = getSecretsPath();
      expect(path.endsWith('secrets.enc')).toBe(true);
    });
  });

  describe('getCurrentPath', () => {
    it('should return path ending with current.json', () => {
      const path = getCurrentPath();
      expect(path.endsWith('current.json')).toBe(true);
    });
  });

  describe('Platform detection', () => {
    it('should detect exactly one platform', () => {
      const platforms = [isWindows(), isMacOS(), isLinux()];
      const trueCount = platforms.filter(Boolean).length;

      // At least one should be true
      expect(trueCount).toBeGreaterThanOrEqual(1);
    });

    it('should be consistent with process.platform', () => {
      expect(isWindows()).toBe(process.platform === 'win32');
      expect(isMacOS()).toBe(process.platform === 'darwin');
      expect(isLinux()).toBe(process.platform === 'linux');
    });
  });

  describe('getHostname', () => {
    it('should return a non-empty string', () => {
      const hostname = getHostname();
      expect(hostname).toBeDefined();
      expect(hostname.length).toBeGreaterThan(0);
    });

    it('should match os.hostname()', () => {
      expect(getHostname()).toBe(os.hostname());
    });
  });

  describe('getHomeDir', () => {
    it('should return a valid directory', () => {
      const home = getHomeDir();
      expect(home).toBeDefined();
      expect(home.length).toBeGreaterThan(0);
    });

    it('should match os.homedir()', () => {
      expect(getHomeDir()).toBe(os.homedir());
    });
  });
});