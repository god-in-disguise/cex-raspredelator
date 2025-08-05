'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { testApiKeys } from '@/lib/api';
import { ApiCredentials } from '@/lib/storage';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const apiKeySchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
});

type ApiKeyForm = z.infer<typeof apiKeySchema>;

interface ApiKeySetupProps {
  onCredentialsSet: (credentials: ApiCredentials) => void;
}

export function ApiKeySetup({ onCredentialsSet }: ApiKeySetupProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
  });

  const watchedValues = watch();

  const handleTest = async () => {
    if (!watchedValues.apiKey || !watchedValues.apiSecret) return;
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await testApiKeys(watchedValues.apiKey, watchedValues.apiSecret);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  const onSubmit = async (data: ApiKeyForm) => {
    // Test before saving
    setTesting(true);
    try {
      const result = await testApiKeys(data.apiKey, data.apiSecret);
      if (result.valid) {
        onCredentialsSet(data);
      } else {
        setTestResult(result);
      }
    } catch (error) {
      setTestResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Configure MEXC API Credentials</h3>
        <p className="text-sm text-gray-600">
          Your API keys are stored securely in your browser and never leave your device.
        </p>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">How to get your MEXC API keys:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to your MEXC account settings</li>
            <li>Navigate to API Management</li>
            <li>Create a new API key with withdrawal permissions</li>
            <li>Copy your API Key and Secret Key</li>
          </ol>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="text"
            placeholder="Enter your MEXC API Key"
            {...register('apiKey')}
            className={errors.apiKey ? 'border-red-500' : ''}
          />
          {errors.apiKey && (
            <p className="text-sm text-red-600">{errors.apiKey.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiSecret">API Secret</Label>
          <Input
            id="apiSecret"
            type="password"
            placeholder="Enter your MEXC API Secret"
            {...register('apiSecret')}
            className={errors.apiSecret ? 'border-red-500' : ''}
          />
          {errors.apiSecret && (
            <p className="text-sm text-red-600">{errors.apiSecret.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleTest}
            disabled={testing || !watchedValues.apiKey || !watchedValues.apiSecret}
            className="flex-1"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || testing || (testResult && !testResult.valid)}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </Button>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
            testResult.valid 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {testResult.valid ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">
              {testResult.valid 
                ? 'API credentials are valid!' 
                : testResult.error || 'Invalid credentials'
              }
            </span>
          </div>
        )}
      </form>
    </div>
  );
} 