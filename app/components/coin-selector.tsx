'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Common cryptocurrencies - in a real app, this would come from the API
const COMMON_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', networks: ['BTC'] },
  { symbol: 'ETH', name: 'Ethereum', networks: ['ETH', 'BSC', 'ARBITRUM'] },
  { symbol: 'SOL', name: 'Solana', networks: ['SOL'] },
  { symbol: 'USDT', name: 'Tether', networks: ['ETH', 'BSC', 'TRC20', 'SOL', 'ARBITRUM'] },
  { symbol: 'USDC', name: 'USD Coin', networks: ['ETH', 'BSC', 'SOL', 'ARBITRUM'] },
  { symbol: 'BNB', name: 'BNB', networks: ['BSC', 'ETH'] },
  { symbol: 'ADA', name: 'Cardano', networks: ['ADA'] },
  { symbol: 'DOT', name: 'Polkadot', networks: ['DOT'] },
  { symbol: 'MATIC', name: 'Polygon', networks: ['POLYGON', 'ETH', 'BSC'] },
  { symbol: 'AVAX', name: 'Avalanche', networks: ['AVAX', 'ETH'] },
];

interface CoinSelectorProps {
  selectedCoin: string;
  selectedNetwork: string;
  onCoinChange: (coin: string) => void;
  onNetworkChange: (network: string) => void;
}

export function CoinSelector({ 
  selectedCoin, 
  selectedNetwork, 
  onCoinChange, 
  onNetworkChange 
}: CoinSelectorProps) {
  const [customCoin, setCustomCoin] = useState('');
  const [customNetwork, setCustomNetwork] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const selectedCoinData = COMMON_COINS.find(coin => coin.symbol === selectedCoin);
  const availableNetworks = selectedCoinData?.networks || [];

  const handleCoinSelect = (coin: string) => {
    onCoinChange(coin);
    const coinData = COMMON_COINS.find(c => c.symbol === coin);
    if (coinData && coinData.networks.length > 0) {
      onNetworkChange(coinData.networks[0]);
    }
    setUseCustom(false);
  };

  const handleCustomSubmit = () => {
    if (customCoin && customNetwork) {
      onCoinChange(customCoin.toUpperCase());
      onNetworkChange(customNetwork.toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      {/* Common Coins */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Popular Cryptocurrencies</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {COMMON_COINS.map((coin) => (
            <Button
              key={coin.symbol}
              variant={selectedCoin === coin.symbol && !useCustom ? "default" : "outline"}
              size="sm"
              onClick={() => handleCoinSelect(coin.symbol)}
              className="h-auto p-3 flex flex-col items-center"
            >
              <span className="font-bold">{coin.symbol}</span>
              <span className="text-xs text-gray-500">{coin.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Network Selection */}
      {!useCustom && selectedCoinData && (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Network for {selectedCoin}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableNetworks.map((network) => (
              <Button
                key={network}
                variant={selectedNetwork === network ? "default" : "outline"}
                size="sm"
                onClick={() => onNetworkChange(network)}
              >
                {network}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Coin Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Custom Cryptocurrency</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUseCustom(!useCustom)}
          >
            {useCustom ? 'Use Popular' : 'Use Custom'}
          </Button>
        </div>

        {useCustom && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customCoin">Coin Symbol</Label>
              <input
                id="customCoin"
                type="text"
                placeholder="e.g., DOGE"
                value={customCoin}
                onChange={(e) => setCustomCoin(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customNetwork">Network</Label>
              <input
                id="customNetwork"
                type="text"
                placeholder="e.g., DOGE"
                value={customNetwork}
                onChange={(e) => setCustomNetwork(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                onClick={handleCustomSubmit}
                disabled={!customCoin || !customNetwork}
                className="w-full"
              >
                Apply Custom Settings
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Current Selection Display */}
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="text-sm">
          <span className="font-medium">Selected:</span>{' '}
          <span className="font-bold text-blue-600">{selectedCoin}</span>
          {selectedNetwork && (
            <>
              <span className="mx-2">on</span>
              <span className="font-bold text-green-600">{selectedNetwork}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 