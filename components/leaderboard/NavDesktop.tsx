import {RadioGroup} from '@headlessui/react';
import cx from 'classnames';

import {DONOR_TYPES} from 'donors/const';
import {useDonor} from 'contexts/donor';

const shadowBtnActiveClass = 'shadow-[0_0_11px_3px_rgba(255,247,237,0.35)]';

const NavDesktop = () => {
  const {donorType, setDonorType} = useDonor();

  return (
    <div className="hidden md:block">
      <RadioGroup value={donorType} onChange={setDonorType} className="flex flex-col w-full">
        <RadioGroup.Label className="w-full text-xl leading-4 text-white pb-2 md:border-b md:border-white/50">
          Donor type:
        </RadioGroup.Label>
        <div className="flex gap-6 mt-6 w-full">
          {DONOR_TYPES.map(donor => (
            <div key={donor.id}
                 className="basis-0 grow last:basis-24 last:grow-0 "
            >
              <RadioGroup.Option
                value={donor}
                className={({ checked }) =>
                  cx(
                    checked
                      ? `bg-spark-orange ${shadowBtnActiveClass} text-spark-gray h-12 hover:shadow-[0_0_8px_1px_rgba(255,247,237,0.35)]`
                      : 'bg-white/10 hover:shadow-[0_0_10px_-2px_rgba(255,232,187,0.3)]',
                    'cursor-pointer rounded-xl font-medium h-12 transition-all duration-150'
                  )
                }
              >
                {({ checked }) => (
                  <>
                    <RadioGroup.Label
                      as="span"
                      className={cx('flex items-center justify-center w-full h-full', {
                        'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-spark-orange-dark to-spark-orange':
                          !checked
                      })}
                    >
                      {donor.name}
                    </RadioGroup.Label>
                  </>
                )}
              </RadioGroup.Option>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default NavDesktop;