import { useContext } from 'react';
import { SwapContext } from './SwapProvider';

const useSwap = () => {
  const context = useContext(SwapContext);

  if (!context) {
    throw new Error('useAirdrop must be used within AirdropProvider');
  }

  return context;
};

export default useSwap;
