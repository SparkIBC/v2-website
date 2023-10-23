import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import campaigns, { Campaign as CampaignType } from 'campaigns';
import { useSparkClient } from 'client';

export interface CampaignContext {
  campaign: CampaignType;
  setCampaign: (campaign: CampaignType) => void;
  amountRaised?: number;
}

export const Campaign = createContext<CampaignContext>({
  campaign: campaigns[0],
  setCampaign: () => {},
  amountRaised: undefined
});

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { client } = useSparkClient();

  const [campaign, setCampaign] = useState<CampaignType>(campaigns[0]);
  const [amountRaised, setAmountRaised] = useState<number>();

  useEffect(() => {
    if (!client?.fundingClient) return;

    async function effect() {
      if (campaign.name === 'General Fund') {
        let otherAmountsRaised;
        let substractor = 0;
        if (campaigns.length > 1) {
          const otherAmountsRaised_Promise = campaigns
            .filter((campaign) => campaign.name != 'General Fund')
            .map(async (campaign) => {
              return await client?.fundingClient
                .queryGetCampaign({ campaignName: campaign.name })
                .then((campaignInfo) => {
                  return parseInt(campaignInfo.campaign.total_donations) / 1_000_000;
                });
            });

          otherAmountsRaised = await Promise.all(otherAmountsRaised_Promise);
          substractor = otherAmountsRaised.reduce((a, b) => +(a || 0) + +(b || 0)) || 0;
        } else {
          otherAmountsRaised = 0;
        }

        client?.fundingClient.queryTotalDonated().then((totalDonated) => {
          const amount = parseInt(totalDonated) / 1_000_000;
          setAmountRaised(amount - substractor);
        });
      } else {
        client?.fundingClient.queryGetCampaign({ campaignName: campaign.name }).then((campaignInfo) => {
          setAmountRaised(undefined);
          const amount = parseInt(campaignInfo.campaign.total_donations) / 1_000_000;
          setAmountRaised(amount);
        });
      }
    }

    effect();
  }, [campaign, client?.fundingClient]);

  return (
    <Campaign.Provider
      value={{
        campaign,
        setCampaign,
        amountRaised
      }}
    >
      {children}
    </Campaign.Provider>
  );
}

export const useCampaign = (): CampaignContext => useContext(Campaign);
