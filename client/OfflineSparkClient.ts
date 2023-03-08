import { SparkClient } from 'client/core';

import { CONTRACT_ADDRESS, CW20_ADDRESS } from 'util/constants';

const client = new SparkClient({
  wallet: null,
  signingCosmWasmClient: null,
  fundingContract: CONTRACT_ADDRESS,
  cw20Contract: CW20_ADDRESS
});

export default client;
