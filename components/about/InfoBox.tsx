import React, { useState } from 'react';
import cx from 'classnames';

type InfoBoxProps = {
  title: string;
  isDefaultOpen?: boolean;
  children: React.ReactNode;
};

const InfoBox = ({ title, isDefaultOpen = false, children }: InfoBoxProps) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className="bg-gradient-to-bl from-spark-orange to-red-orange rounded-lg text-spark-lightergray overflow-hidden p-0.5 w-full">
      <div className="bg-spark-gray rounded-lg w-full">
        <h2
          className="cursor-pointer flex justify-between items-center py-4 px-4 w-full md:px-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-2xl font-bold">{title}</span>
          <span className="text-4xl font-bold">{isOpen ? '-' : '+'}</span>
        </h2>
        <div
          className={cx(
            'overflow-hidden px-4 transition-all duration-300 md:px-8',
            isOpen ? 'max-h-[1500px] md:max-h-[1000px]' : 'max-h-0'
          )}
        >
          <div
            className={cx(
              'flex flex-col gap-8 text-lg leading-7 indent-8 py-4 w-full md:py-8',
              '[&_ul]:list-disc [&_ul]:list-inside [&_ul]:indent-0',
              '[&_a]:text-[#966CF0] [&_a]:underline [&_a]:underline-offset-4'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
