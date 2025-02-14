'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ethers } from 'ethers';
import { GameToken } from '@/contracts/GameToken.json';

export default function PremiumFeatures() {
  const { account, isConnectedToCore } = useWallet();
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');

  const checkTokenBalance = async () => {
    if (!account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || '',
        GameToken.abi,
        provider
      );

      const balance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error checking token balance:', error);
    }
  };

  const stakeTokens = async (amount: string) => {
    if (!account) return;
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || '',
        GameToken.abi,
        signer
      );

      const tx = await tokenContract.stake(ethers.utils.parseEther(amount));
      await tx.wait();
      await checkTokenBalance();
    } catch (error) {
      console.error('Error staking tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account || !isConnectedToCore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Connect Wallet to Access Premium Features</h1>
          <p className="mb-4 text-gray-600">
            You need to connect your wallet and switch to Core Network to access premium features.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Premium Features</h1>

        <div className="space-y-6">
          <div className="rounded-lg bg-gray-100 p-4">
            <h2 className="mb-2 text-lg font-semibold">Your Token Balance</h2>
            <p className="text-3xl font-bold">{tokenBalance} SCT</p>
            <Button onClick={() => checkTokenBalance()} variant="outline" className="mt-2">
              Refresh Balance
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Stake Tokens for Premium Access</h2>
            <p className="text-gray-600">Stake 100 SCT tokens to unlock premium features:</p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Exclusive dialogue options</li>
              <li>Special character interactions</li>
              <li>Unique story paths</li>
              <li>Premium NFT minting</li>
            </ul>
            <Button onClick={() => stakeTokens('100')} disabled={loading} className="w-full">
              {loading ? 'Staking...' : 'Stake 100 SCT'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
