import { useChain } from '@cosmos-kit/react';
import { useSparkClient } from 'client';

import { ConnectedWallet } from 'components/index';

const WalletButton = () => {
  const { isWalletConnected, connect, disconnect } = useChain(process.env.NEXT_PUBLIC_NETWORK!);

  const { client } = useSparkClient();

  return isWalletConnected && client?.wallet ? (
    <div className="mx-2">
      <ConnectedWallet wallet={client?.wallet} handleConnect={() => disconnect()} />
    </div>
  ) : (
    <button
      className="bg-bg-light shadow-[0_0_19px_-10px_rgba(255,153,0,0.4)] border border-spark-orange/10 rounded-lg w-full h-12 hover:shadow-[0_0_10px_-2px_rgba(255,232,187,0.3)]"
      onClick={() => connect()}
    >
      <span className="flex items-center justify-center text-xl text-white w-full h-full hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-spark-orange-dark hover:to-spark-orange">
        Connect
      </span>
    </button>
  );
};

export default WalletButton;
