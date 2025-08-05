'use client';

import { useState } from 'react';
import { withdrawCrypto } from '@/lib/api';
import { WithdrawalRow } from '@/components/withdrawal-interface';

export function useWithdrawal() {
  const [loading, setLoading] = useState(false);

  const startWithdrawal = async (
    withdrawalRows: WithdrawalRow[],
    coin: string,
    network?: string
  ): Promise<WithdrawalRow[]> => {
    setLoading(true);
    const updatedRows = [...withdrawalRows];

    try {
      // Process withdrawals sequentially to avoid rate limiting
      for (let i = 0; i < updatedRows.length; i++) {
        const row = updatedRows[i];
        
        try {
          // Set status to pending
          updatedRows[i] = { ...row, status: 'pending' as const };
          
          // Execute withdrawal
          const response = await withdrawCrypto({
            coin,
            amount: row.amount,
            address: row.address,
            network
          });
          
          // Update with success
          updatedRows[i] = {
            ...row,
            status: 'processing' as const,
            withdrawalId: response.withdrawal_id
          };
          
          // Small delay between withdrawals to respect rate limits
          if (i < updatedRows.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Withdrawal failed for address ${row.address}:`, error);
          updatedRows[i] = {
            ...row,
            status: 'failed' as const
          };
        }
      }
    } finally {
      setLoading(false);
    }

    return updatedRows;
  };

  return {
    loading,
    startWithdrawal
  };
} 