export default function Campaign_TerraspacesAppreciation() {
  return (
    <section id="campaigninfo" className="min-h-[90vh] px-1 lg:px-0 pt-36 pb-4 lg:py-32">
      <div className="flex flex-row items-center justify-center pb-8">
        <img src="/images/Logo.svg" alt="spark ibc cosmos logo" width={128} height={128} className="lg:pr-8" />
        <p className="flex-shrink-0 px-6 py-4 text-5xl">+</p>
        <img
          src="/images/terraspaces_logo.png"
          alt="terraspaces logo"
          width={128}
          height={128}
          className="pb-8 lg:pl-6 lg:py-0"
        />
      </div>

      <h1 className="pb-6 text-3xl font-bold text-center align-middle sm:text-5xl lg:text-7xl whitespace-nowrap">
        Terraspaces Appreciation
      </h1>

      <h3 className="flex-shrink-0 pb-8 text-2xl text-center lg:text-4xl">
        <strong>Campaign #2</strong>
      </h3>

      {/* Description */}
      <p className="py-4 text-left lg:text-2xl indent-8 sm:indent-20">
        Terraspaces is an account, project, and website, run by Finn, or @thejamhole on Twitter, that seeks to record,
        organize, label, and provide long-term hosting for the many, many Twitter spaces held by projects and users
        alike throughout the Cosmos &amp; the greater interchain.
      </p>

      {/* <GradientDiv className="py-6" /> */}

      <h3 className="pb-2 text-xl font-normal text-center lg:text-2xl">Specific campaign parameters</h3>

      <div className="flex flex-col pb-6 text-center sm:flex-row">
        <h4 className="px-2 py-1 rounded-md lg:text-xl">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-white">
            <strong>Tiered:</strong> No
          </span>
        </h4>
        <h4 className="px-2 py-1 rounded-md lg:text-xl">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-white">
            <strong>Funding:</strong> -
          </span>
        </h4>
        <h4 className="px-2 py-1 rounded-md lg:text-xl">
          <span className="bg-gradient-to-tr from-[#C32C28] to-[#F5B63B] text-white">
            <strong>Other:</strong> None
          </span>
        </h4>
      </div>

      {/* details */}
      <p className="py-4 text-left lg:text-2xl indent-8 sm:indent-20">
        <strong>Details: </strong> While Spark IBC does not intend to frequently do "appreciation" style campaigns,
        (instead, focusing on enacting change and building cool things,) we thought this was a good exception as we
        prepare a campaign for something much larger, and because Terraspaces is a perfect example of a chain agnostic
        effort, and is exactly the kind of effort that Spark IBC might aim to fund and spin up if it had not already
        been done by Finn.
      </p>

      <p className="py-4 text-left lg:text-2xl indent-8 sm:indent-20">
        While Terraspace was already showing support for the greater Cosmos prior to Terra&apos;s collapse, we feel that
        his commitment to continue providing his services through it all is admirable and deserving of some thanks. Finn
        had come to rely on Terra via grants for his full time income, and so while the crash impacted him directly and
        he still accepts donations and charges for special recording requests, I think many people who host Spaces can
        attest to him showing up regardless 98+% of the time, and it&apos;s that level of commitment to a cause rather
        than just a paycheck that we would love to reward.
      </p>

      <p className="pt-4 pb-8 text-left lg:text-2xl indent-8 sm:indent-20">
        Terraspaces is in no way directly affiliated with Spark IBC and has not even been informed about this campaign
        prior to its release. In fact, a big thank you to a couple of mepbers of our community for shouting this out as
        a campaign idea!
      </p>

      <h3 className="pt-8 pb-8 text-2xl lg:text-4xl">How does this benefit the greater IBC-ecosystem?</h3>

      <p className="text-left lg:text-2xl indent-8 sm:indent-20">
        Between the less than ideal UI/UX on Twitter, and the fact that it only stores recorded spaces for about a month
        after recording, the benefit that Terraspaces has brought the entire Cosmos through the archival of these many,
        amazing conversations, cannot be ignored. In addition, seeing as it started as a Terra-centric project, we are
        extra impressed by the pivot to the greater multichain vision, (especially during such turbulent times) that we
        at Spark IBC aim to support and help build.
      </p>
    </section>
  );
}
