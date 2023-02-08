import Zoom from 'react-medium-image-zoom'
import { useWindowSize } from 'hooks/useWindowSize'

export default function Campaign_InterchainInfo() {
  const IMG_BREAKPOINT_SM = 640
  const IMG_BREAKPOINT_LG = 1024
  const { width } = useWindowSize()

  function calcImageSize(width: number | undefined, target: string): number {
    if (width && width <= IMG_BREAKPOINT_SM) {
      return target === 'spark' ? 100 : 126
    } else if (
      width &&
      width >= IMG_BREAKPOINT_SM &&
      width <= IMG_BREAKPOINT_LG
    ) {
      return target === 'spark' ? 150 : 177
    } else {
      return target === 'spark' ? 200 : 236
    }
  }

  return (
    <section
      id="campaigninfo"
      className="flex flex-col justify-start items-center min-h-[90vh] px-1 lg:px-0 pt-36 mb-4 lg:my-32"
    >
      <div className="flex flex-col items-center justify-center lg:flex-row">
        <img
          src="/images/Logo.svg"
          width={calcImageSize(width, 'spark')}
          height={calcImageSize(width, 'spark')}
          alt="spark ibc cosmos logo"
          className="lg:mr-8"
        />
        <p className="mx-4 my-4 text-7xl">+</p>
        <img
          src="/images/ICI_logo.png"
          width={calcImageSize(width, 'ICI')}
          height={calcImageSize(width, 'ICI')}
          alt="interchain info logo"
          className="mb-8 lg:ml-6 lg:my-0"
        />
      </div>

      <h1 className="mt-8 text-2xl font-bold align-middle sm:text-4xl lg:text-6xl whitespace-nowrap">
        Interchain Info
      </h1>

      <h3 className="my-4 text-2xl lg:text-4xl">
        <strong>Campaign #4</strong>
      </h3>

      {/* <h3 className="mb-4 text-xl lg:text-3xl text-spark-orange">
        <span className="align-text-bottom">
          <span className="font-bold">{fundingAmount}</span> USDC raised
        </span>
      </h3> */}

      {/* Description */}
      <p className="my-4 text-left lg:text-2xl indent-8 sm:indent-20">
        The Cosmos is made special by its amazing tech, decentralized nature,
        and wide array of fully sovereign chains. However, these things also
        lead to a fracturing of information, tools, and communities. We at Spark
        IBC like to call this, “The Fragmentation Problem” and we feel it&apos;s
        currently one of the single largest barriers to mass adoption in the
        Cosmos. The average user has no clue how to start navigating the rapidly
        growing Interchain, and those that do make it through the front gates
        often find themselves at a loss for how to best explore further.
      </p>

      <Zoom>
        <img
          src="/images/ICI_Infographic.png"
          alt="interchain info infographic"
          width={768}
          className="mt-4 mb-8"
        />
      </Zoom>

      {/* <GradientDiv className="my-4" /> */}

      <h3 className="my-4 text-2xl font-normal lg:text-4xl">
        Specific campaign parameters:
      </h3>

      <div className="flex flex-col sm:flex-row">
        <h4 className="px-2 mx-1 my-2 text-lg font-bold lg:text-xl">
          Requirements:
        </h4>
        <h4 className="px-2 mx-1 my-2 rounded-md lg:text-xl gradient-border-1 border-gradient-tr-red-orange-spark-gray">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-transparent bg-clip-text">
            <strong>Tiered:</strong> Yes
          </span>
        </h4>
        <h4 className="px-2 mx-1 my-2 rounded-md lg:text-xl gradient-border-1 border-gradient-tr-red-orange-spark-gray">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-transparent bg-clip-text">
            <strong>Funding:</strong> 50,000, 100,000+
          </span>
        </h4>
        <h4 className="px-2 mx-1 my-2 rounded-md lg:text-xl gradient-border-1 border-gradient-tr-red-orange-spark-gray">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-transparent bg-clip-text">
            <strong>Other:</strong> None
          </span>
        </h4>
      </div>

      {/* details */}
      <p className="mt-4 mb-2 text-left lg:text-2xl indent-8 sm:indent-20">
        We&apos;re building Interchain Info (ICI) with one purpose in mind,{' '}
        <strong>
          to aggregate the vast amount of content, tools, and dApps that are
          scattered throughout the Cosmos into one, easy to use website.
        </strong>{' '}
        With community support, we believe we can optimize new user onboarding
        and provide a tremendous amount of value to existing users of the Cosmos
        and beyond.
      </p>

      <p className="self-start my-2 text-left lg:text-2xl">
        Interchain Info is a website with three primary offerings:
      </p>

      <div className="self-start my-2 text-left lg:text-2xl">
        <ol className="text-left list-decimal list-inside lg:ml-28">
          <li className="mb-4 text-xl font-bold lg:text-4xl">The Index</li>
          <ol className="mb-4 ml-8 list-alpha">
            <li className="mb-4">
              A comprehensive encyclopedia of the Interchain with pages covering
              every major project, chain, validator and more.
            </li>
            <li className="mb-4">
              This section&apos;s first iteration is already built out, with a
              vast amount of content already ingested & categorized. We plan to
              continue adding features and improving the UX over time and work
              closely with projects and active community members to continue
              adding content as we grow.
            </li>
          </ol>
          <ol className="ml-16 list-roman">
            <li className="mb-4">
              We strongly believe that UI & UX flows are as important to our end
              goal as the actual content they support, and so we believe the
              UI/UX will adapt and change overtime. We will continue to iterate
              on these aspects with the help of our users based on feedback and
              usage patterns.
            </li>
          </ol>

          <li className="mb-4 text-xl font-bold lg:text-4xl">Resource Hub</li>
          <ol className="mb-4 ml-8 list-alpha">
            <li className="mb-4">
              This section provides long term hosting, organization, promotion,
              and SEO optimization for community content such as articles,
              twitter threads, audio recordings, videos and more.
            </li>
            <li className="mb-4">
              The first version of the Hub is currently being finalized
              alongside the Index. Again, we plan to improve upon this over time
              as well as work with projects & their community to keep it updated
              & brimming with the best content available.
            </li>
          </ol>
        </ol>

        <p className="self-start mt-8 mb-2 text-left lg:text-2xl indent-8 sm:indent-20">
          Both the Index & the Resource Hub are currently being tested in a
          closed Beta and should be available to the public through an open Beta
          by the end of December.
        </p>

        <p className="self-start mt-2 mb-8 text-left lg:text-2xl indent-8 sm:indent-20">
          While some funds from the campaign will pay for the ongoing
          development and maintenance costs, the majority of the funding from
          this campaign will go towards building out the third, and arguably
          most fun, part of our site: The Dashboard.
        </p>

        <ol className="list-three lg:ml-28">
          <li className="mb-4 text-xl font-bold lg:text-4xl">The Dashboard</li>
          <ol className="mb-4 ml-8 list-alpha">
            <li className="mb-4">
              The Dashboard aims to become a customizable{' '}
              <strong>home page</strong> and <strong>command center</strong> of
              sorts for every Cosmos user. When visiting the dashboard for the
              first time, a user will be able to pick which “modules” they want
              displayed for ease of access (i.e. REstake, Hubble Tools,
              Yieldmos, Rango, etc.).
            </li>
            <li className="mb-4">
              We believe this will greatly improve the user experience for
              commonly used applications and finally address the aforementioned
              fragmentation issue in regards to finding smaller tools and dApps.
            </li>
            <li className="mb-4">
              The tool we intend to build for 2023 (work in progress name,
              “MyTx”) allows users with no coding knowledge to build custom
              transaction flows that execute instantaneously. For example,
              let&apos;s say you find an NFT you want to buy using the
              HubbleTools module, and while you don&apos;t have any stars, you
              do have some pending $ATOM staking rewards. Without leaving the
              page, this tool would let you quickly assemble and execute the
              following with a few clicks:
            </li>
            <p className="my-4 italic font-bold">
              Claim ATOM staking rewards ➤ IBC ATOM to Osmosis ➤ Swap ATOM for
              STARS on Osmosis ➤ IBC STARS from Osmosis to Stargaze
            </p>
            <p className="mb-2">
              With the advent of Interchain Accounts, this can be reduced to a
              single click for execution.
            </p>
            <ol className="ml-8 list-roman">
              <li className="mb-4">
                Users who have earned Spark Points from their contributions on
                the Spark platform will be able to save these TX combos as
                templates for future use. The more Spark Points you have, the
                more template slots will be available to you.
              </li>
              <li className="mb-4">
                We also have plans to work with CronCat to enable users to
                convert these combos into recipes and in turn, automate them.
              </li>
            </ol>
            <li className="mb-4">
              Our team, who has already built out much of the rest of the site,
              is far more specialized on the Web2 front, so we will need to hire
              talent to help us build out the Dashboard. This is where the
              majority of raised funds will be allocated.
            </li>
          </ol>
        </ol>
      </div>

      <p className="my-2 text-left lg:text-2xl indent-8 sm:indent-20">
        This campaign has no funding cap, as we intend to be building for the
        foreseeable future. We will have continuous costs such as server
        hosting, developer contracting, and of course, our own time and effort.
      </p>

      <p className="mt-2 mb-4 text-left lg:text-2xl indent-8 sm:indent-20">
        We do however have a <strong>target of at least 50,000 $USDC</strong> by
        February 28th, though{' '}
        <strong>we hope to raise in the six figure range</strong> if we can get
        adequate coverage from grant programs and community pools. This would
        begin to cover our costs thus far as well as provide initial funding for
        the Dashboard MVP. It should also cover maintenance and hosting for the
        near future. Usage of all funds will be tracked and may be made
        available upon request.
      </p>

      <p className="mt-2 mb-4 text-left lg:text-2xl indent-8 sm:indent-20">
        In addition, we will work with grant programs and other funding sources
        to ensure that even if these contributions are unable to be made in
        axlUSDC on Juno Network, that they will still earn Spark points and a
        spot on the Spark IBC leaderboard. If you are a large donor or grant
        writer, we are happy to provide a more comprehensive breakdown of how
        funds will be allocated upon request. Please reach out to us at
        info@sparkibc.zone.
      </p>

      <p className="my-8">
        <video controls poster="/images/ICI_poster_logo.png" width={768}>
          <source
            src="https://sparkibc.s3.filebase.com/InterchainInfo/FINAL%20ICI%20CAMPAIGN%20VIDEO.mp4"
            type="video/mp4"
          />
        </video>
      </p>

      <p className="mt-2 mb-4 text-left lg:text-2xl indent-8 sm:indent-20">
        In the next couple of weeks, Spark IBC will release two versions of our
        near term roadmap with details on how we plan to allocate funds and
        prioritize development. As Spark IBC&apos;s first tiered campaign, we
        want to be transparent with expectations related to the amount raised.
        One roadmap will pertain to raises around the 50k USDC range, with the
        other being applicable for 100k and up.
      </p>
    </section>
  )
}
