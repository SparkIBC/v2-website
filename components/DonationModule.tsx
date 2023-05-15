import type { Campaign } from 'types/Funding.types';
import type { SubmitHandler } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

import Button from 'components/Button';
import Fieldset from 'components/Fieldset';

import { Menu, RadioGroup, Transition } from '@headlessui/react';
import { classNames } from 'util/css';
import React, { Fragment, useMemo, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import { FundingMessageComposer } from 'types/Funding.message-composer';
import { coin, fromBech32, makeSignDoc, makeStdTx, SigningCosmWasmClient, StdFee, toBech32 } from 'cosmwasm';
import { useSparkClient } from 'client';
import { useTx } from 'contexts/tx';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import useToaster, { ToastTypes } from 'hooks/useToaster';
import { useCampaign } from 'contexts/campaign';
import tokens, { Token } from 'config/tokens';
import { CosmosTransaction, RangoClient, TransactionStatus, TransactionType } from 'rango-sdk';
import { isDeliverTxSuccess } from '@cosmjs/stargate';
import Long from 'long';
import Spinner from './Spinner';
import { cosmos } from '@keplr-wallet/cosmos';

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
  const {
    openView,
    wallet,
    address,
    getSigningCosmWasmClient,
    signAmino,
    connect,
    getOfflineSignerAmino,
    isWalletConnected
  } = useChain(process.env.NEXT_PUBLIC_NETWORK!);

  const {
    getSigningCosmWasmClient: osmosis_getSigningCosmWasmClient,
    signAmino: osmosis_signAmino,
    connect: osmosis_connect,
    getOfflineSignerAmino: osmosis_getOfflineSignerAmino,
    isWalletConnected: osmosis_isWalletConnected
  } = useChain('osmosis');
  const {
    getSigningCosmWasmClient: cosmos_getSigningCosmWasmClient,
    signAmino: cosmos_signAmino,
    connect: cosmos_connect,
    getOfflineSignerAmino: cosmos_getOfflineSignerAmino,
    isWalletConnected: cosmos_isWalletConnected,
    address: hub_wallet_test
  } = useChain('cosmoshub');
  const {
    getSigningCosmWasmClient: stargaze_getSigningCosmWasmClient,
    signAmino: stargaze_signAmino,
    connect: stargaze_connect,
    getOfflineSignerAmino: stargaze_getOfflineSignerAmino,
    isWalletConnected: stargaze_isWalletConnected
  } = useChain('stargaze');
  const {
    getSigningCosmWasmClient: akash_getSigningCosmWasmClient,
    signAmino: akash_signAmino,
    connect: akash_connect,
    getOfflineSignerAmino: akash_getOfflineSignerAmino,
    isWalletConnected: akash_isWalletConnected
  } = useChain('akash');

  // const [isValidator, setIsValidator] = useState<boolean>(false);

  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);

  const router = useRouter();
  const { tx } = useTx();
  const toaster = useToaster();

  const [isLoading, _] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isOnBehalf, setIsOnBehalf] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async ({ donation, on_behalf_of }) => {
    if (isLoadingButton) return;

    let donateAmount = donation;

    const signingCosmWasmClient = await getSigningCosmWasmClient();
    if (!signingCosmWasmClient || !address) return;

    if (!selectedToken.locked) {
      const rango = new RangoClient(process.env.NEXT_PUBLIC_RANGO_API_KEY!);

      setIsLoadingButton(true);

      const { data: addressObject } = fromBech32(address);
      const localAddress = toBech32(selectedToken.prefix, addressObject);
      const osmoAddress = toBech32('osmo', addressObject);

      let broadcastToastId = '';

      broadcastToastId = toaster.toast(
        {
          title: 'Finding swap route...',
          type: ToastTypes.Pending
        },
        { duration: 999999 }
      );

      const bestRoute = await rango.getBestRoute({
        amount: String(donation),
        from: { blockchain: selectedToken.chain, symbol: selectedToken.token, address: null },
        to: {
          blockchain: 'OSMOSIS',
          symbol: 'USDC',
          address: 'ibc/d189335c6e4a68b513c10ab227bf1c1d38c746766278ba3eeb4fb14124f1d858'
        },
        checkPrerequisites: true,
        transactionTypes: [TransactionType.COSMOS],
        connectedWallets: [
          { blockchain: selectedToken.chain, addresses: [localAddress] },
          { blockchain: 'OSMOSIS', addresses: [osmoAddress] }
        ],
        selectedWallets: {
          [selectedToken.chain]: localAddress,
          OSMOSIS: osmoAddress
        }
      });

      toaster.dismiss(broadcastToastId);

      console.log(bestRoute);

      if (bestRoute.result?.resultType !== 'OK') {
        toaster.toast({
          title: 'Error',
          dismissable: true,
          message: 'Could not find swap route. Use USDC instead.',
          type: ToastTypes.Error
        });
        return;
      }

      await handleTx(bestRoute.requestId);

      broadcastToastId = toaster.toast(
        {
          title: 'Finding swap route...',
          type: ToastTypes.Pending
        },
        { duration: 999999 }
      );

      const bestRouteToJuno = await rango.getBestRoute({
        amount: String(parseFloat(bestRoute.result.outputAmount) - 0.1),
        from: {
          blockchain: 'OSMOSIS',
          symbol: 'USDC',
          address: 'ibc/d189335c6e4a68b513c10ab227bf1c1d38c746766278ba3eeb4fb14124f1d858'
        },
        to: {
          blockchain: 'JUNO',
          symbol: 'USDC',
          address: 'ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034'
        },
        checkPrerequisites: true,
        transactionTypes: [TransactionType.COSMOS],
        connectedWallets: [
          { blockchain: 'OSMOSIS', addresses: [osmoAddress] },
          { blockchain: 'JUNO', addresses: [address] }
        ],
        selectedWallets: {
          OSMOSIS: osmoAddress,
          JUNO: address
        }
      });

      toaster.dismiss(broadcastToastId);

      if (bestRoute.result?.resultType !== 'OK') {
        toaster.toast({
          title: 'Error',
          dismissable: true,
          message: 'Could not find swap route. Use USDC instead.',
          type: ToastTypes.Error
        });
        return;
      }

      donateAmount = parseFloat(bestRouteToJuno.result?.outputAmount || '0.1') - 0.1;

      console.log(bestRouteToJuno);

      if (bestRouteToJuno.result?.resultType !== 'OK') {
        toaster.toast({
          title: 'Error',
          dismissable: true,
          message: 'Could not find swap route. Use USDC instead.',
          type: ToastTypes.Error
        });
        return;
      }

      await handleTx(bestRouteToJuno.requestId, 1, true);

      async function handleTx(request: string, step: number = 1, feeDouble?: boolean) {
        const tx = await rango.createTransaction({
          requestId: request,
          step,
          userSettings: { slippage: '1' },
          validations: { balance: false, fee: false }
        });

        console.log(tx);

        if (step === 1) {
          toaster.toast({
            title: 'Found swap route. Preparing transaction.',
            dismissable: true,
            type: ToastTypes.Success
          });
        }

        let getChainSpecificSigningCosmWasmClient;
        let getChainSpecificOfflineSignerAmino;
        let chainSpecificSignAmino;
        let chainSpecificConnect;
        let chainSpecificWalletConnected: boolean = false;

        switch ((tx.transaction as CosmosTransaction).blockChain) {
          case 'JUNO':
            getChainSpecificSigningCosmWasmClient = getSigningCosmWasmClient;
            getChainSpecificOfflineSignerAmino = getOfflineSignerAmino;
            chainSpecificSignAmino = signAmino;
            chainSpecificConnect = connect;
            chainSpecificWalletConnected = isWalletConnected;
            break;
          case 'OSMOSIS':
            getChainSpecificSigningCosmWasmClient = osmosis_getSigningCosmWasmClient;
            getChainSpecificOfflineSignerAmino = osmosis_getOfflineSignerAmino;
            chainSpecificSignAmino = osmosis_signAmino;
            chainSpecificConnect = osmosis_connect;
            chainSpecificWalletConnected = osmosis_isWalletConnected;
            break;
          case 'COSMOS':
            getChainSpecificSigningCosmWasmClient = cosmos_getSigningCosmWasmClient;
            getChainSpecificOfflineSignerAmino = cosmos_getOfflineSignerAmino;
            chainSpecificSignAmino = cosmos_signAmino;
            chainSpecificConnect = cosmos_connect;
            chainSpecificWalletConnected = cosmos_isWalletConnected;
            break;
          case 'STARGAZE':
            getChainSpecificSigningCosmWasmClient = stargaze_getSigningCosmWasmClient;
            getChainSpecificOfflineSignerAmino = stargaze_getOfflineSignerAmino;
            chainSpecificSignAmino = stargaze_signAmino;
            chainSpecificConnect = stargaze_connect;
            chainSpecificWalletConnected = stargaze_isWalletConnected;
            break;
          case 'AKASH':
            getChainSpecificSigningCosmWasmClient = akash_getSigningCosmWasmClient;
            getChainSpecificOfflineSignerAmino = akash_getOfflineSignerAmino;
            chainSpecificSignAmino = akash_signAmino;
            chainSpecificConnect = akash_connect;
            chainSpecificWalletConnected = akash_isWalletConnected;
            break;
        }

        console.log(chainSpecificWalletConnected);

        const chainSpecificSigningCosmWasmClient = await (getChainSpecificSigningCosmWasmClient as typeof getSigningCosmWasmClient)();
        const chainSpecificOfflineSignerAmino = (getChainSpecificOfflineSignerAmino as typeof getOfflineSignerAmino)();

        const {
          memo,
          sequence,
          account_number,
          chainId,
          msgs,
          fee,
          signType,
          rpcUrl
        } = (tx.transaction as CosmosTransaction).data;

        function manipulateMsg(m: any): any {
          if (!m.__type) return m;
          if (m.__type === 'DirectCosmosIBCTransferMessage') {
            const result = { ...m } as any;
            if (result.value.timeoutTimestamp)
              result.value.timeoutTimestamp = Long.fromString(result.value.timeoutTimestamp) as any;
            if (!!result.value.timeoutHeight?.revisionHeight)
              result.value.timeoutHeight.revisionHeight = Long.fromString(
                result.value.timeoutHeight.revisionHeight
              ) as any;
            if (!!result.value.timeoutHeight?.revisionNumber)
              result.value.timeoutHeight.revisionNumber = Long.fromString(
                result.value.timeoutHeight.revisionNumber
              ) as any;
            return result;
          }
          return { ...m };
        }

        const msgsWithoutType = msgs.map((m) => ({
          ...manipulateMsg(m),
          __type: undefined
        }));

        const signDoc = makeSignDoc(
          msgsWithoutType as any,
          fee as any,
          chainId as string,
          memo || undefined,
          account_number as number,
          sequence as string
        );

        const signResponse = await (chainSpecificSignAmino as typeof signAmino)(
          (tx.transaction as CosmosTransaction).fromWalletAddress,
          signDoc,
          { disableBalanceCheck: true }
        );

        let signedTx;
        if ((tx.transaction as CosmosTransaction).data.protoMsgs.length > 0) {
          signedTx = cosmos.tx.v1beta1.TxRaw.encode({
            bodyBytes: cosmos.tx.v1beta1.TxBody.encode({
              messages: (tx.transaction as CosmosTransaction).data.protoMsgs.map((m) => ({
                type_url: m.type_url,
                value: new Uint8Array(m.value)
              })),
              memo: signResponse.signed.memo
            }).finish(),
            authInfoBytes: cosmos.tx.v1beta1.AuthInfo.encode({
              signerInfos: [
                {
                  publicKey: {
                    type_url: '/cosmos.crypto.secp256k1.PubKey',
                    value: cosmos.crypto.secp256k1.PubKey.encode({
                      key: Buffer.from(signResponse.signature.pub_key.value, 'base64')
                    }).finish()
                  },
                  modeInfo: {
                    single: {
                      mode: cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
                    }
                  },
                  sequence: Long.fromString(signResponse.signed.sequence)
                }
              ],
              fee: {
                amount: signResponse.signed.fee.amount as any[],
                gasLimit: Long.fromString(
                  String(
                    feeDouble ? parseFloat(signResponse.signed.fee.gas) * 2 : parseFloat(signResponse.signed.fee.gas)
                  )
                )
              }
            }).finish(),
            signatures: [Buffer.from(signResponse.signature.signature, 'base64')]
          }).finish();
        } else {
          signedTx = makeStdTx(signResponse.signed, signResponse.signature);
        }

        const feeArray = !!fee?.amount[0] ? [{ denom: fee.amount[0].denom, amount: fee?.amount[0].amount }] : [];

        // let signed;
        // try {
        //   if (address) {
        //     signed = await chainSpecificSigningCosmWasmClient?.sign(
        //       (tx.transaction as CosmosTransaction).fromWalletAddress,
        //       signedTx,
        //       { gas: '500000', amount: feeArray },
        //       ''
        //     );
        //   }
        // } catch (e) {
        //   toaster.toast({
        //     title: 'Error',
        //     dismissable: true,
        //     message: (e as Error).message as string,
        //     type: ToastTypes.Error
        //   });
        // }

        let broadcastToastId = '';

        broadcastToastId = toaster.toast(
          {
            title: 'Broadcasting transaction...',
            type: ToastTypes.Pending
          },
          { duration: 999999 }
        );

        let hash: string;

        console.log(signedTx);

        await chainSpecificSigningCosmWasmClient.broadcastTx(signedTx as Uint8Array).then((res) => {
          if (isDeliverTxSuccess(res)) hash = res.transactionHash;
          else
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error
            });
        });

        async function checkStatus() {
          const status = await rango.checkStatus({
            requestId: request,
            step,
            txId: hash
          });
          return status;
        }

        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        while (true) {
          const { status } = await checkStatus();
          console.log(status);
          if (status === TransactionStatus.SUCCESS) {
            toaster.dismiss(broadcastToastId);
            if (bestRoute.result?.swaps.length === step) return;
            await handleTx(request, step + 1);
            break;
          } else {
            await sleep(10000);
          }
        }
      }
    }

    const fundingMessageComposer = new FundingMessageComposer(
      address,
      process.env.NEXT_PUBLIC_FUNDING_CONTRACT_ADDRESS!
    );

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
      [coin(donateAmount * 1_000_000, process.env.NEXT_PUBLIC_DENOM!)]
    );

    tx([msg], {}, () => router.push('/leaderboard'));
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
                  <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right divide-y rounded-md shadow-lg bg-spark-nav ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {tokens.map((token) => (
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
                if (!wallet) openView();
              }}
              type={wallet ? 'submit' : 'button'}
            >
              {isLoadingButton ? <Spinner className="w-4 h-4 text-white" /> : wallet ? 'Contribute' : 'Connect Wallet'}
            </Button>
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
