// Provider registry - manages available providers and models

import { loadProviders, getApiKey } from '../config/manager.js';
import { defaultProviders, isValidProvider, getDefaultModel, getProviderName } from './defaults.js';
import type { ProviderConfig, ProviderId } from './defaults.js';

// Get all available providers
export function getAvailableProviders(): Record<string, ProviderConfig> {
  return loadProviders();
}

// Check if a provider has API key set
export function hasApiKey(provider: string): boolean {
  return getApiKey(provider) !== null;
}

// Get provider config
export function getProvider(provider: string): ProviderConfig | null {
  const providers = loadProviders();
  return providers[provider] || null;
}

// Check if a provider exists
export function providerExists(provider: string): boolean {
  const providers = loadProviders();
  return provider in providers;
}

// Check if a model exists for a provider
export function modelExists(provider: string, model: string): boolean {
  const providerConfig = getProvider(provider);
  if (!providerConfig) return false;
  return model in providerConfig.models;
}

// Get default model for a provider
export function getProviderDefaultModel(provider: string): string | null {
  const providerConfig = getProvider(provider);
  if (!providerConfig) return null;

  // Find default model
  for (const [modelId, config] of Object.entries(providerConfig.models)) {
    if (config.default) {
      return modelId;
    }
  }

  // Return first model if no default
  const models = Object.keys(providerConfig.models);
  return models.length > 0 ? models[0] : null;
}

// Get all models for a provider
export function getProviderModels(provider: string): string[] {
  const providerConfig = getProvider(provider);
  if (!providerConfig) return [];
  return Object.keys(providerConfig.models);
}

// Get provider display name
export function getProviderDisplayName(provider: string): string {
  const providerConfig = getProvider(provider);
  return providerConfig?.name || provider;
}

// Get model display name
export function getModelDisplayName(provider: string, model: string): string {
  const providerConfig = getProvider(provider);
  if (!providerConfig) return model;
  return providerConfig.models[model]?.name || model;
}

// List all providers with their status
export interface ProviderStatus {
  id: string;
  name: string;
  hasApiKey: boolean;
  modelCount: number;
  defaultModel: string | null;
}

export function listProvidersWithStatus(): ProviderStatus[] {
  const providers = loadProviders();
  const result: ProviderStatus[] = [];

  for (const [id, config] of Object.entries(providers)) {
    result.push({
      id,
      name: config.name,
      hasApiKey: hasApiKey(id),
      modelCount: Object.keys(config.models).length,
      defaultModel: getProviderDefaultModel(id)
    });
  }

  return result;
}