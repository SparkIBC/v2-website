import { createContext, ReactNode, useContext, useState } from 'react';

import { IDonorType, IDonor } from 'donors/types';
import { DONOR_TYPES, DONORS, CURRENT_DONOR } from 'donors/const';

type DonorContext = {
  donorType: IDonorType | null;
  setDonorType: (donorType: IDonorType) => void;
  donors: Array<IDonor>;
  setDonors: (donors: Array<IDonor>) => void;
  currentDonor: IDonor | null;
  setCurrentDonor: (donor: IDonor) => void;
};

export const Donor = createContext<DonorContext>({
  donorType: null,
  setDonorType: () => {},
  donors: [],
  setDonors: () => {},
  currentDonor: null,
  setCurrentDonor: () => {}
});

export function DonorProvider({ children }: { children: ReactNode }) {
  const [donorType, setDonorType] = useState<IDonorType>(DONOR_TYPES[0]);
  const [donors, setDonors] = useState<Array<IDonor>>(DONORS);
  const [currentDonor, setCurrentDonor] = useState<IDonor>(CURRENT_DONOR);

  return (
    <Donor.Provider value={{ donorType, setDonorType, donors, setDonors, currentDonor, setCurrentDonor }}>
      {children}
    </Donor.Provider>
  );
}

export const useDonor = (): DonorContext => useContext(Donor);
