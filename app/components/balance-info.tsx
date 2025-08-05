'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wallet, Receipt } from 'lucide-react';

interface BalanceInfoProps {
  coin: string;
  balance?: number;
  fee?: number;
  loading: boolean;
  error?: string;
  onRefresh: () => void;
}

export function BalanceInfo({ 
  coin, 
  balance, 
  fee, 
  loading, 
  error, 
  onRefresh 
}: BalanceInfoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Wallet Info
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-red-600 text-sm">
            <p>Error loading data</p>
            <p className="text-xs opacity-75">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Available Balance</div>
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    `${balance?.toFixed(6) || '0.000000'} ${coin}`
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-xs text-gray-500">Withdrawal Fee</div>
                <div className="text-sm font-semibold">
                  {loading ? (
                    <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    `${fee?.toFixed(6) || '0.000000'} ${coin}`
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 