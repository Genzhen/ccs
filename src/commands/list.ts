// List command - list all providers and models

import { loadProviders, loadSecrets, loadCurrent, initConfig } from '../config/manager.js';
import { hasApiKey } from '../providers/registry.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export function listCommand(): void {
  initConfig();

  const providers = loadProviders();
  const current = loadCurrent();

  logger.title('Available Providers');

  for (const [providerId, config] of Object.entries(providers)) {
    const hasKey = hasApiKey(providerId);
    const isCurrent = providerId === current.provider;

    // Provider header
    const status = hasKey ? chalk.green('✓') : chalk.dim('○');
    const currentMarker = isCurrent ? chalk.yellow(' (current)') : '';
    console.log(`${status} ${chalk.bold(config.name)} ${chalk.dim(`(${providerId})`)}${currentMarker}`);

    // Models
    for (const [modelId, modelConfig] of Object.entries(config.models)) {
      const defaultMarker = modelConfig.default ? chalk.dim(' [default]') : '';
      const currentModelMarker = isCurrent && modelId === current.model ? chalk.yellow(' ←') : '';
      console.log(`    ${chalk.dim('•')} ${modelConfig.name} ${chalk.dim(`(${modelId})`)}${defaultMarker}${currentModelMarker}`);
    }

    console.log();
  }

  logger.separator();
  logger.info('Usage: ccs <provider> [model]');
  logger.info('Example: ccs zhipu glm-5-turbo');
}