import { useCallback, useEffect, useMemo, useState } from 'react'
import { SparkClient } from 'client/core'
import SparkClientContext from './SparkClient'

import { CONTRACT_ADDRESS } from 'util/constants'
import useWallet from '../wallet/useWallet'

export default function StargazeProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [, updateState] = useState<{}>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const { wallet, signingCosmWasmClient } = useWallet()

  const client = useMemo(
    () =>
      new SparkClient({
        wallet: wallet || null,
        fundingContract: CONTRACT_ADDRESS,
        signingCosmWasmClient: signingCosmWasmClient || null,
      }),
    [wallet, signingCosmWasmClient],
  )

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
      await client?.connect()
      forceUpdate()
    }

    connectClient()
  }, [client, forceUpdate])

  return (
    <SparkClientContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </SparkClientContext.Provider>
  )
}
