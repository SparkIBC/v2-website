import { createContext, useCallback, useContext, useState } from 'react';
import { MultiChainMsg, RouteResponse, SkipRouter, SubmitTxResponse, TxStatusResponse } from '@skip-router/core';
import { coins, Token } from 'config/tokens';
import useWallet from '../wallet/useWallet';
import { fromBech32, toBech32 } from 'cosmwasm';

interface SwapContextType {
  findRoute: (token: Token, amount: number) => Promise<RouteResponse>;
  generateMsgs: (route: RouteResponse) => Promise<MultiChainMsg[]>;
  broadcastSwap: (chain: string, tx: string) => Promise<SubmitTxResponse>;
  fetchStatus: (chain: string, txHash: string) => Promise<TxStatusResponse>;
}

const router = new SkipRouter();

const SwapContext = createContext<SwapContextType | null>(null);

const SwapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet } = useWallet();

  const findRoute: SwapContextType['findRoute'] = useCallback(async (token, amount) => {
    const route = await router.route({
      amountIn: String(amount),
      sourceAssetChainID: token.chain,
      sourceAssetDenom: token.denom,
      destAssetChainID: 'migaloo-1',
      destAssetDenom: 'ibc/BC5C0BAFD19A5E4133FDA0F3E04AE1FBEE75A4A226554B2CBB021089FF2E1F8A',
      cumulativeAffiliateFeeBPS: '0'
    });

    return route;
  }, []);

  const generateMsgs: SwapContextType['generateMsgs'] = useCallback(
    async (route) => {
      if (!wallet) throw new Error('Wallet is not connected.');

      const address = wallet.address;
      const { data: unzippedAddress } = fromBech32(address);

      const msgs = await router.messages({
        ...route,
        addressList: route.chainIDs.map((chain) => {
          const prefix = coins.find((coin) => coin.chain === chain)?.prefix;
          if (!prefix) throw new Error('Could not find prefix for chain ' + chain);
          return toBech32(prefix, unzippedAddress);
        }),
        slippageTolerancePercent: '5.0',
        affiliates: []
      });

      return msgs;
    },
    [wallet]
  );

  const broadcastSwap: SwapContextType['broadcastSwap'] = useCallback(async (chain, tx) => {
    const response = await router.submitTransaction({ chainID: chain, tx });
    return response;
  }, []);

  const fetchStatus: SwapContextType['fetchStatus'] = useCallback(async (chain, txHash) => {
    const response = await router.transactionStatus({ chainID: chain, txHash });
    if (response.error) throw new Error(response.error.message);
    else return response;
  }, []);

  return (
    <SwapContext.Provider
      value={{
        findRoute,
        generateMsgs,
        broadcastSwap,
        fetchStatus
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export { SwapContext, SwapProvider };
