import { NextApiRequest, NextApiResponse } from 'next';

// isValidator endpoint: returns if provided address is a validator or not (boolean)
// @param address: string - wallet address
// @returns isValidator: boolean
async function isValidator(req: NextApiRequest, address: string) {
  try {
    const host = req.headers.host ?? '';
    const data = await fetch(
      `http${host.startsWith('localhost') ? '' : 's'}://${host}/validator_account_addresses.txt`
    ).then((res) => res.text());
    const result = data.includes(address);
    return result;
  } catch (error) {
    console.log('error in isValidator: ', error);
  }
}

// Handle incoming request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.address) {
    try {
      const address = req.query.address.toString();
      const result = await isValidator(req, address);
      res.status(200).json({ isValidator: result });
    } catch (error) {
      console.log('error in isValidator api: ', error);
      res.status(500).json({
        error: `Error in isValidator API: ${error}`
      });
    }
  }
}
