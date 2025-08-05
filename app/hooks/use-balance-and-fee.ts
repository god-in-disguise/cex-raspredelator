'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBalance, getWithdrawalFee } from '@/lib/api';

export function useBalanceAndFee(coin: string, network?: string) {
  const [balance, setBalance] = useState<number | undefined>();
  const [fee, setFee] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const fetchBalance = useCallback(async () => {
    if (!coin) return;
    
    try {
      setLoading(true);
      setError(undefined);
      
      const [balanceResponse, feeResponse] = await Promise.all([
        getBalance(coin),
        getWithdrawalFee(coin, network)
      ]);
      
      setBalance(balanceResponse.balance);
      setFee(feeResponse.fee);
    } catch (err) {
      console.error('Error fetching balance and fee:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setBalance(undefined);
      setFee(undefined);
    } finally {
      setLoading(false);
    }
  }, [coin, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    fee,
    loading,
    error,
    fetchBalance
  };
} 