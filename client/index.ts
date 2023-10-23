import { SparkClient } from './core';

import SparkProvider from './react/client/SparkProvider';
import { SwapProvider } from './react/swap/SwapProvider';
import useSparkClient from './react/client/useSparkClient';
import useSwap from './react/swap/useSwap';
import useContract from './react/contract/useContract';
import useWallet from './react/wallet/useWallet';

// React components
export { SparkProvider, SwapProvider, useWallet, useSparkClient, useSwap, useContract };

export { SparkClient };
