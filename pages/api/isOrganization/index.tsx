import { NextApiRequest, NextApiResponse } from 'next';

// isOrganization endpoint: returns if provided address is an organzation or not (boolean)
// @param address: string - wallet address
// @returns isOrganization: boolean
async function isOrganization(req: NextApiRequest, address: string) {
  try {
    const host = req.headers.host ?? '';
    const data = await fetch(
      `http${host.startsWith('localhost') ? '' : 's'}://${host}/organization_account_addresses.txt`
    ).then((res) => res.text());
    const result = data.includes(address);
    return result;
  } catch (error) {
    console.log('error in isOrganization: ', error);
  }
}

// Handle incoming request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.address) {
    try {
      const address = req.query.address.toString();
      const result = await isOrganization(req, address);
      res.status(200).json({ isOrganization: result });
    } catch (error) {
      console.log('error in isOrganization api: ', error);
      res.status(500).json({
        error: `Error in isOrganization API: ${error}`
      });
    }
  }
}
