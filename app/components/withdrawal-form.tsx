'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { WithdrawalRow } from './withdrawal-interface';

interface WithdrawalFormProps {
  rows: WithdrawalRow[];
  coin: string;
  network: string;
  balance: number;
  fee: number;
  onAmountChange: (id: string, amount: number) => void;
  onWithdraw: () => void;
  loading: boolean;
  isValid: boolean;
  totalAmount: number;
  isExceedingBalance: boolean;
}

const StatusIcon = ({ status }: { status?: WithdrawalRow['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'processing':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'pending':
      return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
    default:
      return null;
  }
};

export function WithdrawalForm({
  rows,
  coin,
  network, // eslint-disable-line @typescript-eslint/no-unused-vars
  balance,
  fee,
  onAmountChange,
  onWithdraw,
  loading,
  isValid,
  totalAmount,
  isExceedingBalance
}: WithdrawalFormProps) {
  const validWithdrawals = rows.filter(row => row.amount > 0);
  const totalFees = validWithdrawals.length * fee;
  const grandTotal = totalAmount + totalFees;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Withdrawals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address List */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
            <div className="col-span-6">Address</div>
            <div className="col-span-3">Amount ({coin})</div>
            <div className="col-span-2">Fee ({coin})</div>
            <div className="col-span-1">Status</div>
          </div>
          
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <div className={`text-sm font-mono break-all p-2 rounded ${
                  row.isValidAddress === false 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-gray-50'
                }`}>
                  {row.address.substring(0, 20)}...{row.address.substring(row.address.length - 10)}
                  {row.isValidAddress === false && (
                    <div className="text-xs mt-1 text-red-600">
                      ⚠ Invalid address format
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="0.000000"
                  step="0.000001"
                  min="0"
                  value={row.amount || ''}
                  onChange={(e) => onAmountChange(row.id, parseFloat(e.target.value) || 0)}
                  disabled={loading || !!row.status || row.isValidAddress === false}
                  className={`text-sm ${
                    row.isValidAddress === false ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-600">
                  {row.amount > 0 && row.isValidAddress !== false ? fee.toFixed(6) : '0.000000'}
                </div>
              </div>
              <div className="col-span-1">
                <StatusIcon status={row.status} />
                {row.isValidAddress === false && (
                  <div className="text-red-500 text-xs mt-1">❌</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Withdrawal Amount:</span>
            <span className="font-semibold">{totalAmount.toFixed(6)} {coin}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Fees ({validWithdrawals.length} × {fee.toFixed(6)}):</span>
            <span className="font-semibold">{totalFees.toFixed(6)} {coin}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Grand Total:</span>
            <span className={isExceedingBalance ? 'text-red-600' : 'text-green-600'}>
              {grandTotal.toFixed(6)} {coin}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Available Balance:</span>
            <span>{balance.toFixed(6)} {coin}</span>
          </div>
        </div>

        {/* Validation Messages */}
        {isExceedingBalance && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">
              Insufficient balance. You need {grandTotal.toFixed(6)} {coin} but only have {balance.toFixed(6)} {coin}.
            </span>
          </div>
        )}

        {validWithdrawals.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Enter withdrawal amounts for the addresses above to proceed.
            </span>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onWithdraw}
          disabled={!isValid || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Withdrawals...
            </>
          ) : (
            `Withdraw to ${validWithdrawals.length} Address${validWithdrawals.length !== 1 ? 'es' : ''}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 