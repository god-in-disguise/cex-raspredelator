import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidEthereumAddress(address: string): boolean {
  // Basic ETH address validation (starts with 0x, 42 characters long, hex)
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

export function isValidBitcoinAddress(address: string): boolean {
  // Basic BTC address validation (starts with 1, 3, or bc1)
  const btcAddressRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
  return btcAddressRegex.test(address);
}

export function validateCryptoAddress(address: string, coin: string): { isValid: boolean; error?: string } {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Address is required' };
  }

  const trimmedAddress = address.trim();

  switch (coin.toUpperCase()) {
    case 'ETH':
    case 'USDT':
    case 'USDC':
    case 'MATIC':
      if (!isValidEthereumAddress(trimmedAddress)) {
        return { 
          isValid: false, 
          error: 'Invalid Ethereum address. Must start with 0x and be 42 characters long.' 
        };
      }
      break;
    case 'BTC':
      if (!isValidBitcoinAddress(trimmedAddress)) {
        return { 
          isValid: false, 
          error: 'Invalid Bitcoin address format.' 
        };
      }
      break;
    default:
      // For other coins, just check it's not empty and has reasonable length
      if (trimmedAddress.length < 20 || trimmedAddress.length > 100) {
        return { 
          isValid: false, 
          error: 'Address must be between 20 and 100 characters.' 
        };
      }
  }

  return { isValid: true };
} 