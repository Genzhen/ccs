// Current command - show current selection

import { loadCurrent, initConfig } from '../config/manager.js';
import { getProviderDisplayName, getModelDisplayName, hasApiKey } from '../providers/registry.js';
import { logger, formatProviderModel } from '../utils/logger.js';
import chalk from 'chalk';

export function currentCommand(): void {
  initConfig();

  const current = loadCurrent();

  logger.title('Current Configuration');

  if (!current.provider) {
    logger.warning('No provider selected');
    logger.info('Run "ccs <provider>" to select a provider');
    return;
  }

  const providerName = getProviderDisplayName(current.provider);
  const modelName = getModelDisplayName(current.provider, current.model);
  const keyStatus = hasApiKey(current.provider)
    ? chalk.green('✓ API key set')
    : chalk.red('✗ No API key');

  logger.item('Provider', `${providerName} ${chalk.dim(`(${current.provider})`)}`);
  logger.item('Model', `${modelName} ${chalk.dim(`(${current.model})`)}`);
  logger.item('Status', keyStatus);

  console.log();
}