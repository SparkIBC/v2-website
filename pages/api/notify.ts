import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tx: hash } = req.query as { tx: string };
    if (!hash) return res.status(422).json({ error: 'Missing transaction hash' });

    const tx = await fetch(process.env.NEXT_PUBLIC_LCD + 'cosmos/tx/v1beta1/txs/' + hash).then((res) => res.json());

    if (!tx.tx_response) return res.status(504).json({ error: 'Could not find transaction' });

    if (new Date(tx.tx_response.timestamp) < new Date(new Date().getTime() - 2 * 60000))
      return res.status(500).json({ error: 'Transaction is over 2 minutes old' });

    const message = tx.tx.body.messages[0];

    if (message['@type'] !== '/cosmwasm.wasm.v1.MsgExecuteContract')
      return res.status(500).json({ error: 'Transaction type is not /cosmwasm.wasm.v1.MsgExecuteContract' });
    if (message.contract !== process.env.NEXT_PUBLIC_FUNDING_CONTRACT_ADDRESS!)
      return res.status(500).json({ error: 'Transaction is not relevant to funding contract' });
    if (message.funds[0].denom !== process.env.NEXT_PUBLIC_DENOM!)
      return res.status(500).json({ error: 'Transaction is not using correct denomination' });

    const fundedGeneral = !!message.msg.fund['fund_general'];

    const tag = fundedGeneral ? 'fund_general' : 'fund_campaign';

    const campaign_name = fundedGeneral ? 'General Fund' : message.msg.fund['fund_campaign'].campaign_name;
    let donor_address_type = message.msg.fund[tag].donor_address_type;
    let on_behalf_of = message.msg.fund[tag].on_behalf_of;

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_GUARD_API! + `/notify/${message.sender}`,
      {
        title: 'Your SparkIBC Receipt',
        content: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <style>
                  body {
                    margin-left: auto;
                    margin-right: auto;
                    padding-top: 1rem;
                    padding-bottom: 0.5rem;
                    font-family: 'PT Sans', sans-serif;
                    max-width: 2.8in;
                    height: 3in;
                    border: 1px solid black;
                    background-color: white;
                  }

                  table {
                    width: 100%;
                  }

                  tbody {
                    width: 100%;
                  }

                  tr {
                    width: 100%;
                  }

                  h1 {
                    text-align: center;
                    vertical-align: middle;
                  }

                  .items thead {
                    text-align: center;
                  }

                  .center-align {
                    text-align: center;
                  }

                  .bill-details td {
                    font-size: 12px;
                  }

                  .receipt {
                    font-size: larger;
                  }

                  .header-text {
                    font-size: small;
                    text-align: center;
                  }

                  .items .heading {
                    font-size: 12.5px;
                    text-transform: uppercase;
                    border-top: 1px solid black;
                    margin-bottom: 4px;
                    border-bottom: 1px solid black;
                    vertical-align: middle;
                  }

                  .items thead tr th:first-child,
                  .items tbody tr td:first-child {
                    width: 75%;
                    word-break: break-all;
                    text-align: left;
                  }

                  .items td {
                    font-size: 12px;
                    text-align: right;
                    vertical-align: bottom;
                  }

                  .price::before {
                    content: '$';
                    font-family: Arial;
                    text-align: right;
                  }

                  .sum-up {
                    text-align: right !important;
                  }
                  .total {
                    font-size: 13px;
                    border-top: 1px dashed black !important;
                    border-bottom: 1px dashed black !important;
                  }
                  .total.text,
                  .total.price {
                    text-align: right;
                  }
                  .total.price::before {
                    content: '$';
                  }
                  .line {
                    border-top: 1px solid black !important;
                  }
                  .heading.rate {
                    width: 25%;
                  }
                  p {
                    padding: 1px;
                    margin: 0;
                  }
                  section,
                  footer {
                    font-size: 12px;
                  }
                </style>
              </head>

              <body>
                <table class="bill-details">
                  <tbody>
                    <p class="header-text">Thank you for your contribution!</p>
                    <p class="header-text"><span>${new Date().toLocaleDateString(
                      'en-US'
                    )}</span> / <span>${new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: undefined
        })}</span></p>

                    <tr>
                      <th class="center-align" colspan="2"><span class="receipt">Donation Receipt</span></th>
                    </tr>
                  </tbody>
                </table>

                <table class="items">
                  <thead>
                    <tr>
                      <th class="heading name">Item</th>
                      <th class="heading rate">Chain</th>
                      <th class="heading rate">Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td><b>Your donation to ${campaign_name}</b><br />${donor_address_type} Donation${
          on_behalf_of ? `<br />On behalf of ${on_behalf_of}` : ''
        }</td>
                      <td>JUNO-1</td>
                      <td class="price">${(message.funds[0].amount / 1_000_000).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th colspan="2" class="total text">Total</th>
                      <th class="total price">${(message.funds[0].amount / 1_000_000).toFixed(2)}</th>
                    </tr>
                  </tbody>
                </table>
                <section>
                  <p>Paid with <b>AXLUSDC</b></p>
                </section>
                <footer style="text-align: center; margin-top: 2rem">
                  <p>SparkIBC</p>
                  <p>sparkibc.zone</p>
                </footer>
              </body>
            </html>
            `
      },
      {
        headers: {
          Authorization: process.env.SWIFT_NOTIFY_KEY!,
          'Content-Type': 'application/json'
        }
      }
    );

    if (data.result === 'sent') return res.status(200).end('Receipt sent!');
    else return res.status(500).json({ error: 'Error in Notify API' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error in Notify API' });
  }
}
