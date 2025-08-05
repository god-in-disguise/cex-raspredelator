import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const apiSecret = request.headers.get('x-api-secret');

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { detail: 'API credentials required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { coin, amount, address, network } = body;

    if (!coin || !amount || !address) {
      return NextResponse.json(
        { detail: 'Missing required fields: coin, amount, address' },
        { status: 400 }
      );
    }

    const mexcClient = new MEXCClient(apiKey, apiSecret);

    // Get withdrawal fee
    const fee = await mexcClient.getWithdrawalFee(coin, network);
    const totalAmount = amount + fee;

    // Check balance
    const balance = await mexcClient.getBalance(coin);
    if (balance < totalAmount) {
      return NextResponse.json(
        {
          detail: `Insufficient balance. Need ${totalAmount} ${coin} but only have ${balance} ${coin}`
        },
        { status: 400 }
      );
    }

    // Execute withdrawal
    const withdrawal = await mexcClient.withdrawCrypto(
      coin,
      totalAmount,
      address,
      network
    );

    return NextResponse.json({
      withdrawal_id: withdrawal.id,
      total_amount: totalAmount,
      fee,
      amount_to_receive: amount,
      status: 'initiated'
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Withdrawal failed' },
      { status: 400 }
    );
  }
} 