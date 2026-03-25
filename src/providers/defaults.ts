// Default provider configurations
// Users can customize by editing ~/.config/ccs/providers.json

export interface ModelConfig {
  name: string;
  default?: boolean;
}

export interface ProviderConfig {
  name: string;
  base_url: string;
  models: Record<string, ModelConfig>;
  note?: string;
}

export type ProviderId = 'aliyun' | 'zhipu' | 'volc' | 'deepseek' | 'moonshot' | 'minimax' | 'anthropic';

export const defaultProviders: Record<ProviderId, ProviderConfig> = {
  aliyun: {
    name: '阿里百炼',
    base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: {
      'qwen-turbo': { name: 'Qwen Turbo', default: true },
      'qwen-plus': { name: 'Qwen Plus' },
      'qwen-max': { name: 'Qwen Max' },
      'qwen-long': { name: 'Qwen Long' },
      'deepseek-v3': { name: 'DeepSeek V3' },
      'deepseek-r1': { name: 'DeepSeek R1' }
    }
  },
  zhipu: {
    name: '智谱 GLM',
    base_url: 'https://open.bigmodel.cn/api/paas/v4',
    models: {
      'glm-4-flash': { name: 'GLM-4 Flash', default: true },
      'glm-4': { name: 'GLM-4' },
      'glm-4-plus': { name: 'GLM-4 Plus' },
      'glm-4-air': { name: 'GLM-4 Air' },
      'glm-4-airx': { name: 'GLM-4 AirX' },
      'glm-4-long': { name: 'GLM-4 Long' },
      'glm-4.5': { name: 'GLM-4.5' },
      'glm-4.6': { name: 'GLM-4.6' },
      'glm-4.7': { name: 'GLM-4.7' },
      'glm-5': { name: 'GLM-5' },
      'glm-5-turbo': { name: 'GLM-5 Turbo' }
    }
  },
  volc: {
    name: '火山引擎豆包',
    base_url: 'https://ark.cn-beijing.volces.com/api/v3',
    models: {
      'doubao-pro-32k': { name: 'Doubao Pro 32K', default: true },
      'doubao-pro-128k': { name: 'Doubao Pro 128K' },
      'doubao-lite-32k': { name: 'Doubao Lite 32K' },
      'doubao-lite-128k': { name: 'Doubao Lite 128K' },
      'doubao-1.5-pro-32k': { name: 'Doubao 1.5 Pro 32K' },
      'doubao-1.5-pro-256k': { name: 'Doubao 1.5 Pro 256K' }
    },
    note: '需要替换 endpoint_id 到 base_url 或模型名'
  },
  deepseek: {
    name: 'DeepSeek',
    base_url: 'https://api.deepseek.com',
    models: {
      'deepseek-chat': { name: 'DeepSeek Chat', default: true },
      'deepseek-reasoner': { name: 'DeepSeek Reasoner (R1)' }
    }
  },
  moonshot: {
    name: 'Moonshot Kimi',
    base_url: 'https://api.moonshot.cn/v1',
    models: {
      'moonshot-v1-8k': { name: 'Kimi 8K', default: true },
      'moonshot-v1-32k': { name: 'Kimi 32K' },
      'moonshot-v1-128k': { name: 'Kimi 128K' }
    }
  },
  minimax: {
    name: 'MiniMax',
    base_url: 'https://api.minimax.chat/v1',
    models: {
      'abab6.5s-chat': { name: 'MiniMax 6.5s', default: true },
      'abab6.5-chat': { name: 'MiniMax 6.5' },
      'abab6.5g-chat': { name: 'MiniMax 6.5g' },
      'abab5.5-chat': { name: 'MiniMax 5.5' }
    }
  },
  anthropic: {
    name: 'Anthropic 官方',
    base_url: 'https://api.anthropic.com',
    models: {
      'claude-sonnet-4-6': { name: 'Claude Sonnet 4.6', default: true },
      'claude-opus-4-6': { name: 'Claude Opus 4.6' },
      'claude-haiku-4-5': { name: 'Claude Haiku 4.5' }
    }
  }
};

// Get default model for a provider
export function getDefaultModel(providerId: ProviderId): string | null {
  const provider = defaultProviders[providerId];
  if (!provider) return null;

  for (const [modelId, config] of Object.entries(provider.models)) {
    if (config.default) {
      return modelId;
    }
  }

  // Return first model if no default set
  const models = Object.keys(provider.models);
  return models.length > 0 ? models[0] : null;
}

// Get provider display name
export function getProviderName(providerId: ProviderId): string {
  return defaultProviders[providerId]?.name || providerId;
}

// Get model display name
export function getModelName(providerId: ProviderId, modelId: string): string {
  return defaultProviders[providerId]?.models[modelId]?.name || modelId;
}

// Check if provider exists
export function isValidProvider(providerId: string): providerId is ProviderId {
  return providerId in defaultProviders;
}

// Check if model exists for provider
export function isValidModel(providerId: ProviderId, modelId: string): boolean {
  const provider = defaultProviders[providerId];
  return provider ? modelId in provider.models : false;
}

// Get all provider IDs
export function getProviderIds(): ProviderId[] {
  return Object.keys(defaultProviders) as ProviderId[];
}

// Get all models for a provider
export function getModels(providerId: ProviderId): string[] {
  const provider = defaultProviders[providerId];
  return provider ? Object.keys(provider.models) : [];
}