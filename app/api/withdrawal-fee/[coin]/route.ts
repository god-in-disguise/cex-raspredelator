import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coin: string }> }
) {
  try {
    const { coin } = await params;
    
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
    const fee = await mexcClient.getWithdrawalFee(coin, network);

    return NextResponse.json({ fee });
  } catch (error) {
    console.error('Fee fetch error:', error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Failed to fetch withdrawal fee' },
      { status: 400 }
    );
  }
} 