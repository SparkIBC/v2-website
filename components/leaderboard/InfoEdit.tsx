import { useState, useRef, Fragment, useCallback } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';

import { useDonor } from 'contexts/donor';
import { useNameService } from '@cosmos-kit/react';
import { fromBech32, fromHex, toBech32, toHex } from 'cosmwasm';

type OptionType = {
  value: string;
  icon: string;
};

type OptionsType = {
  // stargaze: OptionType;
  // icns: OptionType;
  custom: OptionType;
};

const OPTIONS = {
  custom: { value: 'Custom', icon: '/images/Logo.svg' }
};

type InfoEditProps = {
  isVisible?: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
};

const InfoEdit = ({ isVisible = true, onSave, onCancel }: InfoEditProps) => {
  const { currentDonor } = useDonor();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<keyof OptionsType>('custom');
  const [donorLabel, setDonorLabel] = useState(currentDonor?.validatorLink?.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(async () => {
    if (currentDonor) {
      // let name;
      switch (OPTIONS[selected].value) {
        // case 'Stargaze':
        //   const starsAddr = toBech32('stars', fromHex(toHex(fromBech32(currentDonor?.address).data)));
        //   console.log(starsAddr);
        //   name = await sns?.resolveName(starsAddr);
        //   return onSave(name.primary_name);
        // case 'ICNS':
        //   name = await icns?.resolveName(currentDonor?.address);
        //   return onSave(name.primary_name);
        default:
          return onSave(donorLabel?.trim() || '');
      }
    }
  }, [currentDonor, donorLabel]);

  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="absolute inset-0 z-50 flex items-center w-full h-full bg-spark-gray lg:h-10 lg:top-1/2 lg:-translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative z-50 w-full">
            <div className="flex px-1.5 w-full h-8">
              <input
                className="h-full border-0 grow bg-inherit focus:ring-0 focus:border-0"
                type="text"
                value={selected === 'custom' ? donorLabel || '' : OPTIONS[selected]}
                readOnly={selected !== 'custom'}
                onChange={(e) => setDonorLabel(e.target.value)}
                ref={inputRef}
              />
              <button className="flex items-center gap-1.5 ml-1.5" onClick={() => setIsOpen(!isOpen)}>
                <img className={cx({ '-rotate-90': isOpen })} src="/images/arrow-white.svg" alt=">" />
                <img className="object-contain w-6 h-6" src={OPTIONS[selected].icon} alt={selected} />
              </button>
            </div>
            <div
              className={cx(
                'flex flex-col bg-spark-gray rounded-b overflow-hidden w-full absolute top-full transition-all duration-300',
                isOpen ? 'max-h-60' : 'max-h-0'
              )}
            >
              {Object.entries(OPTIONS).map(([key, option]) => (
                <div
                  key={key}
                  className="flex justify-between p-1.5 pl-5 w-full relative"
                  onClick={() => {
                    setSelected(key as keyof OptionsType);
                    setIsOpen(false);
                    if (key === 'custom' && inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  {selected === key && (
                    <span className="bg-spark-lightergray rounded-full w-1.5 h-1.5 absolute left-1.5 top-1/2 -translate-y-[50%]" />
                  )}
                  <span className="h-6">{option.value}</span>
                  <img className="object-contain w-6 h-6" src={option.icon} alt={option.value} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 rounded-b bg-[#3C3C3C] justify-center px-2.5 py-2 w-full absolute bottom-0 translate-y-full">
            <button
              className="h-8 font-medium rounded bg-spark-orange basis-0 grow text-spark-gray md:w-32 md:basis-auto md:grow-0"
              onClick={handleClick}
            >
              Apply
            </button>
            <button
              className="h-8 font-medium text-white rounded bg-spark-gray basis-0 grow md:w-32 md:basis-auto md:grow-0"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition.Root>
  );
};

export default InfoEdit;
