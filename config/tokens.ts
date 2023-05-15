export interface Token {
  chain: string;
  simpleChain: string;
  token: string;
  logo: string;
  prefix: string;
  locked?: boolean;
}

export default [
  {
    chain: 'OSMOSIS',
    simpleChain: 'osmosis',
    token: 'USDC',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/uausdc%20L@3x.png',
    locked: true
  },
  {
    chain: 'COSMOS',
    simpleChain: 'cosmoshub',
    token: 'ATOM',
    prefix: 'cosmos',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png'
  },
  {
    chain: 'OSMOSIS',
    simpleChain: 'osmosis',
    token: 'OSMO',
    prefix: 'osmo',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png'
  },
  {
    chain: 'STARGAZE',
    simpleChain: 'stargaze',
    token: 'STARS',
    prefix: 'stars',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png'
  },
  {
    chain: 'JUNO',
    simpleChain: 'juno',
    token: 'JUNO',
    prefix: 'juno',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png'
  },
  {
    chain: 'AKASH',
    simpleChain: 'akash',
    token: 'AKT',
    prefix: 'akash',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png'
  }
];
