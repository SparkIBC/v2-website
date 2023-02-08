'use client'

import Donate from 'components/DonationModule'
import { useCampaign } from 'contexts/campaign'
import { useMemo } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { campaign } = useCampaign()

  const _donate = useMemo(
    () => <Donate showAbout={false} campaign={campaign?.name} rounded />,
    [campaign],
  )

  return (
    <main id="particles" className="grid grid-cols-5 gap-4 bg-bg-light">
      <div className="col-span-3">{children}</div>
      <div className="md:fixed md:right-[5vw] flex items-center justify-center h-screen">
        <div className="pb-8 bg-black border rounded-b-lg border-white/25 w-[25vw] h-[55vh]">
          {_donate}
        </div>
      </div>
    </main>
  )
}
