'use client';

import WalletProvider from 'client/react/wallet/WalletProvider';
import { TxProvider } from 'contexts/tx';
import { ErrorInfo } from 'react';
import { Toaster } from 'react-hot-toast';

import 'animate.css';
import 'styles/globals.css';
import 'react-medium-image-zoom/dist/styles.css';
import '@interchain-ui/react/styles';

import { CampaignProvider } from 'contexts/campaign';
import { DonorProvider } from 'contexts/donor';

import { MetaTags } from 'components';
import Nav from 'components/layout/Nav';
import { SwapProvider } from 'client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Toaster position="top-right" />
        <WalletProvider>
          <CampaignProvider>
            <DonorProvider>
              <TxProvider>
                <MetaTags
                  title="SparkIBC"
                  description="Be the spark for..."
                  image=""
                  ogImage=""
                  url="https://sparkibc.zone"
                />
                <SwapProvider>
                  <main className="w-screen min-h-screen overflow-x-hidden text-white relative bg-[length:100%_auto] bg-[url('/images/bg-mobile.png')] bg-fixed md:bg-[url('/images/bg-tablet.png')] lg:bg-[url('/images/bg-desktop.png')]">
                    <div>
                      <div className="absolute z-10 flex justify-center w-full h-20 py-4 bg-bg lg:hidden">
                        <img className="h-full" src="/images/sparkibc_title_light_02.svg" alt="SparkIBC" />
                      </div>
                      <Nav />
                      <div className="lg:pl-72">{children}</div>
                    </div>
                  </main>
                </SwapProvider>
              </TxProvider>
            </DonorProvider>
          </CampaignProvider>
        </WalletProvider>
      </body>
    </html>
  );
}

RootLayout.componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
  console.error(error, errorInfo);
};
