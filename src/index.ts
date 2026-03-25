#!/usr/bin/env node
// CCS - Claude Code Switcher
// Main CLI entry point

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { setKeyCommand } from './commands/set-key.js';
import { switchCommand, switchModelCommand } from './commands/switch.js';
import { listCommand } from './commands/list.js';
import { currentCommand } from './commands/current.js';
import { modelsCommand } from './commands/models.js';
import { editCommand } from './commands/edit.js';
import { reloadCommand } from './utils/reload.js';
import { getProviderIds } from './providers/defaults.js';

const program = new Command();

// Package version
const VERSION = '0.1.0';

program
  .name('ccs')
  .description('Claude Code Switcher - Quickly switch AI providers and models')
  .version(VERSION);

// Init command
program
  .command('init')
  .description('Initialize CCS configuration')
  .action(async () => {
    await initCommand();
  });

// Set-key command
program
  .command('set-key [provider] [apiKey]')
  .description('Set API key for a provider')
  .action(async (provider?: string, apiKey?: string) => {
    await setKeyCommand(provider, apiKey);
  });

// List command
program
  .command('list')
  .alias('ls')
  .description('List all available providers and models')
  .action(() => {
    listCommand();
  });

// Current command
program
  .command('current')
  .description('Show current provider and model selection')
  .action(() => {
    currentCommand();
  });

// Models command
program
  .command('models [provider]')
  .description('List models for a provider')
  .action((provider?: string) => {
    modelsCommand(provider);
  });

// Edit command
program
  .command('edit')
  .description('Open providers config file for editing')
  .action(async () => {
    await editCommand();
  });

// Reload command
program
  .command('reload')
  .description('Send reload signal to Claude Code')
  .action(() => {
    reloadCommand();
  });

// Model switch command
program
  .command('model <model>')
  .description('Switch model (keep current provider)')
  .action(async (model: string) => {
    await switchModelCommand(model);
  });

// Provider switch command (dynamic - allows "ccs aliyun", "ccs zhipu", etc.)
// This handles all provider names as direct commands
const providerIds = getProviderIds();

// Register each provider as a direct command
for (const providerId of providerIds) {
  program
    .command(`${providerId} [model]`)
    .description(`Switch to ${providerId} provider`)
    .action(async (model?: string) => {
      await switchCommand(providerId, model);
    });
}

// Default action - show help if no command provided
program.on('command:*', () => {
  console.error(chalk.red(`Unknown command: ${program.args.join(' ')}`));
  console.log('Run "ccs help" for available commands');
  process.exit(1);
});

// Parse arguments
program.parse();