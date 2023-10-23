import type { Campaign } from 'types/Funding.types';
import type { SubmitHandler } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

import Button from 'components/Button';
import Fieldset from 'components/Fieldset';

import cx from 'classnames';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { Menu, RadioGroup, Transition } from '@headlessui/react';
import { classNames } from 'util/css';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useChain, useManager } from '@cosmos-kit/react';
import { FundingMessageComposer } from 'types/Funding.message-composer';
import { coin, coins, fromBech32, SigningCosmWasmClient, toBase64, toUtf8 } from 'cosmwasm';
import { useSparkClient, useSwap, useWallet } from 'client';
import { useTx } from 'contexts/tx';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import useToaster, { ToastTypes } from 'hooks/useToaster';
import { useCampaign } from 'contexts/campaign';
import { Token, coins as tokens, nativeCoins, strideCoins, osmosisCoins } from 'config/tokens';
import Spinner from './Spinner';
import { getFastestEndpoint } from '@cosmos-kit/core';
import { chains } from 'chain-registry';
import { Uint53 } from '@cosmjs/math';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';

type Theme = 'light' | 'dark' | 'midnight';

interface FormValues {
  donation: number;
  on_behalf_of?: string;
}

const themes = [
  { name: 'light', bgColor: 'bg-gray-200' },
  { name: 'dark', bgColor: 'bg-gray-700' },
  { name: 'midnight', bgColor: 'bg-black' }
];

