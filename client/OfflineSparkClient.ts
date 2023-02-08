import { SparkClient } from 'client/core'

import { CONTRACT_ADDRESS } from 'util/constants'

const client = new SparkClient({
  wallet: null,
  signingCosmWasmClient: null,
  fundingContract: CONTRACT_ADDRESS,
})

export default client
