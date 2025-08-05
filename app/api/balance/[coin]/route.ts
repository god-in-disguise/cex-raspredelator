import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';
import { CredentialStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { coin: string } }
) {
  try {
    // Get API credentials from headers (sent from client)
    const apiKey = request.headers.get('x-api-key');
    const apiSecret = request.headers.get('x-api-secret');

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { detail: 'API credentials required' },
        { status: 401 }
      );
    }

    const mexcClient = new MEXCClient(apiKey, apiSecret);
    const balance = await mexcClient.getBalance(params.coin);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Failed to fetch balance' },
      { status: 400 }
    );
  }
} 