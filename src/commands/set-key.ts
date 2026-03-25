// Set-key command - set API key for a provider

import inquirer from 'inquirer';
import { setApiKey, loadSecrets, initConfig, loadProviders } from '../config/manager.js';
import { providerExists, getProviderDisplayName } from '../providers/registry.js';
import { logger } from '../utils/logger.js';

export async function setKeyCommand(providerArg?: string, apiKeyArg?: string): Promise<void> {
  initConfig();

  let provider = providerArg;

  // If provider not specified, show interactive prompt
  if (!provider) {
    const providers = loadProviders();
    const { selectedProvider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedProvider',
        message: 'Select provider to set API key:',
        choices: Object.keys(providers).map(p => ({
          name: `${providers[p].name}`,
          value: p
        }))
      }
    ]);
    provider = selectedProvider;
  }

  // Validate provider
  if (!provider || !providerExists(provider)) {
    logger.error(`Unknown provider: ${provider || 'undefined'}`);
    logger.info('Run "ccs list" to see available providers');
    process.exit(1);
  }

  let apiKey = apiKeyArg;

  // If API key not provided, prompt for it
  if (!apiKey) {
    const response = await inquirer.prompt<{ apiKey: string }>([
      {
        type: 'password',
        name: 'apiKey',
        message: `Enter API key for ${getProviderDisplayName(provider)}:`,
        mask: '*',
        validate: (input: string) => input.length > 0 || 'API key cannot be empty'
      }
    ]);
    apiKey = response.apiKey;
  }

  // Save the API key (apiKey is guaranteed to be defined here)
  if (apiKey) {
    setApiKey(provider, apiKey);
    logger.success(`API key saved for ${getProviderDisplayName(provider)}`);
  }
}