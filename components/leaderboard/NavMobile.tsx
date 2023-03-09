import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import cx from 'classnames';

import { useDonor } from 'contexts/donor';
import { AddressType } from 'types';

const shadowBtnActiveClass = 'shadow-[0_0_11px_3px_rgba(255,247,237,0.35)]';

const NavMobile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { donorType, setDonorType } = useDonor();

  return (
    <RadioGroup value={donorType} onChange={setDonorType} className="z-50 md:hidden">
      <div className="flex flex-row justify-between md:p-3 md:pb-0">
        <RadioGroup.Label className="w-full pb-2 text-xl leading-4 text-white md:border-b md:border-white/50">
          Donor Type:
        </RadioGroup.Label>
      </div>
      <div className="relative mt-4">
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center justify-center grow bg-spark-orange ${shadowBtnActiveClass} text-spark-gray h-12 transition-all ease-in-out duration-150 ${
            isDropdownOpen ? 'rounded-t-xl' : 'rounded-xl delay-150'
          }`}
        >
          {donorType}
          <img src="/images/arrow.svg" alt=">" className={cx('absolute right-4', { 'rotate-90': isDropdownOpen })} />
        </div>
        <div
          className={cx(
            `bg-spark-lightgray ${shadowBtnActiveClass} overflow-hidden w-full absolute top-12 origin-top transition ease-in-out duration-150`,
            isDropdownOpen ? 'rounded-b-xl' : 'rounded-t-0 scale-y-0 md:scale-100'
          )}
        >
          {Object.keys(AddressType).map(
            (donor) =>
              donorType !== donor && (
                <RadioGroup.Option
                  key={donor}
                  value={donor}
                  onClick={() => setIsDropdownOpen(false)}
                  className={({ checked }) =>
                    cx(
                      checked ? 'bg-spark-orange' : 'bg-white/10 border-t border-spark-lightgray',
                      'items-center justify-center grow text-spark-gray h-12',
                      isDropdownOpen && donorType === donor ? 'hidden md:flex' : 'flex'
                    )
                  }
                >
                  <RadioGroup.Label as="span">{donor}</RadioGroup.Label>
                </RadioGroup.Option>
              )
          )}
        </div>
      </div>
    </RadioGroup>
  );
};

export default NavMobile;
