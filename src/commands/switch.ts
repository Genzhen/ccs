// Switch command - switch provider and/or model

import {
  loadCurrent,
  updateClaudeSettings,
  getApiKey,
  initConfig
} from '../config/manager.js';
import {
  providerExists,
  modelExists,
  getProviderDefaultModel,
  getProviderDisplayName,
  getModelDisplayName,
  hasApiKey
} from '../providers/registry.js';
import { logger, formatProviderModel } from '../utils/logger.js';
import { sendReloadSignal, findClaudePid } from '../utils/reload.js';

export async function switchCommand(provider?: string, model?: string): Promise<void> {
  initConfig();

  // If no arguments, show current selection
  if (!provider) {
    const current = loadCurrent();
    logger.info('Current selection:');
    logger.item('Provider', getProviderDisplayName(current.provider));
    logger.item('Model', getModelDisplayName(current.provider, current.model));
    return;
  }

  // Validate provider
  if (!providerExists(provider)) {
    logger.error(`Unknown provider: ${provider}`);
    logger.info('Run "ccs list" to see available providers');
    process.exit(1);
  }

  // Check if API key is set
  if (!hasApiKey(provider)) {
    logger.error(`No API key set for ${getProviderDisplayName(provider)}`);
    logger.info(`Run "ccs set-key ${provider}" to set the API key`);
    process.exit(1);
  }

  // Determine model
  if (!model) {
    const defaultModel = getProviderDefaultModel(provider);
    if (!defaultModel) {
      logger.error(`No models available for provider: ${provider}`);
      process.exit(1);
    }
    model = defaultModel;
  }

  // Validate model
  if (!modelExists(provider, model)) {
    logger.error(`Unknown model "${model}" for provider "${provider}"`);
    logger.info(`Run "ccs models ${provider}" to see available models`);
    process.exit(1);
  }

  // Update settings
  try {
    updateClaudeSettings(provider, model);
    logger.success(`Switched to: ${getProviderDisplayName(provider)} / ${model}`);

    // Try to send reload signal
    const pid = findClaudePid();
    if (pid) {
      const reloaded = sendReloadSignal(pid);
      if (reloaded) {
        logger.success(`Sent reload signal to Claude Code (PID: ${pid})`);
        logger.info('Session will continue with new settings');
      } else {
        logger.warning('Could not send reload signal');
        logger.info('Run "/reload" in Claude Code to apply changes');
      }
    } else {
      logger.info('Claude Code not running');
      logger.info('Settings will be applied on next startup');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to switch: ${message}`);
    process.exit(1);
  }
}

// Switch only model (keep current provider)
export async function switchModelCommand(model: string): Promise<void> {
  initConfig();

  const current = loadCurrent();

  if (!current.provider) {
    logger.error('No provider currently selected');
    logger.info('Run "ccs <provider>" to select a provider first');
    process.exit(1);
  }

  // Use the existing switch logic
  await switchCommand(current.provider, model);
}