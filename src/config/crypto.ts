// Encryption utilities for storing API keys securely

import crypto from 'crypto';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { getConfigDir } from '../utils/platform.js';

// Algorithm settings
const ALGORITHM = 'aes-256-cbc';
const SALT = 'ccs-encryption-salt-v1';
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

// Get or generate machine-specific key
function getMachineKey(): Buffer {
  const keyPath = path.join(getConfigDir(), '.key');

  // Try to read existing key
  if (fs.existsSync(keyPath)) {
    try {
      const keyData = fs.readFileSync(keyPath, 'utf8');
      return Buffer.from(keyData, 'hex');
    } catch {
      // Fall through to generate new key
    }
  }

  // Generate new key based on machine ID
  const machineId = getMachineId();
  const key = crypto.pbkdf2Sync(machineId, SALT, ITERATIONS, KEY_LENGTH, 'sha512');

  // Save key for future use
  try {
    fs.mkdirSync(getConfigDir(), { recursive: true });
    fs.writeFileSync(keyPath, key.toString('hex'), { mode: 0o600 });
  } catch {
    // If we can't save, just use in-memory key
  }

  return key;
}

// Generate a machine-specific identifier
function getMachineId(): string {
  const parts = [
    os.hostname(),
    os.platform(),
    os.arch(),
    os.cpus()[0]?.model || 'unknown',
    // Use MAC address or other unique identifiers
    Object.values(os.networkInterfaces())
      .flat()
      .filter((iface): iface is os.NetworkInterfaceInfo => iface !== undefined)
      .map(iface => iface.mac)
      .filter(mac => mac && mac !== '00:00:00:00:00:00')
      .sort()[0] || 'nomac'
  ];
  return parts.join('-');
}

// Encrypt a string
export function encrypt(plaintext: string): string {
  const key = getMachineKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Format: iv:encrypted
  return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt a string
export function decrypt(ciphertext: string): string {
  const key = getMachineKey();
  const parts = ciphertext.split(':');

  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Encrypt an object (secrets store)
export function encryptObject(obj: Record<string, string>): string {
  const json = JSON.stringify(obj);
  return encrypt(json);
}

// Decrypt an object (secrets store)
export function decryptObject(ciphertext: string): Record<string, string> {
  const json = decrypt(ciphertext);
  return JSON.parse(json);
}