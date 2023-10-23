import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { AddressType, IDonor } from 'types';
import { useSparkClient } from 'client';
import { convertToIDonor } from 'hooks/donor';

type DonorContext = {
  donorType: string | null;
  setDonorType: (donorType: AddressType) => void;
  donors: IDonor[];
  setDonors: (donors: IDonor[]) => void;
  currentDonor?: IDonor;
  setCurrentDonor: (donor: IDonor) => void;
};

export const Donor = createContext<DonorContext>({
  donorType: null,
  setDonorType: () => {},
  donors: [],
  setDonors: () => {},
  currentDonor: undefined,
  setCurrentDonor: () => {}
});

export function DonorProvider({ children }: { children: ReactNode }) {
  const { client } = useSparkClient();

  const [donorType, setDonorType] = useState<string>(Object.keys(AddressType)[0]);
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [currentDonor, setCurrentDonor] = useState<IDonor>();

  useEffect(() => {
    setDonors([]);
    setCurrentDonor(undefined);

    console.log('Loading leaderboard...');

    fetch(`/api/leaderboard?type=${donorType}` + (client?.wallet?.address ? `&address=${client?.wallet.address}` : ''))
      .then((res) => res.json())
      .then((json: { topTokenHolders: IDonor[]; currentDonor: IDonor | undefined }) => {
        console.log('Loaded leaderboard!');
        setDonors(json.topTokenHolders.map((donor, i) => convertToIDonor(i + 1, donor)));
        setCurrentDonor(json.currentDonor ? convertToIDonor(NaN, json.currentDonor) : undefined);
      });
  }, [client?.wallet, donorType]);

  return (
    <Donor.Provider value={{ donorType, setDonorType, donors, setDonors, currentDonor, setCurrentDonor }}>
      {children}
    </Donor.Provider>
  );
}

export const useDonor = (): DonorContext => useContext(Donor);
