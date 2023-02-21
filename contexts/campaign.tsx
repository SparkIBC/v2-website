import { createContext, ReactNode, useContext, useState } from 'react'
import campaigns, { Campaign as CampaignType } from 'campaigns'

export interface CampaignContext {
  campaign: CampaignType
  setCampaign: (campaign: CampaignType) => void
}

export const Campaign = createContext<CampaignContext>({
  campaign: campaigns[0],
  setCampaign: () => {},
})

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useState<CampaignType>(campaigns[0])

  return (
    <Campaign.Provider
      value={{
        campaign,
        setCampaign,
      }}
    >
      {children}
    </Campaign.Provider>
  )
}

export const useCampaign = (): CampaignContext => useContext(Campaign)
