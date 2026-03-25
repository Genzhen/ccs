// Tests for provider defaults and utilities

import { describe, it, expect } from 'vitest';
import {
  defaultProviders,
  getDefaultModel,
  getProviderName,
  getModelName,
  isValidProvider,
  isValidModel,
  getProviderIds,
  getModels
} from '../src/providers/defaults.js';

describe('Provider Defaults', () => {
  describe('defaultProviders', () => {
    it('should have all expected providers', () => {
      const expectedProviders = ['aliyun', 'zhipu', 'volc', 'deepseek', 'moonshot', 'minimax', 'anthropic'];

      for (const provider of expectedProviders) {
        expect(defaultProviders[provider]).toBeDefined();
      }
    });

    it('should have required fields for each provider', () => {
      for (const [id, config] of Object.entries(defaultProviders)) {
        expect(config.name).toBeDefined();
        expect(config.base_url).toBeDefined();
        expect(config.models).toBeDefined();
        expect(Object.keys(config.models).length).toBeGreaterThan(0);
      }
    });

    it('should have exactly one default model per provider', () => {
      for (const [id, config] of Object.entries(defaultProviders)) {
        const defaultModels = Object.entries(config.models)
          .filter(([, model]) => model.default);

        expect(defaultModels.length).toBe(1);
      }
    });
  });

  describe('getDefaultModel', () => {
    it('should return default model for valid provider', () => {
      expect(getDefaultModel('aliyun')).toBe('qwen-turbo');
      expect(getDefaultModel('zhipu')).toBe('glm-4-flash');
      expect(getDefaultModel('deepseek')).toBe('deepseek-chat');
    });

    it('should return null for invalid provider', () => {
      expect(getDefaultModel('invalid' as any)).toBeNull();
    });
  });

  describe('getProviderName', () => {
    it('should return display name for valid provider', () => {
      expect(getProviderName('aliyun')).toBe('阿里百炼');
      expect(getProviderName('zhipu')).toBe('智谱 GLM');
      expect(getProviderName('anthropic')).toBe('Anthropic 官方');
    });

    it('should return provider id for invalid provider', () => {
      expect(getProviderName('unknown' as any)).toBe('unknown');
    });
  });

  describe('getModelName', () => {
    it('should return display name for valid model', () => {
      expect(getModelName('aliyun', 'qwen-turbo')).toBe('Qwen Turbo');
      expect(getModelName('zhipu', 'glm-5')).toBe('GLM-5');
      expect(getModelName('deepseek', 'deepseek-reasoner')).toBe('DeepSeek Reasoner (R1)');
    });

    it('should return model id for invalid model', () => {
      expect(getModelName('aliyun', 'unknown-model')).toBe('unknown-model');
    });
  });

  describe('isValidProvider', () => {
    it('should return true for valid providers', () => {
      expect(isValidProvider('aliyun')).toBe(true);
      expect(isValidProvider('zhipu')).toBe(true);
      expect(isValidProvider('anthropic')).toBe(true);
    });

    it('should return false for invalid providers', () => {
      expect(isValidProvider('openai')).toBe(false);
      expect(isValidProvider('google')).toBe(false);
      expect(isValidProvider('')).toBe(false);
    });
  });

  describe('isValidModel', () => {
    it('should return true for valid model', () => {
      expect(isValidModel('aliyun', 'qwen-turbo')).toBe(true);
      expect(isValidModel('zhipu', 'glm-5')).toBe(true);
    });

    it('should return false for invalid model', () => {
      expect(isValidModel('aliyun', 'unknown-model')).toBe(false);
      expect(isValidModel('zhipu', 'gpt-4')).toBe(false);
    });

    it('should return false for invalid provider', () => {
      expect(isValidModel('unknown' as any, 'some-model')).toBe(false);
    });
  });

  describe('getProviderIds', () => {
    it('should return all provider IDs', () => {
      const ids = getProviderIds();

      expect(ids).toContain('aliyun');
      expect(ids).toContain('zhipu');
      expect(ids).toContain('deepseek');
      expect(ids).toContain('anthropic');
      expect(ids.length).toBe(7);
    });
  });

  describe('getModels', () => {
    it('should return all models for a provider', () => {
      const aliyunModels = getModels('aliyun');

      expect(aliyunModels).toContain('qwen-turbo');
      expect(aliyunModels).toContain('qwen-plus');
      expect(aliyunModels).toContain('qwen-max');
    });

    it('should return empty array for invalid provider', () => {
      const models = getModels('unknown' as any);
      expect(models).toEqual([]);
    });
  });
});