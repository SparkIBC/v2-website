import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { AddressType, ContractDonor, ContractTopTokenHolder, IDonor } from 'types';
import { CONTRACT_ADDRESS, CW20_ADDRESS, RPC } from 'util/constants';

/**
 * getLeaderboardData - used to aggregate toptokenholder addresses and total donated
 *  with their campaign + general donation counterparts
 * @param type string - address type (Private | Validator)
 * @returns Donor object
 * {
 *  address: string;
 *  campaignDonations: number;
 *  generalDonations: number;
 *  totalSparkPoints: number;
 * }
 */
export async function getLeaderboardData(type: AddressType, walletAddress?: string) {
  // get top token holders list
  let topTokenHolders: IDonor[];

  if (type === AddressType.All) {
    const topTokenHoldersList_Private = await getTopTokenHolders(AddressType.Private);
    // define donor list to return
    const topTokenHolders_Private: IDonor[] = (
      await Promise.all(topTokenHoldersList_Private.map(async ({ addr }) => await getDonor(addr)))
    )
      .filter(Boolean)
      .map((donor) => contractDonorToIDonor(donor!));

    const topTokenHoldersList_Validator = await getTopTokenHolders(AddressType.Validator);
    // define donor list to return
    const topTokenHolders_Validator: IDonor[] = (
      await Promise.all(topTokenHoldersList_Validator.map(async ({ addr }) => await getDonor(addr)))
    )
      .filter(Boolean)
      .map((donor) => contractDonorToIDonor(donor!));

    const topTokenHoldersList_Organization = await getTopTokenHolders(AddressType.Organization);
    // define donor list to return
    const topTokenHolders_Organization: IDonor[] = (
      await Promise.all(topTokenHoldersList_Organization.map(async ({ addr }) => await getDonor(addr)))
    )
      .filter(Boolean)
      .map((donor) => contractDonorToIDonor(donor!));

    topTokenHolders = [...topTokenHolders_Private, ...topTokenHolders_Validator, ...topTokenHolders_Organization].sort(
      (a, b) => b.totalSparkPoints - a.totalSparkPoints
    );
  } else {
    const topTokenHoldersList = await getTopTokenHolders(type);
    // define donor list to return
    topTokenHolders = (await Promise.all(topTokenHoldersList.map(async ({ addr }) => await getDonor(addr))))
      .filter(Boolean)
      .map((donor) => contractDonorToIDonor(donor!))
      .sort((a, b) => b.totalSparkPoints - a.totalSparkPoints);
  }

  let currentDonor: IDonor | undefined;
  if (walletAddress) {
    const donor = await getDonor(walletAddress);
    currentDonor = donor && contractDonorToIDonor(donor);
  }

  return {
    topTokenHolders,
    currentDonor
  };
}

// getTopTokenHolders - get the top token holders given type of wallet ( Private | Validator ) CASE-SENSITIVE
export async function getTopTokenHolders(type: AddressType) {
  const topTokenHoldersMsg = {
    top_token_holders: {
      address_type: type,
      limit: 100 // add a hardcoded limit of 100 now, @TODO - change the endpoint to support limits from the frontend
    }
  };

  const client = await CosmWasmClient.connect('https://juno-rpc.reece.sh:443/');

  // get topTokenHolders from contract
  const topTokenHoldersResult = await client.queryContractSmart(CW20_ADDRESS, topTokenHoldersMsg);

  const topTokenHoldersList = topTokenHoldersResult.top_token_holders;

  return topTokenHoldersList as ContractTopTokenHolder[];
}

// Get donor data
export async function getDonor(address: string) {
  // make request to get donor data

  const msg = {
    query_get_donor: {
      donor_address: address
    }
  };

  const client = await CosmWasmClient.connect('https://juno-rpc.reece.sh:443/');

  try {
    const result = await client.queryContractSmart(CONTRACT_ADDRESS, msg);
    // console.log("result: ", result);
    return result.donor as ContractDonor;
  } catch (err) {
    // console.log("err in getDonor:\n ", err);
  }
}

export const contractDonorToIDonor = (donor: ContractDonor): IDonor => {
  const genDonations = parseInt(donor.total_general_donations);
  const campaignDonations = parseInt(donor.total_campaign_donations);

  return {
    address: donor.addr,
    campaignDonations: campaignDonations,
    generalDonations: genDonations,
    totalSparkPoints: campaignDonations + genDonations,
    nickname: donor.nickname,
    validatorLink: donor.validator_link
  };
};
