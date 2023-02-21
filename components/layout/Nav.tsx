import { Fragment, useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { Transition, Dialog } from '@headlessui/react';
import { usePathname } from 'next/navigation';

import WalletButton from 'components/layout/WalletButton';

type INavigation = {
  name: string;
  href: string;
  slug?: string;
  isExternal?: boolean;
};

const NAV_ITEMS: INavigation[] = [
  {
    name: 'Earn Spark',
    slug: 'earn',
    href: '/earn'
  },
  {
    name: 'Leaderboard',
    slug: 'leaderboard',
    href: '/leaderboard'
  },
  {
    name: 'About',
    slug: 'about',
    href: '/about'
  }
];

const SECONDARY_NAV_ITEMS: INavigation[] = [
  {
    name: 'InterchainInfo',
    href: 'https://interchaininfo.zone/',
    isExternal: true
  },
  {
    name: 'Airdrops.one',
    href: 'https://airdrops.one/',
    isExternal: true
  }
];

const NavigationItem = ({ name, href, slug = '', isExternal = false }: INavigation) => {
  const path = usePathname();
  const isActive = !isExternal && path!.split('/').includes(slug);

  return (
    <Link href={href} rel={isExternal ? 'noopener noreferrer' : ''} target={isExternal ? '_blank' : ''}>
      <p
        className={cx('cursor-pointer text-xl text-white py-4', {
          'underline underline-offset-2 font-semibold': isActive
        })}
      >
        {name}
      </p>
    </Link>
  );
};

const Nav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderNav = () => (
    <div className="flex flex-col bg-bg px-6 w-full h-full">
      <div className="flex items-center justify-center w-full h-20">
        <img className="w-40 max-w-full" src="/images/sparkibc_title_light_02.svg" alt="SparkIBC" />
      </div>
      <WalletButton />
      <div className="flex flex-col flex-1 mt-1.5 overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item, key) => (
            <NavigationItem key={key} {...item} />
          ))}
        </nav>
      </div>
      <div className="flex flex-col flex-1 mt-1.5 overflow-y-auto">
        <p className="font-semibold text-2xl text-white">
          Built by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spark-orange-dark to-spark-orange">
            Spark
          </span>
        </p>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SECONDARY_NAV_ITEMS.map((item, key) => (
            <NavigationItem key={key} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div>
      {/* DESKTOP NAV */}
      <div className="hidden lg:flex">
        <div className="w-72 fixed inset-y-0">{renderNav()}</div>
      </div>
      {/*  MOBILE NAV*/}
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setIsSidebarOpen}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-bg/50 backdrop-blur-sm fixed inset-0 " />
          </Transition.Child>

          {/* Close button */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed top-4 left-4 z-40 md:right-4 md:left-auto md:-translate-x-56">
              <button
                className="flex justify-center items-center border border-spark-orange rounded-lg w-12 h-12"
                onClick={() => setIsSidebarOpen(false)}
              >
                <img src="/images/icon_close.svg" alt="X" />
              </button>
            </div>
          </Transition.Child>

          {/* Nav items */}
          <div className="fixed right-0 top-0 bottom-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-56">{renderNav()}</Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <button
        className="flex items-center justify-center border border-spark-orange rounded-lg w-12 h-12 fixed bottom-4 right-4 z-30 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <img src="/images/menu.svg" alt="open menu" />
      </button>
    </div>
  );
};

export default Nav;
