// Init command - initialize CCS configuration

import inquirer from 'inquirer';
import { initConfig, setApiKey, loadSecrets } from '../config/manager.js';
import { getAvailableProviders, hasApiKey } from '../providers/registry.js';
import { logger } from '../utils/logger.js';

export async function initCommand(): Promise<void> {
  logger.title('CCS Configuration');

  // Initialize config files
  initConfig();

  const providers = getAvailableProviders();
  const secrets = loadSecrets();

  logger.info('Configuration directory created');
  logger.info('Please enter API keys for the providers you want to use:');
  logger.separator();

  for (const [providerId, config] of Object.entries(providers)) {
    const existingKey = secrets[providerId];

    const { setKey } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setKey',
        message: `Set API key for ${config.name}?`,
        default: !existingKey
      }
    ]);

    if (setKey) {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter API key for ${config.name}:`,
          mask: '*',
          validate: (input: string) => input.length > 0 || 'API key cannot be empty'
        }
      ]);

      setApiKey(providerId, apiKey);
      logger.success(`API key saved for ${config.name}`);
    } else if (existingKey) {
      logger.info(`Using existing API key for ${config.name}`);
    }
  }

  logger.separator();
  logger.success('CCS initialization complete!');
  logger.info('Run "ccs list" to see available providers');
  logger.info('Run "ccs <provider>" to switch to a provider');
}