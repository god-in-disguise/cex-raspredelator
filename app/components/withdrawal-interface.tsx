'use client';

import { useState } from 'react';
import { CoinSelector } from './coin-selector';
import { WithdrawalForm } from './withdrawal-form';
import { BalanceInfo } from './balance-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';
import { useBalanceAndFee } from '@/hooks/use-balance-and-fee';
import { useWithdrawal } from '@/hooks/use-withdrawal';

export interface WithdrawalRow {
  id: string;
  address: string;
  amount: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  withdrawalId?: string;
}

export function WithdrawalInterface() {
  const [coin, setCoin] = useState('SOL');
  const [network, setNetwork] = useState('SOL');
  const [addresses, setAddresses] = useState('');
  const [rows, setRows] = useState<WithdrawalRow[]>([]);

  const { balance, fee, loading: balanceLoading, error: balanceError, fetchBalance } = useBalanceAndFee(coin, network);
  const { loading: withdrawalLoading, startWithdrawal } = useWithdrawal();

  const handleAddressesChange = (value: string) => {
    setAddresses(value);
    const addressList = value
      .split('\n')
      .map((addr) => addr.trim())
      .filter(Boolean);
    
    setRows(
      addressList.map((address) => ({
        id: uuidv4(),
        address,
        amount: 0,
        status: undefined,
      }))
    );
  };

  const handleAmountChange = (id: string, amount: number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, amount } : row))
    );
  };

  const validWithdrawals = rows.filter((row) => row.amount > 0);
  const hasValidWithdrawals = validWithdrawals.length > 0;
  const totalAmount = validWithdrawals.reduce((sum, row) => sum + row.amount, 0);
  const isExceedingBalance = totalAmount > (balance || 0);
  const isValid = hasValidWithdrawals && !isExceedingBalance;

  const handleWithdraw = async () => {
    const updatedRows = await startWithdrawal(validWithdrawals, coin, network);
    setRows(updatedRows);
  };

  const handleClearAll = () => {
    setAddresses('');
    setRows([]);
  };

  return (
    <div className="space-y-6">
      {/* Balance and Coin Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Cryptocurrency</CardTitle>
          </CardHeader>
          <CardContent>
            <CoinSelector 
              selectedCoin={coin}
              selectedNetwork={network}
              onCoinChange={setCoin}
              onNetworkChange={setNetwork}
            />
          </CardContent>
        </Card>

        <BalanceInfo 
          coin={coin}
          balance={balance}
          fee={fee}
          loading={balanceLoading}
          error={balanceError}
          onRefresh={fetchBalance}
        />
      </div>

      {/* Address Input */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addresses">
              Enter withdrawal addresses (one per line)
            </Label>
            <textarea
              id="addresses"
              className="w-full min-h-32 p-3 border rounded-md resize-vertical"
              placeholder="Enter wallet addresses, one per line..."
              value={addresses}
              onChange={(e) => handleAddressesChange(e.target.value)}
            />
          </div>
          
          {rows.length > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{rows.length} addresses detected</span>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {rows.length > 0 && (
        <WithdrawalForm
          rows={rows}
          coin={coin}
          network={network}
          balance={balance || 0}
          fee={fee || 0}
          onAmountChange={handleAmountChange}
          onWithdraw={handleWithdraw}
          loading={withdrawalLoading}
          isValid={isValid}
          totalAmount={totalAmount}
          isExceedingBalance={isExceedingBalance}
        />
      )}
    </div>
  );
} 