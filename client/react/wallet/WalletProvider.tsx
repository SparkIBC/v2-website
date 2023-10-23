import type { SignerOptions } from '@cosmos-kit/core';
import { GasPrice } from 'cosmwasm';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { WalletProvider as WalletContextProvider } from './WalletContext';
import { SparkProvider } from 'client';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';

import { wallets as KeplrWallet } from '@cosmos-kit/keplr';
import { wallets as CosmostationWallet } from '@cosmos-kit/cosmostation';
import { wallets as LeapWallet } from '@cosmos-kit/leap';
import { wallets as XdefiWallet } from '@cosmos-kit/xdefi';
import { wallets as OmniWallet } from '@cosmos-kit/omni';

const signerOptions: SignerOptions = {
  signingStargate: ({ chain_name }): SigningStargateClientOptions | undefined => {
    let gasTokenName: string | undefined;
    switch (chain_name) {
      case 'juno':
        gasTokenName = 'ujuno';
        break;
      case 'osmosis':
        gasTokenName = 'uosmo';
        break;
      case 'stargaze':
        gasTokenName = 'ustars';
        break;
      case 'akash':
        gasTokenName = 'uakt';
        break;
      case 'cosmoshub':
        gasTokenName = 'uatom';
        break;
      case 'junotestnet':
        gasTokenName = 'ujunox';
        break;
    }
    // @ts-ignore messed up dependencies
    return gasTokenName ? { gasPrice: GasPrice.fromString(`0.0025${gasTokenName}`) } : undefined;
  }
};

export default function WalletProvider({ children }: { children: JSX.Element }) {
  return (
    <ChainProvider
      signerOptions={signerOptions}
      chains={chains}
      assetLists={assets}
      wallets={[...KeplrWallet, ...CosmostationWallet, ...LeapWallet, ...XdefiWallet, ...OmniWallet]}
    >
      <WalletContextProvider>
        <SparkProvider>{children}</SparkProvider>
      </WalletContextProvider>
    </ChainProvider>
  );
}
