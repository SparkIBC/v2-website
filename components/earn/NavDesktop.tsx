'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import cx from 'classnames';

import { useCampaign } from 'contexts/campaign';
import campaigns from 'campaigns';

import TotalRaised from 'components/earn/TotalRaised';

const shadowBtnActiveClass = 'shadow-[0_0_11px_3px_rgba(255,247,237,0.35)]';

const NavDesktop = () => {
  const { campaign, setCampaign } = useCampaign();
  const [menuOffset, setMenuOffset] = useState(0);

  return (
    <RadioGroup value={campaign} onChange={setCampaign} className="hidden md:block">
      <div className="flex flex-row justify-between md:p-3 md:pb-0">
        <RadioGroup.Label className="w-full text-xl leading-4 text-white pb-2 md:border-b md:border-white/50">
          Active Campaigns:
        </RadioGroup.Label>
      </div>
      <div className="flex overflow-hidden mt-3">
        {menuOffset > 0 && (
          <button
            className="flex items-center justify-center shrink-0 bg-white/10 border border-spark-orange rounded-lg p-1.5 mt-3 ml-3 mr-3 w-12 h-12"
            onClick={() => setMenuOffset(menuOffset - 1)}
          >
            <img src="/images/arrow-double.svg" alt="prev" className="rotate-180" />
          </button>
        )}
        <div className="flex overflow-x-hidden w-full">
          <div
            className="flex grow w-full transition-all duration-300"
            style={{ transform: `translateX(${-100 * menuOffset}%)` }}
          >
            {campaigns.map((campaignData) => (
              <div
                key={campaignData.name}
                className={cx('basis-1/3 shrink-0 p-3', { ['pr-7']: campaigns.length > 3 })}
              >
                <RadioGroup.Option
                  value={campaignData}
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
                        {campaignData.name}
                      </RadioGroup.Label>
                    </>
                  )}
                </RadioGroup.Option>
                {campaignData.name === campaign.name && (
                  <TotalRaised total={3474} />
                )}
              </div>
            ))}
          </div>
        </div>
        {menuOffset < campaigns.length / 3 - 1 && (
          <button
            className="flex items-center justify-center shrink-0 bg-white/10 border border-spark-orange rounded-lg p-1.5 mt-3 mr-3 w-12 h-12"
            onClick={() => setMenuOffset(menuOffset + 1)}
          >
            <img src="/images/arrow-double.svg" alt="next" />
          </button>
        )}
      </div>
    </RadioGroup>
  );
};

export default NavDesktop;
