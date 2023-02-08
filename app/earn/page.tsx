'use client'

import { RadioGroup } from '@headlessui/react'
import campaigns, { Campaign } from 'campaigns'
import { useCampaign } from 'contexts/campaign'
import { useState } from 'react'
import { classNames } from 'util/css'

export default function Earn() {
  const { campaign, setCampaign } = useCampaign()
  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <div>
        <RadioGroup value={campaign} onChange={setCampaign} className="mt-2">
          <div className="flex flex-row justify-between pb-2 border-b border-white/50">
            <RadioGroup.Label className="text-sm font-medium text-white">
              Active campaigns:{' '}
            </RadioGroup.Label>
            {campaign && (
              <a
                onClick={() => setCampaign(undefined)}
                className="text-sm font-medium cursor-pointer text-primary hover:text-primary/80"
              >
                Clear
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {campaigns.map((campaignData) => (
              <RadioGroup.Option
                key={campaignData.name}
                value={campaignData}
                onClick={() => {
                  if (campaign === campaignData) setCampaign(undefined)
                }}
                className={({ checked }) =>
                  classNames(
                    checked
                      ? 'bg-primary border-transparent hover:bg-primary/80'
                      : 'bg-bg-light border-white/25',
                    'border cursor-pointer focus:outline-none text-white rounded-md py-3 px-3 flex items-center text-center justify-center text-sm font-medium uppercase sm:flex-1',
                  )
                }
              >
                <RadioGroup.Label as="span">
                  {campaignData.name}
                </RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      <div className="mt-24">
        <h1 className="text-4xl font-bold text-center uppercase">
          Be the spark for
        </h1>
        <h2 className="text-xl text-center">
          {campaign?.description || 'IBC Community Engagement'}
        </h2>
      </div>
      {campaign && (
        <div className="w-full mt-8">
          <campaign.component />
        </div>
      )}
    </div>
  )
}
