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
    <div className="flex flex-col w-full h-full px-6 bg-bg/40 backdrop-blur lg:bg-bg z-[100]">
      <div className="flex items-center justify-center w-full h-20">
        <Link href="/">
          <img className="flex-shrink-0 w-40 max-w-full" src="/images/sparkibc_title_light_02.svg" alt="SparkIBC" />
        </Link>
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
        <p className="text-2xl font-semibold text-white">
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
        <div className="fixed inset-y-0 w-72">{renderNav()}</div>
      </div>
      {/*  MOBILE NAV*/}
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={() => {}}>
          {/* Overlay */}
          <div className="fixed inset-0 bg-transparent " onClick={() => setIsSidebarOpen(false)} />
          {/* Nav items */}
          <div className="fixed top-0 bottom-0 right-0 z-40 flex">
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
        className="fixed z-50 flex items-center justify-center w-12 h-12 border rounded-lg bg-bg border-spark-orange bottom-4 right-4 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <img src={isSidebarOpen ? '/images/icon_close.svg' : '/images/menu.svg'} alt="open menu" />
      </button>
    </div>
  );
};

export default Nav;
