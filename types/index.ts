export interface IDonor {
  rank?: number;
  address: string;
  campaignDonations: number;
  generalDonations: number;
  totalSparkPoints: number;
  nickname: string | null;
  validatorLink: {
    label: string;
    url: string;
  } | null;
}

export interface ContractDonor {
  addr: string;
  total_campaign_donations: string;
  total_general_donations: string;
  nickname: string | null;
  validator_link: {
    label: string;
    url: string;
  } | null;
}

export interface ContractTopTokenHolder {
  addr: string;
  balance: string;
}

export enum AddressType {
  Private = 'Private',
  Validator = 'Validator',
  All = 'All'
}
