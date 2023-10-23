import Campaign_InterchainInfo from './InterchainInfo';
import Campaign_TerraspacesAppreciation from './TerraspacesAppreciation';
import { Fragment } from 'react';

export interface Campaign {
  name: string;
  description?: string;
  component: () => JSX.Element;
}

const campaigns: Campaign[] = [
  // {
  //   name: 'Interchain Info',
  //   description: 'Making Interchain Exploration Easy',
  //   component: Campaign_InterchainInfo
  // },
  {
    name: 'General Fund',
    description: 'IBC Community Engagement',
    component: () => <Fragment />
  }
  // {
  //   name: 'Terraspaces Appreciation',
  //   description: 'Capturing Discussions in the Cosmos',
  //   component: Campaign_TerraspacesAppreciation
  // }
];

export default campaigns;
