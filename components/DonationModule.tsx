import type { Campaign } from 'types/Funding.types';
import type { SubmitHandler } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

import Button from 'components/Button';
import Fieldset from 'components/Fieldset';

import { RadioGroup } from '@headlessui/react';
import { classNames } from 'util/css';
import React, { useMemo, useState } from 'react';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import { FundingMessageComposer } from 'types/Funding.message-composer';
import { coin, fromBech32 } from 'cosmwasm';
import { useSparkClient } from 'client';
import { useTx } from 'contexts/tx';
import { XMarkIcon } from '@heroicons/react/20/solid';
import useToaster, { ToastTypes } from 'hooks/useToaster';
import { useCampaign } from 'contexts/campaign';
import Guard, { WalletType } from '@swiftprotocol/guard';

type Theme = 'light' | 'dark' | 'midnight';

interface FormValues {
  donation: number;
  on_behalf_of?: string;
  email?: string;
}

const themes = [
  { name: 'light', bgColor: 'bg-gray-200' },
  { name: 'dark', bgColor: 'bg-gray-700' },
  { name: 'midnight', bgColor: 'bg-black' }
];

export interface IDonate {
  amount?: number; // amount to donate
  theme?: Theme; // theme to use, if none show selector
  showAbout?: boolean; // show about button
  rounded?: boolean; // is rounded?
}

export default function Donate({ amount, theme: defaultTheme, showAbout, rounded }: IDonate) {
  const [theme, setTheme] = useState<Theme>(defaultTheme || 'midnight');

  const { campaign } = useCampaign();
  const { client } = useSparkClient();

  const [campaignData, setCampaignData] = useState<Campaign>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _render = useMemo(() => {
    return isLoading ? (
      <Loading />
    ) : (
      <DonationModule
        campaignName={campaign.name === 'General Fund' ? undefined : campaign.name}
        amount={amount}
        theme={theme}
        setTheme={setTheme}
        rounded={rounded ?? false}
        showAbout={showAbout ?? true}
        showTheme={!!defaultTheme}
      />
    );
  }, [campaign, amount, theme, setTheme, rounded, showAbout, defaultTheme]);

  return (
    <div
      className={classNames(
        theme === 'midnight' && 'bg-black dark',
        theme === 'dark' && 'bg-gray-900 dark',
        theme === 'light' && 'bg-white'
      )}
    >
      {_render}
    </div>
  );
}

const Loading = () => (
  <div className="flex items-center justify-center h-full">
    <img src="/images/Logo.svg" className="w-16 h-16 animate-spin" />
  </div>
);

interface IDonationModule {
  campaignName?: string;
  amount: any;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  showAbout: boolean;
  showTheme: boolean;
  rounded: boolean;
}

