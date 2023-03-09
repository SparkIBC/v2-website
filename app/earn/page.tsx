'use client';

import { useCampaign } from 'contexts/campaign';

import NavDesktop from 'components/earn/NavDesktop';
import NavMobile from 'components/earn/NavMobile';
import Donate from 'components/DonationModule';

export default function Earn() {
  const { campaign } = useCampaign();

  return (
    <main id="particles" className="w-full">
      <div className="relative flex flex-col w-full h-screen pt-20 lg:pt-0">
        <div className="w-full p-5 mt-2 md:p-2">
          <NavDesktop />
          <NavMobile />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full px-5 pb-20 grow lg:flex-row lg:pb-0">
          <div className="relative flex-col items-center justify-center hidden pb-24 md:flex lg:grow lg:h-full">
            <div className="uppercase font-chathura">
              <h1 className="font-extrabold leading-10 tracking-wide text-8xl">Be the spark for</h1>
              <h2 className="text-4xl font-light tracking-widest mt-2.5">{campaign.description}</h2>
            </div>
          </div>
          <div className="flex justify-center w-full lg:w-[35vw]">
            <div className="flex justify-center w-[inherit] lg:pt-32 lg:fixed lg:right-0 lg:top-1/2 lg:-translate-y-2/4">
              <Donate
                showAbout={false}
                // campaign={campaign.name === 'General Fund' ? undefined : campaign.name}
                rounded
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative lg:w-[calc(100%_-_35vw)]">
        <div className="absolute flex justify-center w-full -translate-y-full -top-6">
          <div
            className="flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xl font-semibold leading-5">Campaign Info</span>
            <div className="flex justify-center gap-3">
              <img src="/images/arrow-orange.svg" alt="v" />
              <img src="/images/arrow-orange.svg" alt="v" />
              <img src="/images/arrow-orange.svg" alt="v" />
            </div>
          </div>
        </div>
        <div className="px-4 pb-8 pt-14">
          <campaign.component />
        </div>
      </div>
    </main>
  );
}
