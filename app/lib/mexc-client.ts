import ccxt from 'ccxt';

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

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

export class MEXCClient {
  private exchange: ccxt.mexc;

  constructor(apiKey: string, apiSecret: string) {
    this.exchange = new ccxt.mexc({
      apiKey,
      secret: apiSecret,
      enableRateLimit: true,
    });
  }

  async getBalance(coin: string): Promise<number> {
    try {
      const balance = await this.exchange.fetchBalance();
      if (coin in balance) {
        return parseFloat(balance[coin].free || '0');
      }
      throw new Error(`Could not find balance for ${coin}`);
    } catch (error) {
      throw new Error(`Error fetching balance: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getWithdrawalFee(coin: string, network?: string): Promise<number> {
    try {
      const currencies = await this.exchange.fetchCurrencies();
      if (coin in currencies) {
        const coinData = currencies[coin];
        if (coinData.networks) {
          for (const [, networkInfo] of Object.entries(coinData.networks)) {
            if (!network || networkInfo.network === network) {
              return parseFloat(networkInfo.fee || '0');
            }
          }
        }
      }
      throw new Error(`Could not find fee information for ${coin}`);
    } catch (error) {
      throw new Error(`Error fetching withdrawal fee: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async withdrawCrypto(coin: string, amount: number, address: string, network?: string): Promise<ccxt.Transaction> {
    try {
      await this.exchange.loadMarkets();
      const params: Record<string, string> = {};
      if (network) {
        params.network = network;
      }

      const result = await this.exchange.withdraw(
        coin,
        amount,
        address,
        undefined,
        params
      );
      return result;
    } catch (error) {
      throw new Error(`Withdrawal failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private mapCcxtStatus(ccxtStatus: string): WithdrawalStatus {
    const statusMapping: Record<string, WithdrawalStatus> = {
      'pending': 'processing',
      'ok': 'completed',
      'canceled': 'failed',
      'failed': 'failed',
    };
    return statusMapping[ccxtStatus.toLowerCase()] || 'processing';
  }

  async fetchWithdrawalStatus(withdrawalId: string): Promise<{ status: WithdrawalStatus; details: ccxt.Transaction }> {
    try {
      const withdrawals = await this.exchange.fetchWithdrawals();
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      
      if (!withdrawal) {
        throw new Error('Withdrawal not found');
      }

      return {
        status: this.mapCcxtStatus(withdrawal.status),
        details: withdrawal
      };
    } catch (error) {
      throw new Error(`Error fetching withdrawal status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getDepositAddress(coin: string, network?: string): Promise<{ address: string; tag?: string }> {
    try {
      const depositAddress = await this.exchange.fetchDepositAddress(coin, {
        network: network
      });
      
      return {
        address: depositAddress.address,
        tag: depositAddress.tag
      };
    } catch (error) {
      throw new Error(`Error fetching deposit address: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 