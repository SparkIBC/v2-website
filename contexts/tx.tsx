import { createContext, ReactNode, useContext } from 'react';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { isDeliverTxSuccess } from '@cosmjs/stargate';
import { coins } from '@cosmjs/stargate';
import { ArrowTopRightOnSquareIcon as LinkIcon } from '@heroicons/react/24/outline';
import useToaster, { ToastPayload, ToastTypes } from 'hooks/useToaster';
import { useSparkClient, useWallet } from 'client';
import { useChain } from '@cosmos-kit/react';
import { SigningCosmWasmClient } from 'cosmwasm';

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string;
  value: any;
}

export interface TxOptions {
  party?: boolean;
  gas?: number;
  toast?: {
    title?: ToastPayload['title'];
    message?: ToastPayload['message'];
    type?: ToastTypes;
    actions?: JSX.Element;
  };
}

export interface TxContext {
  tx: (msgs: Msg[], options: TxOptions, callback?: (hash: string) => void) => Promise<void>;
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {})
});

export function TxProvider({ children }: { children: ReactNode }) {
  const { wallet, refreshBalance } = useWallet();
  const { client } = useSparkClient();
  const signingCosmWasmClient = client?.signingCosmWasmClient;

  const toaster = useToaster();

  // Method to sign & broadcast transaction
  const tx = async (msgs: Msg[], options: TxOptions, callback?: (hash: string) => void) => {
    // Gas config
    const fee = {
      amount: coins(0, process.env.NEXT_PUBLIC_DEFAULT_GAS_DENOM!),
      gas: options.gas ? String(options.gas) : process.env.NEXT_PUBLIC_DEFAULT_GAS_FEE!
    };

    // Broadcast the redelegation message to Keplr
    let signed;
    try {
      if (wallet?.address) {
        signed = await signingCosmWasmClient?.sign(wallet?.address, msgs, fee, '');
      }
    } catch (e) {
      toaster.toast({
        title: 'Error',
        dismissable: true,
        message: (e as Error).message as string,
        type: ToastTypes.Error
      });
    }

    let broadcastToastId = '';

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending
      },
      { duration: 999999 }
    );

    if (signingCosmWasmClient && signed) {
      await signingCosmWasmClient.broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish())).then((res) => {
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
