'use client';

import WalletProvider from 'client/react/wallet/WalletProvider';
import { TxProvider } from 'contexts/tx';
import Head from 'next/head';
import { ErrorInfo } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '@cosmos-kit/react';

import 'animate.css';
import 'styles/globals.css';
import 'react-medium-image-zoom/dist/styles.css';
import { CampaignProvider } from 'contexts/campaign';
import { DonorProvider } from 'contexts/donor';

import { MetaTags } from 'components';
import Nav from 'components/layout/Nav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <Head>
        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1, user-scalable=no" />
      </Head>
      <body>
        <Toaster position="top-right" />
        <ChakraProvider theme={defaultTheme}>
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
                  <main className="w-screen min-h-screen overflow-x-hidden text-white relative bg-[length:100%_auto] bg-[url('/images/bg-mobile.png')] bg-fixed md:bg-[url('/images/bg-tablet.png')] lg:bg-[url('/images/bg-desktop.png')]">
                    <div>
                      <div className="flex justify-center bg-bg py-4 w-full h-20 absolute z-10 lg:hidden">
                        <img className="h-full" src="/images/sparkibc_title_light_02.svg" alt="SparkIBC" />
                      </div>
                      <Nav />
                      <div className="lg:pl-72">{children}</div>
                    </div>
                  </main>
                </TxProvider>
              </DonorProvider>
            </CampaignProvider>
          </WalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

RootLayout.componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
  console.error(error, errorInfo);
};
