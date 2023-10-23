import { createContext, ReactNode, useState, useEffect } from 'react';
import { useChain } from '@cosmos-kit/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient } from '@cosmjs/stargate';
import { WalletData } from 'client/core/wallet';
import { RPC } from 'util/constants';

// Wallet context

// The wallet context provides wallet information (name, address) and signing clients to the app,
// to sign transactions and communicate directly with Stargate or CosmWasm contracts.

// OfflineSigner allows the signing of simple wallet transactions like the transfer of funds.
// SigningCosmWasmClient allows execution of CosmWasm contracts like when minting an NFT.
// SigningStargateClient allows communication with the Cosmos SDK (used when emitting cosmos messages like delegation or voting).

export interface WalletContext {
  connect: () => void;
  disconnect: () => void;
  refreshBalance: () => void;
  signingCosmWasmClient?: SigningCosmWasmClient;
  signingStargateClient?: SigningStargateClient;
  wallet?: WalletData;
}

export const Wallet = createContext<WalletContext>({
  connect: () => {},
  disconnect: () => {},
  refreshBalance: () => {},
  signingCosmWasmClient: undefined,
  signingStargateClient: undefined,
  wallet: undefined
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Current wallet data
  const [wallet, setWallet] = useState<WalletData | undefined>(undefined);
  const [signingCosmWasmClient, setSigningCosmWasmClient] = useState<SigningCosmWasmClient | undefined>(undefined);
  const [signingStargateClient, setSigningStargateClient] = useState<SigningStargateClient | undefined>(undefined);

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  const {
    connect: connectWallet,
    disconnect: disconnectWallet,
    wallet: connectedWallet,
    address: walletAddress,
    getOfflineSignerAmino
  } = useChain(process.env.NEXT_PUBLIC_NETWORK!);

  const refreshBalance = () => {
    setRefreshCounter(refreshCounter + 1);
  };

  // Refresh the wallet's balance when the refresh counter is incremented
  useEffect(() => {
    async function effect() {
      if (connectedWallet && walletAddress && signingStargateClient) {
        const balance = await signingStargateClient.getBalance(walletAddress, process.env.NEXT_PUBLIC_DENOM!);

        // Set the wallet data
        setWallet({
          address: walletAddress,
          name: connectedWallet.name,
          balance
        });
      }
    }
    effect();
  }, [refreshCounter]);

  // When connectedWallet changes, we extract the info we need and save it to `wallet`.
  // If it's become `null`, we also set `wallet` to `null`.
  useEffect(() => {
    async function effect() {
      if (connectedWallet && walletAddress) {
        const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(RPC, getOfflineSignerAmino());
        const signingStargateClient = await SigningStargateClient.connectWithSigner(RPC, getOfflineSignerAmino());

        // Fetch the user's balance from the signing cosmwasm client
        const balance = await signingCosmWasmClient.getBalance(walletAddress, process.env.NEXT_PUBLIC_DENOM!);

        // Set the wallet data
        setWallet({
          address: walletAddress,
          name: connectedWallet.name,
          balance
        });

        // Get all other signers
        // They are state vars so that when they are updated SparkClient is also udpated
        setSigningCosmWasmClient(signingCosmWasmClient);
        setSigningStargateClient(signingStargateClient);
      } else {
        // No wallet = no data
        setWallet(undefined);
        setSigningCosmWasmClient(undefined);
        setSigningStargateClient(undefined);
      }
    }

    effect();
  }, [connectedWallet, walletAddress]);

  const connect = () => {
    connectWallet();
  };
  const disconnect = () => {
    disconnectWallet();
  };

  return (
    <Wallet.Provider
      value={{
        wallet,
        connect,
        disconnect,
        refreshBalance,
        signingCosmWasmClient,
        signingStargateClient
      }}
    >
      {children}
    </Wallet.Provider>
  );
};
