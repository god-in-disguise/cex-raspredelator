import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apiKey = request.headers.get('x-api-key');
    const apiSecret = request.headers.get('x-api-secret');

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { detail: 'API credentials required' },
        { status: 401 }
      );
    }

    const mexcClient = new MEXCClient(apiKey, apiSecret);
    const result = await mexcClient.fetchWithdrawalStatus(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Failed to fetch withdrawal status' },
      { status: 400 }
    );
  }
} 