const DonationModule = ({ campaignName, amount, theme, setTheme, showAbout, showTheme, rounded }: IDonationModule) => {
  const { handleSubmit, register } = useForm<FormValues>();
  const { openView, wallet, address, getSigningCosmWasmClient } = useChain(process.env.NEXT_PUBLIC_NETWORK!);
  const { client, status } = useWalletClient();
  // const [isValidator, setIsValidator] = useState<boolean>(false);

  const router = useRouter();
  const { tx } = useTx();
  const toaster = useToaster();

  const [isLoading, _] = useState<boolean>(false);
  const [isOnBehalf, setIsOnBehalf] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async ({ donation, on_behalf_of, email }) => {
    const signingCosmWasmClient = await getSigningCosmWasmClient();

    if (!signingCosmWasmClient || !address) return;

    const fundingMessageComposer = new FundingMessageComposer(
      address,
      process.env.NEXT_PUBLIC_FUNDING_CONTRACT_ADDRESS!
    );

    if (email && wallet) {
      console.log(client);
      console.log(status);

      const guard = new Guard({
        wallet: wallet?.name!.split('-')[0]! as WalletType,
        api: process.env.NEXT_PUBLIC_GUARD_API!
        // account: {
        //   hexPubKey,
        //   address
        // },
        // walletMethods: {
        //   signArbitrary: client.signArbitrary!
        // }
      });

      await guard.put('email', email);
      await guard.notifyAuthorize('sparkibc');
    }

    const on_behalf_of_address = isOnBehalf ? on_behalf_of : undefined;

    console.log(`/api/isValidator?address=${isOnBehalf ? (on_behalf_of_address as string) : address}`);

    const isValidator = await fetch(
      `/api/isValidator?address=${isOnBehalf ? (on_behalf_of_address as string) : address}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        return json.isValidator;
      });

    const isOrganization = await fetch(
      `/api/isOrganization?address=${isOnBehalf ? (on_behalf_of_address as string) : address}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        return json.isOrganization;
      });

    if (!!on_behalf_of_address)
      try {
        fromBech32(on_behalf_of_address);
      } catch {
        return toaster.toast({
          title: 'Error',
          dismissable: true,
          message: 'Invalid address',
          type: ToastTypes.Error
        });
      }

    const msg = fundingMessageComposer.fund(
      {
        campaign_name: campaignName,
        donor_address_type: isValidator ? 'Validator' : isOrganization ? 'Organization' : 'Private',
        on_behalf_of
      },
      [coin(donation * 1_000_000, process.env.NEXT_PUBLIC_DENOM!)]
    );

    tx([msg], {}, (hash) => {
      if (email) fetch(`/api/notify?tx=${hash}`);
      router.push('/leaderboard');
    });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={classNames(rounded && 'rounded-b-lg', 'mx-auto h-full max-w-full')}>
      <div className="px-4 pb-8 border-t-4 border-primary">
        <div className="flex flex-row items-center justify-between w-full px-2 pb-3 mt-4">
          <img src="/images/Logo.svg" className="w-8 h-8" />
          {showAbout && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://sparkibc.zone/about"
              className="flex flex-row items-center space-x-2 text-sm font-medium cursor-pointer text-white/50 hover:text-white/75"
            >
              <InformationCircleIcon className="w-5 h-5" />
              <p>About SparkIBC</p>
            </a>
          )}
        </div>
        <div className="flex flex-col lg:mt-6">
          {showTheme && (
            <RadioGroup
              value={themes.find(({ name }) => name === theme)}
              onChange={({ name }: { name: string }) => setTheme(name as Theme)}
            >
              <RadioGroup.Label as="span" className="sr-only">
                Choose a theme
              </RadioGroup.Label>
              <div className="flex items-center mt-2 space-x-3">
                {themes.map((theme) => (
                  <RadioGroup.Option
                    key={theme.name}
                    value={theme}
                    className={({ active, checked }) =>
                      classNames(
                        'ring-primary',
                        active && checked ? 'ring ring-offset-1' : '',
                        !active && checked ? 'ring-2' : '',
                        '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                      )
                    }
                  >
                    <RadioGroup.Label as="span" className="sr-only">
                      {theme.name}
                    </RadioGroup.Label>
                    <span
                      aria-hidden="true"
                      className={classNames(theme.bgColor, 'h-6 w-6 borderborder-white border-opacity-25 rounded-full')}
                    />
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
          <p className="mt-6 text-xs font-semibold text-primary-500">FUND</p>
          <p className="text-3xl font-semibold text-white">
            <span className="capitalize">{campaignName || 'General Fund'}</span>
          </p>
          <p className="mt-3 text-sm font-medium text-white">
            100% of your contribution goes towards the <span className="capitalize">{campaignName || 'SparkIBC'}</span>{' '}
            campaign.
          </p>
          <div className="flex flex-row items-center px-4 py-2.5 text-sm font-medium text-white lg:mt-4">
            <InformationCircleIcon className="w-5 h-5 mr-3 text-white" />
            <p>
              SparkIBC only supports axlUSDC.{' '}
              <a
                href="https://app.rango.exchange/swap/OSMOSIS.OSMO/JUNO.USDC--ibc%2Feac38d55372f38f1afd68df7fe9ef762dcf69f26520643cf3f9d292a738d8034/"
                rel="noopener noreferrer"
                target="_blank"
                className="underline text-primary hover:text-primary/80 hover:decoration-transparent"
              >
                Swap
              </a>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <Fieldset id="donation">
              <div className="relative rounded-md shadow-sm">
                <input
                  className={classNames(
                    theme === 'midnight' && 'bg-black text-white',
                    theme === 'dark' && 'bg-gray-900 text-white',
                    theme === 'light' && 'bg-white text-black',
                    'block w-full font-semibold h-14 pl-6 pr-20 rounded-xl shadow-sm sm:text-base placeholder:text-white/25 border-white/25'
                  )}
                  id="donation"
                  type="number"
                  placeholder="Amount to contribute..."
                  defaultValue={amount}
                  autoFocus
                  {...register('donation', { required: true, min: 0 })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span
                    className="flex flex-row items-center pr-2 text-sm font-semibold text-white"
                    id="donation-addon"
                  >
                    <img
                      src="https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/uausdc%20L@3x.png"
                      className="w-6 h-6 mr-1.5"
                    />
                    <p>USDC</p>
                  </span>
                </div>
              </div>
            </Fieldset>
            <Fieldset id="email">
              <div className="flex flex-row items-center mt-3">
                <div className="relative w-full rounded-md shadow-sm">
                  <input
                    className={classNames(
                      theme === 'midnight' && 'bg-black text-white',
                      theme === 'dark' && 'bg-gray-900 text-white',
                      theme === 'light' && 'bg-white text-black',
                      'block w-full font-semibold placeholder:text-sm h-10 pl-6 pr-20 rounded-xl shadow-sm sm:text-base placeholder:text-white/25 border-white/25'
                    )}
                    id="email"
                    type="email"
                    placeholder="Your email, to send you a receipt (optional)"
                    autoFocus
                    {...register('email', { required: true })}
                  />
                </div>
              </div>
            </Fieldset>
            <Fieldset id="on_behalf_of">
              {isOnBehalf ? (
                <div className="flex flex-row items-center mt-3">
                  <div className="relative w-full rounded-md shadow-sm">
                    <input
                      className={classNames(
                        theme === 'midnight' && 'bg-black text-white',
                        theme === 'dark' && 'bg-gray-900 text-white',
                        theme === 'light' && 'bg-white text-black',
                        'block w-full font-semibold placeholder:text-sm h-10 pl-6 pr-20 rounded-xl shadow-sm sm:text-base placeholder:text-white/25 border-white/25'
                      )}
                      id="on_behalf_of"
                      type="text"
                      placeholder="Address to contribute on behalf of..."
                      autoFocus
                      {...register('on_behalf_of', { required: true })}
                    />
                  </div>
                  <a className="px-2 cursor-pointer" onClick={() => setIsOnBehalf(false)}>
                    <XMarkIcon className="w-5 h-5 text-primary hover:text-primary/80" />
                  </a>
                </div>
              ) : (
                <Button
                  className="inline-flex items-center justify-center w-full h-10 py-3 mt-3 font-semibold text-black bg-white rounded-full hover:bg-white/80"
                  variant="primary"
                  onClick={() => setIsOnBehalf(true)}
                >
                  Donate on behalf of someone else
                </Button>
              )}
            </Fieldset>
            {/* <div className="flex justify-end mt-3 mb-2">
            <Switch.Group as="div" className="flex items-center">
              <Switch
                checked={isValidator}
                onChange={setIsValidator}
                className={classNames(
                  isValidator ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-offset-gray-900 focus:ring-offset-2',
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    isValidator ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  )}
                />
              </Switch>
              <Switch.Label as="span" className="ml-3">
                <span className="text-sm font-semibold text-black dark:text-white">
                  Validator donation
                </span>
              </Switch.Label>
            </Switch.Group>
          </div> */}
            <Button
              className="inline-flex items-center justify-center w-full py-5 mt-3 text-black rounded-full"
              variant="primary"
              onClick={() => {
                if (!wallet) openView();
              }}
              type={wallet ? 'submit' : 'button'}
            >
              {wallet ? 'Contribute' : 'Connect Wallet'}
            </Button>
            <p className="max-w-sm mx-auto mt-2 text-xs text-center text-white/75">
              If you choose to provide an email address, it will be encrypted and stored with Swift Guard. SparkIBC will
              never have access to your unencrypted email. By providing your email address, you consent to receiving
              reciepts for your transactions with SparkIBC.
            </p>
            {/* {wallet && (
              <Button
                className="inline-flex items-center justify-center w-full py-3 mt-3 font-semibold text-black bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-white dark:hover:bg-white/80"
                variant="primary"
                onClick={() => {
                  disconnect()
                }}
              >
                Disconnect wallet
              </Button>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
};