export const calculateFee = (denom: string, gas: number) => {
  const gasLimit = Math.round(gas * 1.3);
  const { denom: gasDenom, amount: gasPriceAmount } = GasPrice.fromString(`0.1${denom}`);
  const amount = gasPriceAmount.multiply(new Uint53(gasLimit)).ceil().toString();

  return {
    amount: coins(amount, gasDenom),
    gas: String(gasLimit)
  };
};

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
  }, [campaign, amount, theme, setTheme, rounded, showAbout, defaultTheme, isLoading]);

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
  const { wallet, connect, signingStargateClient } = useWallet();
  const { getWalletRepo } = useManager();

  // const [isValidator, setIsValidator] = useState<boolean>(false);

  const [statusText, setStatusText] = useState<string>();

  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);
  const [selectedTokenList, setSelectedTokenList] = useState<'native' | 'osmosis' | 'stride'>('native');

  const tokenList = useMemo(() => {
    switch (selectedTokenList) {
      case 'native':
        return nativeCoins;
      case 'osmosis':
        return osmosisCoins;
      case 'stride':
        return strideCoins;
    }
  }, [selectedTokenList]);

  const router = useRouter();
  const { tx } = useTx();

  const { findRoute, generateMsgs, broadcastSwap, fetchStatus } = useSwap();

  const toaster = useToaster();

  const [isLoading, _] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isOnBehalf, setIsOnBehalf] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async ({ donation, on_behalf_of }) => {
    if (isLoadingButton) return;
    if (!signingStargateClient || !wallet) return;

    setIsLoadingButton(true);

    console.log(wallet);

    try {
      let broadcastToastId = '';
      broadcastToastId = toaster.toast(
        {
          title: 'Finding swap route...',
          type: ToastTypes.Pending
        },
        { duration: 999999 }
      );

      const route = await findRoute(selectedToken, donation * 1_000_000);
      const chain = chains.find((chain) => chain.chain_id === selectedToken.chain);

      console.log('[ROUTE]', route);

      toaster.dismiss(broadcastToastId);

      if (!route || !chain) {
        toaster.toast({
          title: 'Error',
          dismissable: true,
          message: 'Could not find swap route. Use USDC instead.',
          type: ToastTypes.Error
        });
        setIsLoadingButton(false);
        return;
      }

      const msgs = (await generateMsgs(route)).map((msg) => {
        const messageData = JSON.parse(msg.msg);
        console.log(messageData);
        switch (msg.msgTypeURL) {
          case '/ibc.applications.transfer.v1.MsgTransfer':
            return {
              typeUrl: msg.msgTypeURL,
              value: {
                sourcePort: messageData.source_port,
                sourceChannel: messageData.source_channel,
                token: messageData.token,
                sender: messageData.sender,
                receiver: messageData.receiver,
                timeoutTimestamp: messageData.timeout_timestamp,
                memo: messageData.memo
              }
            };
          case '/cosmwasm.wasm.v1.MsgExecuteContract':
            return {
              typeUrl: msg.msgTypeURL,
              value: MsgExecuteContract.fromPartial({
                sender: messageData.sender,
                contract: messageData.contract,
                funds: messageData.funds,
                msg: toUtf8(JSON.stringify(messageData.msg))
              })
            };
          default:
            throw new Error('Unknown message type: ' + msg.msgTypeURL);
        }
      });

      console.log('[MSGS]', msgs);

      const endpoints = chain?.apis?.rpc?.map((endpoint) => endpoint.address);
      const rpc = await getFastestEndpoint(endpoints as string[], 'rpc');

      const repo = getWalletRepo(chain.chain_name);
      await repo.connect(wallet.name);
      const localWallet = repo.current;
      await localWallet?.initOfflineSigner();

      if (!localWallet || !localWallet.offlineSigner || !localWallet.address)
        throw new Error('Wallet is not connected.');

      const signer = await SigningCosmWasmClient.connectWithSigner(rpc, localWallet.offlineSigner);
      console.log('[SIGNER]', signer);
      const gas = await signer.simulate(localWallet.address, msgs, '');
      console.log('[GAS]', gas);
      const fee = calculateFee(chain.fees?.fee_tokens[0].denom!, gas);
      console.log('[FEE]', fee);

      const signed = await signer.sign(localWallet.address, msgs, fee, '');
      console.log('[SIGNED]', signed);

      const encoded = TxRaw.encode(signed).finish();
      console.log(encoded);
      const base64Signature = toBase64(encoded);

      console.log(base64Signature);

      const response = await broadcastSwap(chain.chain_id, base64Signature);

      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

      setStatusText('Swapping your tokens...');

      while (true) {
        const status = await fetchStatus(chain.chain_id, response.txHash);
        console.log('[STATUS]', status);
        if (status.status === 'STATE_COMPLETED') {
          // Continue case...
          toaster.dismiss(broadcastToastId);
          const fundingMessageComposer = new FundingMessageComposer(
            wallet.address,
            process.env.NEXT_PUBLIC_FUNDING_CONTRACT_ADDRESS!
          );

          const on_behalf_of_address = isOnBehalf ? on_behalf_of : undefined;

          console.log(`/api/isValidator?address=${isOnBehalf ? (on_behalf_of_address as string) : wallet.address}`);

          const isValidator = await fetch(
            `/api/isValidator?address=${isOnBehalf ? (on_behalf_of_address as string) : wallet.address}`
          )
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              console.log(json);
              return json.isValidator;
            });

          const isOrganization = await fetch(
            `/api/isOrganization?address=${isOnBehalf ? (on_behalf_of_address as string) : wallet.address}`
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
            [coin(route.amountOut, process.env.NEXT_PUBLIC_DENOM!)]
          );

          tx([msg], {}, () => router.push('/leaderboard'));
          setStatusText('Processing your donation...');
          break;
        }

        if (status.status === 'STATE_RECEIVED') {
          setStatusText('Tranferring your swapped tokens to Spark...');
          await sleep(2500);
          continue;
        }

        await sleep(2500);
      }
    } catch (e) {
      setIsLoadingButton(false);
      console.error(e);
      throw new Error((e as Error).message);
    }
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
              SparkIBC is powered by{' '}
              <a
                href="https://squidrouter.com"
                rel="noopener noreferrer"
                target="_blank"
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Squid Router
              </a>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <Fieldset id="donation">
              <Menu as="div" className="relative inline-block w-full text-left">
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
                    step={0.1}
                    {...register('donation', { required: true, min: 0 })}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Menu.Button
                      className="flex flex-row items-center p-2 text-sm font-semibold text-white transition duration-75 ease-in-out rounded-md cursor-pointer hover:bg-white/20"
                      id="donation-addon"
                    >
                      <img src={selectedToken.logo} className="w-6 h-6 mr-1.5" />
                      <p>{selectedToken.token}</p>
                      <ChevronDownIcon className="w-5 h-5 ml-1 mt-[1px] text-white" />
                    </Menu.Button>
                  </div>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right divide-y rounded-md shadow-lg w-72 bg-spark-nav ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <RadioGroup value={selectedTokenList} onChange={setSelectedTokenList} className="hidden md:block">
                        <div className="md:p-3 md:pb-0">
                          <RadioGroup.Label className="sr-only">Select a token type</RadioGroup.Label>
                        </div>
                        <div className="flex overflow-hidden">
                          <div className="flex w-full overflow-x-hidden">
                            <div className="grid w-full grid-cols-1 gap-2 px-2 md:grid-cols-3">
                              {['native', 'osmosis', 'stride'].map((type) => (
                                <div key={type}>
                                  <RadioGroup.Option
                                    value={type}
                                    className={({ checked }) =>
                                      cx(
                                        checked ? `bg-spark-orange text-spark-gray h-12` : 'bg-white/10',
                                        'cursor-pointer rounded-md h-8 transition-all w-full duration-150'
                                      )
                                    }
                                  >
                                    {({ checked }) => (
                                      <>
                                        <RadioGroup.Label
                                          as="span"
                                          className={cx('flex items-center text-sm justify-center w-full h-full', {
                                            'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-spark-orange-dark to-spark-orange':
                                              !checked
                                          })}
                                        >
                                          {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </RadioGroup.Label>
                                      </>
                                    )}
                                  </RadioGroup.Option>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                      <div className="mt-2 max-h-[28vh] overflow-y-scroll">
                        {tokenList.map((token) => (
                          <Menu.Item key={token.token}>
                            {({ active }) => (
                              <a
                                onClick={() => setSelectedToken(token)}
                                className={classNames(
                                  active ? 'bg-primary-700 text-gray-100' : 'text-gray-300',
                                  'group flex cursor-pointer items-center font-medium px-4 py-2 text-sm'
                                )}
                              >
                                <img src={token.logo} className="w-6 h-6 mr-1.5" aria-hidden="true" />
                                {token.token}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
                if (!wallet) connect();
              }}
              disabled={isLoadingButton}
              type={wallet ? 'submit' : 'button'}
            >
              {isLoadingButton ? (
                <>
                  <Spinner className="w-4 h-4 text-white" />
                  <p className="text-white">{statusText}</p>
                </>
              ) : wallet ? (
                'Contribute'
              ) : (
                'Connect Wallet'
              )}
            </Button>
            {/* {wallet && (
              <Button
                className="inline-flex items-center justify-center py-3 mt-3 font-semibold text-black bg-gray-200 rounded-full w-f5ull hover:bg-gray-300 dark:bg-white dark:hover:bg-white/80"
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
