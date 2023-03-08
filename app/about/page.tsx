'use client';

import Info from 'components/about/Info';
import Products from 'components/about/Products';

const About = () => {
  return (
    <main id="particles" className="pt-36 px-6 pb-12 w-full md:px-8 lg:pt-16">
      <div className="flex flex-col items-center text-center">
        <img src="/images/logo_slogan.svg" alt="Spark IBC" />
        <h1 className="text-3xl font-semibold mt-7 md:text-4xl lg:text-5xl">The launchpad the Interchain deserves.</h1>
        <h2 className="text-lg font-medium italic mt-16 md:text-xl">
          “It's like a Kickstarter for Cosmos, if Kickstarter didn't suck...”
        </h2>
      </div>
      <div className="mt-20">
        <Info />
      </div>
      <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm my-16 w-full h-3" />
      <Products />
      <div className="flex flex-col gap-7 text-xs text-center leading-5 mx-auto mt-20 w-[670px] max-w-full">
        <p>
          Spark IBC operates on a donation based model, where anyone or any entity can donate funds through the Spark
          IBC website and smart contract built on a number of different sovereign blockchains. Spark IBC is not,
          however, a registered charity, and donations cannot be claimed as tax-write offs at this time. Additionally,
          Spark IBC operates as is, and comes with no guarantees as to the usage of funds. Upon donating through the
          Spark IBC contract, users forfeit their assets in their entirety, including to but not limited to any and all
          expectations pertaining to the usage of said assets.
        </p>
        <p>
          SPARK IBC, SPARKIBC, INTERCHAININFO, INTERCHAIN INFO AND ANY RELATED PARTIES DISCLAIMS ANY RESPONSIBILITY FOR
          ANY HARM OR LIABILITY ARISING OUT OF OR RELATED TO YOUR USE OF OUR SERVICES, INCLUDING TO BUT NOT LIMITED TO
          THIS WEBSITE AS WELL AS ON-CHAIN SMART CONTRACTS.
        </p>
      </div>
    </main>
  );
};

export default About;
