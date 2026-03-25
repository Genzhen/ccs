// Terminal logging utilities

import chalk from 'chalk';

export const logger = {
  // Success message (green checkmark)
  success: (message: string): void => {
    console.log(chalk.green('✓'), message);
  },

  // Error message (red x)
  error: (message: string): void => {
    console.error(chalk.red('✗'), message);
  },

  // Warning message (yellow)
  warning: (message: string): void => {
    console.log(chalk.yellow('⚠'), message);
  },

  // Info message (blue)
  info: (message: string): void => {
    console.log(chalk.blue('ℹ'), message);
  },

  // Plain message
  log: (message: string): void => {
    console.log(message);
  },

  // Debug message (gray, only if DEBUG env is set)
  debug: (message: string): void => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('[debug]'), message);
    }
  },

  // Print a header/title
  title: (message: string): void => {
    console.log();
    console.log(chalk.bold(chalk.cyan(message)));
    console.log();
  },

  // Print a list item
  item: (key: string, value: string, indent: number = 2): void => {
    const spaces = ' '.repeat(indent);
    console.log(`${spaces}${chalk.dim(key)}: ${value}`);
  },

  // Print a separator line
  separator: (): void => {
    console.log(chalk.dim('─'.repeat(50)));
  }
};

// Format provider/model for display
export function formatProviderModel(provider: string, model: string, providerName?: string): string {
  const name = providerName || provider;
  return `${chalk.cyan(name)} ${chalk.dim('/')} ${chalk.white(model)}`;
}