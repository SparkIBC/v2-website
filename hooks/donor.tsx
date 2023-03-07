import { IDonor } from 'types';
import { convertMicroDenomToDenom } from 'util/type';

export const convertToIDonor = (
  rank: number,
  { campaignDonations, generalDonations, totalSparkPoints, ...donor }: IDonor
): IDonor => ({
  rank,
  ...donor,
  campaignDonations: convertMicroDenomToDenom(campaignDonations),
  generalDonations: convertMicroDenomToDenom(generalDonations),
  totalSparkPoints: Math.round(convertMicroDenomToDenom(totalSparkPoints))
});
