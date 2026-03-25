// Hot reload utilities - send SIGHUP to Claude Code process

import { execSync } from 'child_process';
import { logger } from './logger.js';

// Find Claude Code process PID
export function findClaudePid(): number | null {
  try {
    // Find claude process (excluding grep)
    const output = execSync('pgrep -f "claude" | head -1', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();

    const pid = parseInt(output, 10);
    if (isNaN(pid) || pid <= 0) {
      return null;
    }

    return pid;
  } catch {
    return null;
  }
}

// Send SIGHUP signal to reload Claude Code
export function sendReloadSignal(pid: number): boolean {
  try {
    process.kill(pid, 'SIGHUP');
    return true;
  } catch (error) {
    logger.debug(`Failed to send SIGHUP: ${error}`);
    return false;
  }
}

// Reload command implementation
export function reloadCommand(): void {
  const pid = findClaudePid();

  if (!pid) {
    logger.warning('Claude Code is not running');
    logger.info('Settings will be applied on next startup');
    return;
  }

  const success = sendReloadSignal(pid);

  if (success) {
    logger.success(`Sent reload signal to Claude Code (PID: ${pid})`);
    logger.info('Session will continue with new settings');
  } else {
    logger.error('Failed to send reload signal');
    logger.info('Try running "/reload" in Claude Code manually');
  }
}