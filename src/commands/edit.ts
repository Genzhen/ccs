// Edit command - open config file for editing

import { execSync } from 'child_process';
import { getProvidersPath, getConfigDir } from '../utils/platform.js';
import { logger } from '../utils/logger.js';
import open from 'open';

export async function editCommand(): Promise<void> {
  const providersPath = getProvidersPath();
  const configDir = getConfigDir();

  logger.info(`Config directory: ${configDir}`);
  logger.info(`Providers file: ${providersPath}`);

  // Try to open with default editor
  try {
    await open(providersPath);
    logger.success('Opened providers.json in default editor');
  } catch {
    // Fallback: show instructions
    logger.info('Could not open editor automatically');
    logger.info(`Please edit: ${providersPath}`);
  }
}