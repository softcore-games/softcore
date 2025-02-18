'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

interface NFTMinterProps {
  imageUrl: string;
  metadata: {
    name: string;
    description: string;
  };
}

const injected = new InjectedConnector({
  supportedChainIds: [1116], // Core DAO Chain ID
});

export function NFTMinter({ imageUrl, metadata }: NFTMinterProps) {
  const { toast } = useToast();
  const { activate, active, library } = useWeb3React();
  const [isMinting, setIsMinting] = useState(false);

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  };

  const mintNFT = async () => {
    if (!active || !library) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);
    try {
      // Check stamina first
      const staminaResponse = await fetch('/api/user/stamina', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'NFT_MINT',
        }),
      });

      if (!staminaResponse.ok) {
        const error = await staminaResponse.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to check stamina',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          metadata,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success',
          description: 'NFT minted successfully',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to mint NFT',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while minting the NFT',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!active ? (
        <Button
          onClick={connectWallet}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      ) : (
        <Button
          onClick={mintNFT}
          disabled={isMinting}
          className="w-full bg-gradient-to-r from-green-500 to-green-600"
        >
          {isMinting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Mint as NFT
            </>
          )}
        </Button>
      )}
    </div>
  );
}