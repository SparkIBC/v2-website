import { NextApiRequest, NextApiResponse } from 'next';
import { AddressType } from 'types';
import { getLeaderboardData } from './leaderboard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    //
    const addressType = req.query.type as AddressType;
    if (!Object.values(AddressType).includes(addressType)) {
      return res.status(500).json({
        error: `Invalid address type. Expected one of: ${Object.values(AddressType).join(', ')}`
      });
    }
    // console.log("address type ", addressType);

    const walletAddress = req.query.address as string | undefined;

    const data = await getLeaderboardData(addressType, walletAddress);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'error in leaderboard API' });
  }
}
