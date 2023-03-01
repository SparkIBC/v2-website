export interface IDonorType {
  id: string;
  name: string;
}

export interface IDonor {
  rank: number;
  name: string;
  address: string;
  sparkPoints: number;
  campaignDonations: number;
  generalDonations: number;
  info: string;
}