export interface Token {
  chain: string;
  denom: string;
  token: string;
  logo: string;
  prefix: string;
}

const nativeCoins: Token[] = [
  {
    chain: 'noble-1',
    denom: 'uusdc',
    token: 'Noble USDC',
    prefix: 'noble',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/USDCoin.svg'
  },
  {
    chain: 'migaloo-1',
    denom: 'ibc/BC5C0BAFD19A5E4133FDA0F3E04AE1FBEE75A4A226554B2CBB021089FF2E1F8A',
    token: 'Noble USDC (Migaloo)',
    prefix: 'migaloo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/USDCoin.svg'
  },
  {
    chain: 'axelar-1',
    denom: 'uusdc',
    token: 'axlUSDC',
    prefix: 'axelar',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/uausdc%20L@3x.png'
  },
  {
    chain: 'juno-1',
    denom: 'ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034',
    token: 'axlUSDC (Juno)',
    prefix: 'juno',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/uausdc%20L@3x.png'
  },
  {
    chain: 'cosmoshub-4',
    denom: 'uatom',
    token: 'ATOM',
    prefix: 'cosmos',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'uosmo',
    token: 'OSMO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png'
  },
  {
    chain: 'stargaze-1',
    denom: 'ustars',
    token: 'STARS',
    prefix: 'stars',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png'
  },
  {
    chain: 'juno-1',
    denom: 'ujuno',
    token: 'JUNO',
    prefix: 'juno',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png'
  },
  {
    chain: 'akashnet-2',
    denom: 'uakt',
    token: 'AKT',
    prefix: 'akash',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png'
  },
  {
    chain: 'migaloo-1',
    denom: 'uwhale',
    token: 'WHALE',
    prefix: 'migaloo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.png'
  },
  {
    chain: 'phoenix-1',
    denom: 'uluna',
    token: 'LUNA',
    prefix: 'terra',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/luna.svg'
  },
  {
    chain: 'stride-1',
    denom: 'ustrd',
    token: 'STRD',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.svg'
  }
];

const osmosisCoins: Token[] = [
  {
    chain: 'osmosis-1',
    denom: 'ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858',
    token: 'axlUSDC',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/uausdc%20L@3x.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
    token: 'ATOM',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/C140AFD542AE77BD7DCC83F13FDD8C5E5BB8C4929785E6EC2F4C636F98F17901',
    token: 'stATOM',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/statom.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'uosmo',
    token: 'OSMO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/D176154B0C63D1F9C6DCFB4F70349EBF2E2B5A87A05902F57A6AE92B863E9AEC',
    token: 'stOSMO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stosmo.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
    token: 'STARS',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/5DD1F95ED336014D00CE2520977EC71566D282F9749170ADC83A392E0EA7426A',
    token: 'stSTARS',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/ststars.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
    token: 'JUNO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/84502A75BCA4A5F68D464C00B3F610CE2585847D59B52E5FFB7C3C9D2DDCD3FE',
    token: 'stJUNO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stjuno.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
    token: 'AKT',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/6AE98883D4D5D5FF9E50D7130F1305DA2FFA0C652D1DD9C123657C6B4EB2DF8A',
    token: 'EVMOS',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/C5579A9595790017C600DD726276D978B9BF314CF82406CE342720A9C7911A01',
    token: 'stEVMOS',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stevmos.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
    token: 'INJ',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/injective/images/inj.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/EDD6F0D66BCD49C1084FB2C35353B4ACD7B9191117CE63671B61320548F7C89D',
    token: 'WHALE',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.png'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/785AFEC6B3741100D15E7AF01374E3C4C36F24888E96479B1C33F5C71F364EF9',
    token: 'LUNA',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/luna.svg'
  },
  {
    chain: 'osmosis-1',
    denom: 'ibc/C491E7582E94AE921F6A029790083CDE1106C28F3F6C4AD7F1340544C13EC372',
    token: 'stLUNA',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stluna.svg'
  }
];

const strideCoins: Token[] = [
  {
    chain: 'stride-1',
    denom: 'ustrd',
    token: 'STRD',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stuamo',
    token: 'stATOM',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/statom.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stuosmo',
    token: 'stOSMO',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stosmo.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stustars',
    token: 'stSTARS',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/ststars.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stujuno',
    token: 'stJUNO',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stjuno.svg'
  },
  {
    chain: 'stride-1',
    denom: 'staevmos',
    token: 'stEVMOS',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stevmos.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stinj',
    token: 'stINJ',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stinj.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stuluna',
    token: 'stLUNA',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stluna.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stuumee',
    token: 'stUMEE',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stumee.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stucmdx',
    token: 'stCMDX',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stcmdx.svg'
  },
  {
    chain: 'stride-1',
    denom: 'stusomm',
    token: 'stSOMM',
    prefix: 'stride',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stsomm.svg'
  }
];

const coins = [...nativeCoins, ...osmosisCoins, ...strideCoins];

export { coins, nativeCoins, osmosisCoins, strideCoins };
