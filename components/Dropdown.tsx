import { useState } from 'react';
import cx from 'classnames';

export type DropdownItemType = {
  id: string;
  label: string;
  icon?: string;
};

type DropdownProps = {
  placeholder: string;
  items: Array<DropdownItemType>;
  selected: null | DropdownItemType;
  onChange: (item: DropdownItemType) => void;
};

const Dropdown = ({ placeholder, items, selected, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="w-full h-full relative">
      <div
        className={cx(
          'flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-sm p-3 pr-8 w-full h-full relative transition-all duration-150',
          { 'rounded-b-none': isOpen }
        )}
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <>
            <img src="/images/search.svg" alt="search" />
            <input
              className="bg-transparent border-0 border-b border-white/50 text-sm text-white p-0 ml-1 w-full h-5 focus:border-white/50 focus:ring-0"
              type="text"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
            />
          </>
        ) : selected ? (
          <div className="flex justify-start gap-2 leading-5 w-full">
            {selected.icon && <img src={selected.icon} alt={selected.label} />}
            <span>{selected.label}</span>
          </div>
        ) : (
          <span className="text-white/30">{placeholder}</span>
        )}
        <img
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={cx('cursor-pointer absolute right-4', { '-rotate-90': isOpen })}
          src="/images/arrow-white.svg"
          alt=">"
        />
      </div>
      <div
        className={cx(
          'bg-black rounded-b-2xl overflow-auto w-full absolute bottom-0 translate-y-full transition-all duration-150',
          isOpen ? 'max-h-60' : 'max-h-0'
        )}
      >
        {items
          .filter((item) => item.label.toLowerCase().includes(search.toLocaleLowerCase().trim()))
          .map((item) => (
            <div
              key={item.id}
              className="cursor-pointer flex gap-2 leading-5 py-1 px-2.5"
              onClick={() => {
                onChange(item);
                setIsOpen(false);
              }}
            >
              {item.icon && <img src={item.icon} alt={item.label} />}
              <span>{item.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;
