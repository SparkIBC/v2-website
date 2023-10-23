import { createContext, ReactNode, useContext } from 'react';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { isDeliverTxSuccess } from '@cosmjs/stargate';
import { SigningStargateClient, coins } from '@cosmjs/stargate';
import { ArrowTopRightOnSquareIcon as LinkIcon } from '@heroicons/react/24/outline';
import useToaster, { ToastPayload, ToastTypes } from 'hooks/useToaster';
import { useSparkClient, useWallet } from 'client';
import { chains } from 'chain-registry';
import { fromBech32, SigningCosmWasmClient, toBech32 } from 'cosmwasm';

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string;
  value: any;
}

export interface TxOptions {
  party?: boolean;
  gas?: string;
  gasAmount?: number;
  gasDenom?: string;
  memo?: string;
  signingStargateClient?: SigningStargateClient;
  signingCosmWasmClient?: SigningCosmWasmClient;
  toast?: {
    title?: ToastPayload['title'];
    message?: ToastPayload['message'];
    type?: ToastTypes;
    actions?: JSX.Element;
  };
}

export interface TxContext {
  tx: (msgs: Msg[] | TxRaw, options: TxOptions, callback?: (hash: string) => void) => Promise<void>;
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {})
});

export function TxProvider({ children }: { children: ReactNode }) {
  const { wallet, refreshBalance } = useWallet();
  const { client } = useSparkClient();

  const toaster = useToaster();

  // Method to sign & broadcast transaction
  const tx = async (msgs: Msg[] | TxRaw, options: TxOptions, callback?: (hash: string) => void) => {
    const signingClient =
      options.signingStargateClient || options.signingCosmWasmClient || client?.signingCosmWasmClient;
    // Gas config
    const fee = {
      amount: coins(options.gasAmount || 0, options.gasDenom || process.env.NEXT_PUBLIC_DEFAULT_GAS_DENOM!),
      gas: options.gas || process.env.NEXT_PUBLIC_DEFAULT_GAS_FEE!
    };

    let signed;
    let broadcastToastId = '';

    if (msgs instanceof Array) {
      // Broadcast the redelegation message to Keplr
      try {
        if (wallet?.address) {
          const chainId = await signingClient?.getChainId();
          const chain = chains.find((chain) => chain.chain_id === chainId);
          if (!chain) throw new Error('Could not find chain ' + chainId);

          const localAddress = toBech32(chain.bech32_prefix, fromBech32(wallet.address).data);
          signed = await signingClient?.sign(localAddress, msgs, fee, options.memo || '');
        }
      } catch (e) {
        toaster.toast({
          title: 'Error',
          dismissable: true,
          message: (e as Error).message as string,
          type: ToastTypes.Error
        });
        throw e;
      }

      broadcastToastId = toaster.toast(
        {
          title: 'Broadcasting transaction...',
          type: ToastTypes.Pending
        },
        { duration: 999999 }
      );
    } else {
      signed = msgs;
    }

    if (signingClient && signed) {
      await signingClient.broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish())).then((res: any) => {
        toaster.dismiss(broadcastToastId);
        if (isDeliverTxSuccess(res)) {
          // Run callback
          if (callback) callback(res.transactionHash);

          // Refresh balance
          refreshBalance();

          toaster.toast({
            title: options.toast?.title || 'Transaction Successful',
            type: options.toast?.type || ToastTypes.Success,
            dismissable: true,
            actions: options.toast?.actions || <></>,
            message: options.toast?.message || (
              <>
                View{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_EXPLORER!}/tx/${res.transactionHash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline"
                >
                  transaction in explorer <LinkIcon className="inline w-3 h-3 text-gray-400 hover:text-gray-500" />
                </a>
                .
              </>
            )
          });
        } else {
          toaster.toast({
            title: 'Error',
            message: res.rawLog,
            type: ToastTypes.Error
          });
        }
      });
    } else {
      toaster.dismiss(broadcastToastId);
    }
  };

  return <Tx.Provider value={{ tx }}>{children}</Tx.Provider>;
}

export const useTx = (): TxContext => useContext(Tx);
