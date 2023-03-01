import { useState, useRef, Fragment } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';

import { useDonor } from 'contexts/donor';

type OptionType = {
  value: string;
  icon: string;
};

type OptionsType = {
  dens: OptionType;
  stargase: OptionType;
  icns: OptionType;
  custom: OptionType;
};

const OPTIONS = {
  dens: { value: '(de)ns username', icon: '/images/platforms/dens.png' },
  stargase: { value: 'Stargase name', icon: '/images/platforms/stargase.png' },
  icns: { value: 'ICNS name', icon: '/images/platforms/icns.png' },
  custom: { value: 'Custom', icon: '/images/Logo.svg' }
};

type NameEditProps = {
  isVisible?: boolean;
  onSave: () => void;
  onCancel: () => void;
};

const NameEdit = ({ isVisible = true, onSave, onCancel }: NameEditProps) => {
  const { currentDonor, setCurrentDonor } = useDonor();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<keyof OptionsType>('custom');
  const [donorName, setDonorName] = useState(currentDonor?.name);
  const inputRef = useRef<HTMLInputElement>(null);

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
          className="bg-spark-gray flex items-center w-full h-full absolute inset-0 z-50 lg:h-10 lg:top-1/2 lg:-translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full relative z-50">
            <div className="flex px-1.5 w-full h-8">
              <input
                className="grow border-0 bg-inherit h-full focus:ring-0 focus:border-0"
                type="text"
                value={selected === 'custom' ? donorName : OPTIONS[selected].value}
                readOnly={selected !== 'custom'}
                onChange={(e) => setDonorName(e.target.value)}
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
              className="bg-spark-orange basis-0 grow font-medium text-spark-gray rounded h-8 md:w-32 md:basis-auto md:grow-0"
              onClick={() => {
                if (currentDonor) {
                  const name = selected === 'custom' && donorName ? donorName.trim() : OPTIONS[selected].value;
                  setCurrentDonor({ ...currentDonor, name });
                }
                onSave();
              }}
            >
              Apply
            </button>
            <button
              className="bg-spark-gray basis-0 grow font-medium text-white rounded h-8 md:w-32 md:basis-auto md:grow-0"
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

export default NameEdit;
