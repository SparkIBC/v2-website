const ITEMS = [
  {
    title: 'Staking Solutions',
    logo: '/images/products/staking_solutions.png',
    href: 'https://interchaininfo.zone/staking'
  },
  { title: 'Interchain Info', logo: '/images/products/interchain_info.png', href: 'https://interchaininfo.zone' },
  { title: 'Airdrops One', logo: '/images/products/airdrops.png', href: 'https://airdrops.one' }
];

const Products = () => {
  return (
    <div className="flex flex-col text-center text-white gap-7">
      <h2 className="text-2xl font-semibold md:text-4xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-t from-spark-orange-dark to-spark-orange">
          Sparks
        </span>{' '}
        across the Cosmos
      </h2>
      <p className="text-base md:text-lg">
        In addition to the Spark IBC platform, the Spark family also includes a number of other products in the
        interchain.
      </p>
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        {ITEMS.map((item, index) => (
          <a
            href={item.href}
            rel="noopener noreferrer"
            target="_blank"
            key={index}
            className="grow bg-gradient-to-bl from-spark-orange to-red-orange rounded-lg text-spark-lightergray p-0.5 w-full max-w-[300px] h-[350px] lg:basis-0"
          >
            <div className="group cursor-pointer bg-[#070707] rounded-lg overflow-hidden w-full h-full relative">
              <div className="bg-[#41311F]/40 opacity-0 absolute inset-0 transition-all duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-11">
                <div>
                  <img src={item.logo} alt={item.title} />
                </div>
                <div className="text-3xl font-bold">{item.title}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Products;
