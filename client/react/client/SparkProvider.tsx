import { useCallback, useEffect, useMemo } from 'react';
import { SparkClient } from 'client/core';
import SparkClientContext from './SparkClient';

import { CONTRACT_ADDRESS, CW20_ADDRESS } from 'util/constants';
import useWallet from '../wallet/useWallet';

export default function SparkProvider({ children }: { children: JSX.Element }) {
  const { wallet, signingCosmWasmClient } = useWallet();

  const client = useMemo(
    () =>
      new SparkClient({
        wallet: wallet || null,
        fundingContract: CONTRACT_ADDRESS,
        cw20Contract: CW20_ADDRESS,
        signingCosmWasmClient: signingCosmWasmClient || null
      }),
    [wallet, signingCosmWasmClient]
  );

  // Connect client
  useEffect(() => {
    if (client) client.connect();
  }, [client]);

  return (
    <SparkClientContext.Provider
      value={{
        client
      }}
    >
      {children}
    </SparkClientContext.Provider>
  );
}
