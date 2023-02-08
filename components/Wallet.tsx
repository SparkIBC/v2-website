import {
  ArrowRightOnRectangleIcon as LogoutIcon,
  CheckIcon,
  ClipboardIcon as DuplicateIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, SyntheticEvent } from 'react'
import copy from 'copy-to-clipboard'
import { microAmountMultiplier } from 'util/constants'
import { classNames } from 'util/css'
import { WalletData } from 'client/core/wallet'

const Action = ({
  icon,
  name,
  action,
  active,
}: {
  icon: React.ReactElement<any, any>
  name: string
  action: (e?: SyntheticEvent<Element | Event, Event>) => void
  active?: boolean
}) => (
  <a
    onClick={action}
    data-tip={name}
    className={classNames(
      'cursor-pointer w-7 h-7 rounded p-1.5',
      active
        ? 'dark:bg-primary dark:text-white'
        : 'text-black dark:text-white dark:hover:bg-zinc-900 hover:bg-zinc-200',
    )}
  >
    {icon}
  </a>
)

const Wallet = ({
  wallet,
  handleConnect,
}: {
  wallet: WalletData
  handleConnect: () => Promise<void>
}) => {
  const router = useRouter()
  const [copied, setCopied] = useState<boolean>(false)

  const { address, name, balance } = wallet

  const handleConnectWallet = (
    e: SyntheticEvent<Element | Event, Event> | undefined,
  ) => {
    e?.preventDefault()
    handleConnect()
  }

  const handleCopy = (
    e: SyntheticEvent<Element | Event, Event> | undefined,
  ) => {
    e?.preventDefault()
    copy(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <>
      <Link
        href={process.env.NEXT_PUBLIC_EXPLORER! + '/account/' + wallet.address}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="flex flex-row items-center justify-between px-4 py-3 transition duration-150 ease-in-out border cursor-pointer border-black/10 hover:border-black/50 hover:dark:border-white/50 dark:border-white/10 lg:rounded-lg">
          <div>
            <p className="w-32 text-xs font-semibold truncate">{name}</p>
            <p className="text-xs">
              {new Intl.NumberFormat(`en-US`, {
                style: 'currency',
                currency: 'USD',
              })
                .format(
                  parseFloat(balance?.amount || '0') / microAmountMultiplier,
                )
                .replace('$', '')}{' '}
              USDC
            </p>
          </div>

          <div className="flex flex-row space-x-2">
            <Action
              icon={copied ? <CheckIcon /> : <DuplicateIcon />}
              name={copied ? 'Copied!' : 'Copy Address'}
              action={handleCopy}
            />
            <Action
              icon={<LogoutIcon />}
              name="Disconnect"
              action={handleConnectWallet}
            />
          </div>
        </div>
      </Link>
    </>
  )
}

export default Wallet
