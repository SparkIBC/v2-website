'use client';

import { useCampaign } from 'contexts/campaign';

import NavDesktop from 'components/earn/NavDesktop';
import NavMobile from 'components/earn/NavMobile';
import DonationBox from 'components/DonationBox';
import Donate from 'components/DonationModule';

export default function Earn() {
  const { campaign } = useCampaign();

  return (
    <main id="particles" className="w-full">
      <div className="flex flex-col pt-20 w-full h-screen relative lg:pt-0">
        <div className="w-full p-5 mt-2 md:p-2">
          <NavDesktop />
          <NavMobile />
        </div>
        <div className="flex flex-col items-center justify-center grow px-5 pb-20 w-full h-full lg:flex-row lg:pb-0">
          <div className="hidden flex-col items-center justify-center pb-24 relative md:flex lg:grow lg:h-full">
            <div className="font-chathura uppercase">
              <h1 className="text-8xl leading-10 font-extrabold tracking-wide">Be the spark for</h1>
              <h2 className="text-4xl font-light tracking-widest mt-2.5">{campaign.description}</h2>
            </div>
          </div>
          <div className="flex justify-center w-full lg:w-[35vw]">
            <div className="flex justify-center w-[inherit] lg:pt-32 lg:fixed lg:right-0 lg:top-1/2 lg:-translate-y-2/4">
              <Donate
                showAbout={false}
                campaign={campaign.name === 'General Fund' ? undefined : campaign.name}
                rounded
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative lg:w-[calc(100%_-_35vw)]">
        <div className="flex justify-center w-full absolute -top-6 -translate-y-full">
          <div
            className="cursor-pointer flex flex-col gap-3 items-center"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xl leading-5 font-semibold">Campaign Info</span>
            <div className="flex justify-center gap-3">
              <img src="/images/arrow-orange.svg" alt="v" />
              <img src="/images/arrow-orange.svg" alt="v" />
              <img src="/images/arrow-orange.svg" alt="v" />
            </div>
          </div>
        </div>
        <div className="p-5 pt-14">
          <campaign.component />
        </div>
      </div>
    </main>
  );
}
