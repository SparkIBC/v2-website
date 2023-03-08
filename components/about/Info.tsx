import InfoBox from 'components/about/InfoBox';

const INFO_BOXES = [
  {
    title: 'Spark Score/Points',
    content: (
      <>
        <div>
          When users contribute to the general fund or any active Campaign, SPARK tokens are minted into their wallet at
          a 1:1 ratio with the USD value of their donation. Spark is a non-transferable CW20 token on Juno Network,
          SPARK should not be thought of as a traditional cryptocurrency, but rather an immutable points system. While
          these tokens have no monetary value, they act as an immutable and reliable metric of how much a given on-chain
          address has given back to the IBC ecosystem. In addition, Spark will continually work to reward users for
          their Spark Score in non-monetary ways.
        </div>
        <div>
          Our <strong>leaderboard</strong> serves to provide some fun competition and customization options, as well as
          provide a place where you can check on validators & other entities to how much they've contributed to the
          future of the interchain! Beyond that, we're working to integrate SPARK points into various protocols and
          platforms, built by both us and others, to bring contributors fun perks across the interchain.
        </div>
        <div>
          Spark tokens can only be <strong>minted</strong> in one of two ways:
          <ul>
            <li>
              Stablecoin contributions through Spark IBC funding contracts. Currently <strong>axlUSDC</strong> is
              supported.
            </li>
            <li>
              Through 3/5 vote from the general fund. This is primarily used to award points to off-chain contributions,
              such as token allocations from community pools, as we don't feel that market conditions and slippage are
              within the contributors control in some cases, and hence, shouldn't be penalized.
            </li>
          </ul>
        </div>
      </>
    )
  },
  {
    title: 'Campaigns',
    content: (
      <>
        <div>
          <strong>For users</strong>
          <p>
            Campaigns are the primary way users can help support multi-chain efforts and earn Spark Points in the
            process. Spark Campaigns are project or effort specific contribution channels that can run indefinitely or
            for limited time periods. Some campaigns will come with specific parameters, funding targets, and other
            details than can be found by scrolling down on our homepage with the correct campaign selected in the top
            bar.
          </p>
        </div>
        <div>
          As with the General Fund, user contributions are awarded Spark Points on a 1:1 basis with the USD value of
          their contribution.
        </div>
        <div>
          <strong>For projects</strong>
          <p>
            If you're a chain-agnostic web3 project, Spark Campaigns can be a phenomenal way to kickstart both your
            funding, as well as your community & userbase. Finding funding & support for truly multi-chain projects can
            be difficult, but we don't think it has to be that way.
          </p>
        </div>
        <div>
          In addition to contributions through the Spark IBC platform, we can help support your project in a number of
          other ways, including:
        </div>
        <ul>
          <li>Multi-chain community pool funding</li>
          <li>Grant acquisition</li>
          <li>Business development services</li>
          <li>Marketing</li>
          <li>And more!</li>
        </ul>
        <div>
          To get started, head over to our{' '}
          <a href="https://discord.gg/B4d2YTZpnz" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          , and check out either the “Brainstorming” or “Campaign Proposals” channels depending on where you're at in
          your projects life cycle.
        </div>
      </>
    )
  },
  {
    title: 'General Fund',
    isDefaultOpen: true,
    content: (
      <>
        <div>
          The Spark IBC General Fund is a contribution channel that is open at all times and serves as a general source
          of funds for the Spark team and its community. While this is not a DAO, and users are not able to directly
          vote on the usage of the funds, Spark IBC will always see itself as working for the community, and as such, we
          will always be open to suggestions and ideas from our users.
        </div>
        <div>
          Check out the #general-fund-discussion channel in our Discord to become part of the process! Some uses for the
          General Fund include, but are not limited to:
        </div>
        <ul>
          <li>Small community contests</li>
          <li>Subsidizing (certain) campaigns that fall short (within 10%) of funding goals</li>
          <li>Compensating Spark IBC volunteer work</li>
          <li>Hack & Exploit remittance</li>
          <li>Spark IBC product upkeep & development</li>
          <li>Minor infrastructure incentives (e.g. buying a deserving validator better hardware)</li>
          <li>Incentivizing campaigns & other efforts</li>
        </ul>
      </>
    )
  }
];

const Info = () => {
  return (
    <div className="flex flex-col w-full gap-7">
      {INFO_BOXES.map((info, index) => (
        <InfoBox key={index} title={info.title} isDefaultOpen={info.isDefaultOpen}>
          {info.content}
        </InfoBox>
      ))}
    </div>
  );
};

export default Info;
