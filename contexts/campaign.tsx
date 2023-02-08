import { createContext, ReactNode, useContext, useState } from 'react'
import { Campaign as CampaignType } from 'campaigns'

export interface CampaignContext {
  campaign?: CampaignType
  setCampaign: (campaign?: CampaignType) => void
}

export const Campaign = createContext<CampaignContext>({
  campaign: undefined,
  setCampaign: () => {},
})

export function CampaignProvider({ children }: { children: ReactNode }) {
  // undefined = general fund
  const [campaign, setCampaign] = useState<CampaignType>()

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
