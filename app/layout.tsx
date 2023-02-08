'use client'

import WalletProvider from 'client/react/wallet/WalletProvider'
import { TxProvider } from 'contexts/tx'
import Head from 'next/head'
import { ErrorInfo, Fragment, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { MetaTags, Button, ConnectedWallet } from 'components'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChakraProvider } from '@chakra-ui/react'
import { classNames } from 'util/css'
import { useChain } from '@cosmos-kit/react'
import { defaultTheme } from '@cosmos-kit/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Transition, Dialog } from '@headlessui/react'
import { useSparkClient } from 'client'

import 'animate.css'
import 'styles/globals.css'
import 'react-medium-image-zoom/dist/styles.css'
import { CampaignProvider } from 'contexts/campaign'

interface INavigation {
  name: string
  href: string
  current: boolean
}

function NavigationItem({
  name,
  href,
  current,
  small,
}: INavigation & { small?: boolean }) {
  const isExternalLink = href.includes('https://') || href.includes('http://')
  return (
    <Link
      href={href}
      rel={isExternalLink ? 'noopener noreferrer' : ''}
      target={isExternalLink ? '_blank' : ''}
    >
      <p
        className={classNames(
          current ? 'bg-bg-light' : 'bg-bg hover:bg-bg-light',
          small ? 'text-sm' : 'text-base',
          'px-4 py-2.5 font-medium rounded-md mb-2',
        )}
      >
        {name}
      </p>
    </Link>
  )
}

function Wallet() {
  const { isWalletConnected, connect, disconnect } = useChain(
    process.env.NEXT_PUBLIC_NETWORK!,
  )

  const { client } = useSparkClient()

  return isWalletConnected && client?.wallet ? (
    <div className="mx-2">
      <ConnectedWallet
        wallet={client?.wallet}
        handleConnect={() => disconnect()}
      />
    </div>
  ) : (
    <Button
      className="inline-flex items-center justify-center h-12 mx-2"
      onClick={() => connect()}
    >
      Connect Wallet
    </Button>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const path = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation: INavigation[] = [
    {
      name: 'Earn Spark',
      href: '/earn',
      current: path!.split('/').includes('earn'),
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      current: path!.split('/').includes('leaderboard'),
    },
    {
      name: 'About',
      href: '/about',
      current: path!.split('/').includes('about'),
    },
  ]

  const secondaryNavigation: INavigation[] = [
    {
      name: 'InterchainInfo',
      href: 'https://interchaininfo.zone/',
      current: false,
    },
    {
      name: 'Airdrops.one',
      href: 'https://airdrops.one/',
      current: false,
    },
  ]

  return (
    <html>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <body>
        <Toaster position="top-right" />
        <ChakraProvider theme={defaultTheme}>
          <WalletProvider>
            <CampaignProvider>
              <TxProvider>
                <MetaTags
                  title="SparkIBC"
                  description="Be the spark for..."
                  image=""
                  ogImage=""
                  url="https://sparkibc.zone"
                />
                <main className="w-screen min-h-screen overflow-x-hidden text-white">
                  <div>
                    <Transition.Root show={isSidebarOpen} as={Fragment}>
                      <Dialog
                        as="div"
                        className="relative z-40 md:hidden"
                        onClose={setIsSidebarOpen}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="transition-opacity ease-linear duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition-opacity ease-linear duration-300"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                          <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                          >
                            <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-800">
                              <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <div className="absolute top-0 right-0 pt-2 -mr-12">
                                  <button
                                    type="button"
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                  >
                                    <span className="sr-only">
                                      Close sidebar
                                    </span>
                                    <XMarkIcon
                                      className="w-6 h-6 text-white"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </Transition.Child>
                              <div className="flex items-center flex-shrink-0 px-4">
                                <img
                                  className="w-auto h-8"
                                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                  alt="SparkIBC"
                                />
                              </div>
                              <div className="flex-1 h-0 mt-5 overflow-y-auto">
                                <nav className="px-2">
                                  {navigation.map((item, key) => (
                                    <NavigationItem key={key} {...item} />
                                  ))}
                                </nav>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                          <div
                            className="flex-shrink-0 w-14"
                            aria-hidden="true"
                          >
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>
                    <nav className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                      <div className="flex flex-col flex-1 min-h-0 px-2 bg-bg">
                        <div className="flex items-center flex-shrink-0 h-16 px-6 mt-4 mb-2">
                          <img
                            className="w-auto h-8"
                            src="/images/sparkibc_title_light_simp.svg"
                            alt="SparkIBC"
                          />
                        </div>
                        <Wallet />
                        <div className="flex flex-col flex-1 mt-1.5 overflow-y-auto">
                          <nav className="flex-1 px-3 py-4 space-y-1">
                            {navigation.map((item, key) => (
                              <NavigationItem key={key} {...item} />
                            ))}
                          </nav>
                        </div>
                        <div className="flex flex-col flex-1 mt-1.5 overflow-y-auto">
                          <p className="px-3 font-semibold text-white">
                            Built by <span className="text-primary">Spark</span>
                          </p>
                          <nav className="flex-1 px-3 py-4 space-y-1">
                            {secondaryNavigation.map((item, key) => (
                              <NavigationItem key={key} {...item} small />
                            ))}
                          </nav>
                        </div>
                      </div>
                    </nav>
                    <div className="md:pl-64">{children}</div>
                  </div>
                </main>
              </TxProvider>
            </CampaignProvider>
          </WalletProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}

RootLayout.componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
  console.error(error, errorInfo)
}
