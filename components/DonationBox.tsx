import { useState } from 'react';
import { useChain } from '@cosmos-kit/react';

import Dropdown, { DropdownItemType } from 'components/Dropdown';

const CHAINS = [
  { id: 'avalanche', label: 'Avalanche', icon: '/images/chains/avalanche.svg' },
  { id: 'binance', label: 'Binance Smart Chain', icon: '/images/chains/binance.svg' },
  { id: 'etherum', label: 'Etherum', icon: '/images/chains/etherum.svg' },
  { id: 'evmos', label: 'Evmos', icon: '/images/chains/evmos.svg' },
  { id: 'fantom', label: 'Fantom', icon: '/images/chains/fantom.svg' },
  { id: 'harmony', label: 'Harmony', icon: '/images/chains/harmony.svg' },
  { id: 'solana', label: 'Solana', icon: '/images/chains/solana.svg' }
];

const TOKENS = [
  { id: 'acoin', label: '$ACOIN', icon: '/images/chains/avalanche.svg' },
  { id: 'bcoin', label: '$BCOIN', icon: '/images/chains/avalanche.svg' },
  { id: 'ccoin', label: '$CCOIN', icon: '/images/chains/avalanche.svg' },
  { id: 'dcoin', label: '$DCOIN', icon: '/images/chains/avalanche.svg' }
];

const DonationBox = () => {
  const [amount, setAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState<DropdownItemType | null>(null);
  const [selectedToken, setSelectedToken] = useState<DropdownItemType | null>(null);
  const { wallet, openView } = useChain(process.env.NEXT_PUBLIC_NETWORK!);

  return (
    <div className="flex flex-col w-full max-w-full md:w-[640px] lg:w-[460px]">
      <div className="self-end w-full h-12 relative z-10 md:w-80 lg:self-start lg:w-44">
        <Dropdown items={CHAINS} placeholder="Select chain..." onChange={setSelectedChain} selected={selectedChain} />
      </div>
      <div className="flex flex-col items-center bg-black/40 rounded-2xl backdrop-blur-sm px-6 py-8 mt-4 w-full md:px-8">
        <div className="flex justify-center items-center gap-2">
          <span className="text-xl md:text-2xl">Contribute</span>
          <input
            placeholder="#"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent outline-0 border-0 border-b border-white/50 text-sm text-center text-white p-0 ml-1 w-11 h-5 focus:border-white/50 focus:ring-0"
          />
          <div className="w-36 h-7">
            <Dropdown items={TOKENS} placeholder="token..." onChange={setSelectedToken} selected={selectedToken} />
          </div>
        </div>
        <button
          className="flex items-center justify-center bg-[#FF7A00] rounded-md text-white text-2xl mt-9 w-full h-14"
          onClick={() => {
            if (!wallet) openView();
          }}
        >
          {wallet ? 'Earn 0 SPARK' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default DonationBox;
