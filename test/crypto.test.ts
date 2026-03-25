// Tests for crypto utilities

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock the platform module to use a test directory
const testConfigDir = path.join(os.tmpdir(), 'ccs-test-' + Date.now());

// We need to test the encrypt/decrypt functions directly
// Since they use getMachineKey which creates files, we'll test the core functionality

describe('Crypto Utilities', () => {
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testConfigDir)) {
      fs.mkdirSync(testConfigDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testConfigDir)) {
      fs.rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  it('should encrypt and decrypt a string correctly', async () => {
    // Dynamic import to use mocked platform
    const { encrypt, decrypt } = await import('../src/config/crypto.js');

    const plaintext = 'my-secret-api-key-12345';
    const encrypted = encrypt(plaintext);

    // Encrypted should be different from plaintext
    expect(encrypted).not.toBe(plaintext);

    // Should be able to decrypt back to original
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('should produce different ciphertext for same plaintext', async () => {
    const { encrypt } = await import('../src/config/crypto.js');

    const plaintext = 'same-key';
    const encrypted1 = encrypt(plaintext);
    const encrypted2 = encrypt(plaintext);

    // Due to random IV, same plaintext should produce different ciphertext
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should encrypt and decrypt objects correctly', async () => {
    const { encryptObject, decryptObject } = await import('../src/config/crypto.js');

    const obj = {
      aliyun: 'sk-aliyun-123',
      zhipu: 'sk-zhipu-456',
      deepseek: 'sk-deepseek-789'
    };

    const encrypted = encryptObject(obj);
    expect(typeof encrypted).toBe('string');

    const decrypted = decryptObject(encrypted);
    expect(decrypted).toEqual(obj);
  });

  it('should throw error for invalid encrypted data format', async () => {
    const { decrypt } = await import('../src/config/crypto.js');

    expect(() => decrypt('invalid-format')).toThrow();
  });

  it('should handle empty objects', async () => {
    const { encryptObject, decryptObject } = await import('../src/config/crypto.js');

    const obj = {};
    const encrypted = encryptObject(obj);
    const decrypted = decryptObject(encrypted);

    expect(decrypted).toEqual({});
  });
});