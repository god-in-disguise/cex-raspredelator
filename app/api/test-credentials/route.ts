import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, apiSecret } = body;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { valid: false, error: 'API key and secret are required' },
        { status: 400 }
      );
    }

    // Test the credentials by trying to fetch account info
    const mexcClient = new MEXCClient(apiKey, apiSecret);
    
    try {
      // Try different API calls to diagnose the issue
      console.log('Testing MEXC API credentials...');
      
      // First try to fetch account info (simpler call)
      try {
        const balance = await mexcClient.getBalance('USDT');
        return NextResponse.json({ 
          valid: true, 
          message: 'API credentials are valid',
          balance: balance 
        });
      } catch (balanceError) {
        console.error('Balance fetch error:', balanceError);
        
        // If balance fails, the error might give us more info
        const errorMessage = balanceError instanceof Error ? balanceError.message : String(balanceError);
        
        // Check for specific error patterns
        if (errorMessage.includes('Invalid API-key')) {
          return NextResponse.json({
            valid: false,
            error: 'Invalid API key. Please check your API key is correct.'
          });
        }
        
        if (errorMessage.includes('Invalid signature')) {
          return NextResponse.json({
            valid: false,
            error: 'Invalid API secret. Please check your secret key is correct.'
          });
        }
        
        if (errorMessage.includes('IP not allowed')) {
          return NextResponse.json({
            valid: false,
            error: 'IP address not allowed. Please check API key IP restrictions.'
          });
        }
        
        if (errorMessage.includes('permission')) {
          return NextResponse.json({
            valid: false,
            error: 'Insufficient permissions. Please enable Spot Trading and Wallet permissions for your API key.'
          });
        }
        
        // Return the detailed error for debugging
        return NextResponse.json({
          valid: false,
          error: `API Error: ${errorMessage}`,
          debugInfo: errorMessage
        });
      }
    } catch (error) {
      console.error('MEXC Client error:', error);
      return NextResponse.json({
        valid: false,
        error: 'Failed to connect to MEXC API',
        debugInfo: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    console.error('Credential test error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Failed to test credentials',
        debugInfo: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 