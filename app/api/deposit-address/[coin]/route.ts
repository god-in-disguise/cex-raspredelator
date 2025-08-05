import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { coin: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const apiSecret = request.headers.get('x-api-secret');

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { detail: 'API credentials required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || undefined;

    const mexcClient = new MEXCClient(apiKey, apiSecret);
    const result = await mexcClient.getDepositAddress(params.coin, network);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Deposit address fetch error:', error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Failed to fetch deposit address' },
      { status: 400 }
    );
  }
} 