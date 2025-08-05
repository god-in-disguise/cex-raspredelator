import { CredentialStorage } from './storage';

export interface BalanceResponse {
  balance: number;
}

export interface FeeResponse {
  fee: number;
}

export interface WithdrawalRequest {
  coin: string;
  amount: number;
  address: string;
  network?: string;
}

export interface WithdrawalResponse {
  withdrawal_id: string;
  total_amount: number;
  fee: number;
  amount_to_receive: number;
  status: string;
}

export interface WithdrawalStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details: Record<string, unknown>;
}

export interface DepositAddressResponse {
  address: string;
  tag?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthHeaders(): Record<string, string> {
  const credentials = CredentialStorage.load();
  if (!credentials) {
    throw new ApiError('No API credentials found. Please configure your MEXC API keys.', 401);
  }
  
  return {
    'x-api-key': credentials.apiKey,
    'x-api-secret': credentials.apiSecret,
  };
}

async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new ApiError(error.detail || error.message || 'Request failed', response.status);
  }

  return response.json();
}

export async function getBalance(coin: string): Promise<BalanceResponse> {
  return makeRequest<BalanceResponse>(`/balance/${coin}`);
}

export async function getWithdrawalFee(coin: string, network?: string): Promise<FeeResponse> {
  const params = new URLSearchParams();
  if (network) params.append('network', network);
  const query = params.toString() ? `?${params.toString()}` : '';
  
  return makeRequest<FeeResponse>(`/withdrawal-fee/${coin}${query}`);
}

export async function withdrawCrypto(request: WithdrawalRequest): Promise<WithdrawalResponse> {
  return makeRequest<WithdrawalResponse>('/withdraw', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getWithdrawalStatus(withdrawalId: string): Promise<WithdrawalStatusResponse> {
  return makeRequest<WithdrawalStatusResponse>(`/withdrawal-status/${withdrawalId}`);
}

export async function getDepositAddress(coin: string, network?: string): Promise<DepositAddressResponse> {
  const params = new URLSearchParams();
  if (network) params.append('network', network);
  const query = params.toString() ? `?${params.toString()}` : '';
  
  return makeRequest<DepositAddressResponse>(`/deposit-address/${coin}${query}`);
}

export async function testApiKeys(apiKey: string, apiSecret: string): Promise<{ valid: boolean; error?: string }> {
  const response = await fetch('/api/test-credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ apiKey, apiSecret }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ valid: false, error: 'Request failed' }));
    return error;
  }

  return response.json();
} 