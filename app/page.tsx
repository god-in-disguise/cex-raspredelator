'use client';

import { useState, useEffect } from 'react';
import { CredentialStorage, ApiCredentials } from '@/lib/storage';
import { ApiKeySetup } from '@/components/api-key-setup';
import { WithdrawalInterface } from '@/components/withdrawal-interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [hasCredentials, setHasCredentials] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if credentials exist in localStorage
    setHasCredentials(CredentialStorage.hasCredentials());
    setLoading(false);
  }, []);

  const handleCredentialsSet = (credentials: ApiCredentials) => {
    CredentialStorage.save(credentials);
    setHasCredentials(true);
  };

  const handleLogout = () => {
    CredentialStorage.clear();
    setHasCredentials(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              MEXC Withdrawal Tool
            </h1>
            <p className="text-lg text-gray-600">
              Secure cryptocurrency withdrawal management
            </p>
          </div>

          {!hasCredentials ? (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome! Set up your MEXC API credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApiKeySetup onCredentialsSet={handleCredentialsSet} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Withdrawal Dashboard
                  </h2>
                  <p className="text-gray-600">
                    Manage your cryptocurrency withdrawals
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Change API Keys
                </Button>
              </div>
              
              <WithdrawalInterface />
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 