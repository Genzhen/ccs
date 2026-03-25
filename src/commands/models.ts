// Models command - list models for a provider

import { initConfig, loadProviders } from '../config/manager.js';
import {
  providerExists,
  getProviderModels,
  getProviderDisplayName,
  getModelDisplayName,
  getProviderDefaultModel
} from '../providers/registry.js';
import type { ProviderConfig, ModelConfig } from '../providers/defaults.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export function modelsCommand(provider?: string): void {
  initConfig();

  if (!provider) {
    // Show models for all providers
    const allProviders = loadProviders();

    logger.title('Available Models');

    for (const [providerId, config] of Object.entries(allProviders) as [string, ProviderConfig][]) {
      console.log(chalk.bold(config.name));
      for (const [modelId, modelConfig] of Object.entries(config.models) as [string, ModelConfig][]) {
        const defaultMarker = modelConfig.default ? chalk.dim(' [default]') : '';
        console.log(`  ${modelConfig.name} ${chalk.dim(`(${modelId})`)}${defaultMarker}`);
      }
      console.log();
    }
    return;
  }

  // Validate provider
  if (!providerExists(provider)) {
    logger.error(`Unknown provider: ${provider}`);
    logger.info('Run "ccs list" to see available providers');
    process.exit(1);
  }

  const models = getProviderModels(provider);
  const defaultModel = getProviderDefaultModel(provider);
  const providerName = getProviderDisplayName(provider);

  logger.title(`Models for ${providerName}`);

  for (const modelId of models) {
    const modelName = getModelDisplayName(provider, modelId);
    const isDefault = modelId === defaultModel;
    const defaultMarker = isDefault ? chalk.green(' [default]') : '';
    console.log(`  ${modelName} ${chalk.dim(`(${modelId})`)}${defaultMarker}`);
  }

  console.log();
  logger.info(`Usage: ccs ${provider} <model>`);
}