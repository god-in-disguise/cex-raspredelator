import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'mexc_api_credentials';
const ENCRYPTION_KEY = 'mexc-withdrawal-app-key-2024'; // In production, this should be environment variable

export interface ApiCredentials {
  apiKey: string;
  apiSecret: string;
}

export class CredentialStorage {
  static save(credentials: ApiCredentials): void {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(credentials),
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Failed to save credentials:', error);
      throw new Error('Failed to save API credentials');
    }
  }

  static load(): ApiCredentials | null {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return null;
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Failed to load credentials:', error);
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static hasCredentials(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
} 