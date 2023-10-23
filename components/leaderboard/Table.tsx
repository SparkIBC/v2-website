import { ReactNode, useMemo, useState } from 'react';
import { useTable, Column, useExpanded, CellProps } from 'react-table';
import cx from 'classnames';

import { useDonor } from 'contexts/donor';

import NameEdit from 'components/leaderboard/NameEdit';
import { IDonor } from 'types';
import Loader from 'components/Loader';
import { useTx } from 'contexts/tx';
import { FundingMessageComposer } from 'types/Funding.message-composer';
import { CONTRACT_ADDRESS } from 'util/constants';
import InfoEdit from './InfoEdit';

const formatDonorField = (donor: IDonor, field: string, isExpanded = false) => {
  const { nickname, address, validatorLink } = donor;
  switch (field) {
    case 'rank':
      return donor.rank;
    case 'name':
      const nameContent =
        nickname || `${address.substring(0, 13)}...${address.substring(address.length - 13, address.length)}`;
      return <p className="w-full overflow-hidden text-center whitespace-nowrap text-ellipsis">{nameContent}</p>;
    case 'sparkPoints':
      return (
        <div className="flex justify-between w-full gap-2 text-sm md:gap-4 md:text-base lg:justify-center">
          <span className={cx('md:block lg:hidden', { hidden: !isExpanded })}>Spark Points</span>
          <span
            className={cx('text-inherit font-normal md:text-spark-lightergray lg:text-inherit lg:font-bold', {
              'text-spark-lightergray lg:text-spark-lightergray lg:font-normal': isExpanded
            })}
          >
            {donor.totalSparkPoints.toLocaleString()}
          </span>
        </div>
      );
    case 'campaignDonations':
      return (
        <div className="flex flex-col items-center">
          {isExpanded && <span className="text-xs lg:hidden">Campaigns</span>}
          <span className="text-sm md:text-base">{donor.campaignDonations.toLocaleString()}</span>
        </div>
      );
    case 'generalDonations':
      return (
        <div className="flex flex-col items-center">
          {isExpanded && <span className="text-xs lg:hidden">General</span>}
          <span className="text-sm md:text-base">{donor.generalDonations.toLocaleString()}</span>
        </div>
      );
    case 'info':
      return validatorLink?.url !== '' && validatorLink?.url !== '#' ? (
        <>
          <a
            href={validatorLink?.url}
            rel="noopener noreferrer"
            target="_blank"
            className={cx(
              'text-xs md:text-base text-center w-full transition-all duration-300',
              isExpanded ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'
            )}
          >
            {validatorLink?.label}
          </a>
          <a
            href={validatorLink?.url}
            rel="noopener noreferrer"
            target="_blank"
            className={cx(
              'hidden text-center whitespace-nowrap text-ellipsis overflow-hidden px-2.5 absolute w-full transition-all duration-300 lg:block',
              isExpanded ? 'opacity-0 invisible' : 'opacity-100 visible'
            )}
          >
            {validatorLink?.label}
          </a>
        </>
      ) : (
        <>
          <p
            className={cx(
              'text-xs md:text-base text-center w-full transition-all duration-300',
              isExpanded ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'
            )}
          >
            {validatorLink?.label}
          </p>
          <p
            className={cx(
              'hidden text-center whitespace-nowrap text-ellipsis overflow-hidden px-2.5 absolute w-full transition-all duration-300 lg:block',
              isExpanded ? 'opacity-0 invisible' : 'opacity-100 visible'
            )}
          >
            {validatorLink?.label}
          </p>
        </>
      );
    default: // do nothing
  }
};

const getTableColumns = (): Array<Column<IDonor>> => [
  {
    Header: 'Rank',
    id: 'rank',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'rank', row.isExpanded)}</>
  },
  {
    Header: 'Name',
    id: 'name',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'name', row.isExpanded)}</>
  },
  {
    Header: 'Spark Points',
    id: 'sparkPoints',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'sparkPoints', row.isExpanded)}</>
  },
  {
    Header: 'Campaign',
    id: 'campaignDonations',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'campaignDonations', row.isExpanded)}</>
  },
  {
    Header: 'General',
    id: 'generalDonations',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'generalDonations', row.isExpanded)}</>
  },
  {
    Header: 'Info',
    id: 'info',
    Cell: ({ row }: CellProps<any>) => <>{formatDonorField(row.original, 'info', row.isExpanded)}</>
  }
];

const COLUMN_STYLES: { [key: string]: string } = {
  rank: 'rounded-tl-lg rounded-bl-lg bg-gradient-to-b from-spark-orange-dark to-spark-orange basis-[50px] justify-center shrink-0 font-bold lg:basis-[5%] lg:bg-none lg:font-normal',
  name: 'flex justify-center basis-[40%] flex justify-start lg:justify-center grow px-2.5 overflow-hidden lg:basis-[20%] lg:grow-0 lg:shrink-0',
  sparkPoints:
    'shrink-0 font-bold text-transparent bg-clip-text bg-gradient-to-b from-spark-orange-dark to-spark-orange px-2.5 md:basis-[200px] lg:basis-[15%] lg:justify-center lg:px-0',
  campaignDonations: 'hidden shrink-0 lg:flex basis-[10%] lg:justify-center',
  generalDonations: 'hidden shrink-0 lg:flex basis-[10%] lg:justify-center',
  info: 'flex grow px-2.5 overflow-hidden justify-center w-full min-h-0 transition-all duration-300'
};

const COLUMN_EXPANDED_STYLES: { [key: string]: string } = {
  rank: 'rounded-tl-lg bg-gradient-to-b from-spark-orange-dark to-spark-orange py-4 lg:bg-none',
  name: 'basis-[80%] grow md:basis-auto py-4 w-1/2 lg:shrink-0 lg:w-auto lg:min-w-[300px]',
  sparkPoints:
    'font-bold text-transparent bg-clip-text bg-gradient-to-b from-spark-orange-dark to-spark-orange py-0 md:py-4',
  info: 'md:border-t md:border-spark-gray py-2 w-full md:py-4 min-h-[40px] lg:border-t-0 lg:basis-[60%] lg:grow-0'
};

const Table = () => {
  const { tx } = useTx();

  const { donors, currentDonor } = useDonor();
  const columns = useMemo<Column<IDonor>[]>(getTableColumns, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, toggleAllRowsExpanded } = useTable(
    {
      columns,
      data: donors
    },
    useExpanded
  );
  const [isCurrentExpanded, setIsCurrentExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const renderCurrentDonorColumn = (column: Column<IDonor>) => {
    if (currentDonor) {
      if (column.id === 'name') {
        return (
          <div className="flex items-center justify-center w-full h-full">
            {formatDonorField(currentDonor, column.id, isCurrentExpanded)}
            <button
              className={cx('shrink-0 ml-auto', { hidden: !isCurrentExpanded })}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <img className="w-[24px]" src="/images/icon_user_edit.svg" alt="edit" />
            </button>
            <NameEdit
              isVisible={isEditing}
              onSave={(name) => {
                const fundingMsgComposer = new FundingMessageComposer(currentDonor?.address, CONTRACT_ADDRESS);
                const msg = fundingMsgComposer.updateNickname({ nickname: name });
                tx(
                  [msg],
                  {
                    toast: {
                      title: 'Nickname changed!'
                    }
                  },
                  () => {
                    setIsEditing(false);
                  }
                );
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        );
      } else if (column.id === 'info' && isCurrentExpanded && currentDonor?.totalSparkPoints >= 1) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            {formatDonorField(currentDonor, column.id, isCurrentExpanded)}
            <button
              className={cx('shrink-0', { hidden: !isCurrentExpanded })}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingInfo(true);
              }}
            >
              <img className="w-[24px]" src="/images/icon_user_edit.svg" alt="edit" />
            </button>
            <InfoEdit
              isVisible={isEditingInfo}
              onSave={(label) => {
                const fundingMsgComposer = new FundingMessageComposer(currentDonor?.address, CONTRACT_ADDRESS);
                const msg = fundingMsgComposer.updateValidatorLink({
                  validatorLink: {
                    url: '#',
                    label
                  }
                });
                tx(
                  [msg],
                  {
                    toast: {
                      title: 'Info changed!'
                    }
                  },
                  () => {
                    setIsEditingInfo(false);
                  }
                );
              }}
              onCancel={() => setIsEditingInfo(false)}
            />
          </div>
        );
      } else if (column.id === 'rank') {
        return <p>{currentDonor.rank || ''}</p>;
      } else return formatDonorField(currentDonor, column.id as keyof IDonor, isCurrentExpanded);
    }
  };

  return donors.length > 0 ? (
    <div
      {...getTableProps()}
      className="bg-gradient-to-br from-spark-orange-dark to-spark-orange rounded-lg p-[2px] font-outfit font-medium text-spark-lightergray w-full"
    >
      <div className="flex flex-col w-full rounded-lg bg-spark-gray">
        {/* HEADER */}
        {headerGroups.map((headerGroup, index) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            key={index}
            className="hidden rounded-lg border-[1px] border-spark-gray bg-white/10 w-full h-8 lg:flex"
          >
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                key={column.id}
                className={cx(
                  'flex items-center border-r border-spark-gray h-full last:border-r-0',
                  COLUMN_STYLES[column.id]
                )}
              >
                {column.render('Header') as ReactNode}
              </div>
            ))}
          </div>
        ))}
        <div className="hidden border-b border-spark-lightergray lg:block" />

        {/*CURRENT DONOR*/}
        {currentDonor && (
          <div
            className="cursor-pointer flex rounded-lg border-[1px] border-spark-gray bg-white/5 w-full"
            onClick={() => {
              if (!isEditing) {
                setIsCurrentExpanded(!isCurrentExpanded);
                toggleAllRowsExpanded(false);
              }
            }}
          >
            <div
              className={cx(
                'flex flex-wrap justify-between w-full transition-all duration-300 lg:flex-nowrap',
                isCurrentExpanded ? 'max-h-52' : 'max-h-8'
              )}
            >
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={cx(
                    `flex items-center justify-center boder-r-0 md:border-r border-spark-gray last:border-r-0 relative`,
                    isCurrentExpanded
                      ? COLUMN_EXPANDED_STYLES[col.id as keyof IDonor]
                      : COLUMN_STYLES[col.id as keyof IDonor],
                    {
                      ['border-r-0 px-1.5 md:px-2.5 lg:border-r']: isCurrentExpanded
                    }
                  )}
                >
                  {renderCurrentDonorColumn(col)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BODY */}
        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps} key={row.id}>
                <div
                  className="cursor-pointer flex rounded-lg border-[1px] border-spark-gray bg-white/10 overflow-hidden w-full"
                  onClick={() => {
                    if (!isEditing) {
                      if (!row.isExpanded) {
                        setIsCurrentExpanded(false);
                        toggleAllRowsExpanded(false);
                      }
                      row.toggleRowExpanded();
                    }
                  }}
                >
                  <div
                    className={cx(
                      'flex flex-wrap justify-between w-full transition-all duration-300 lg:flex-nowrap',
                      row.isExpanded ? 'max-h-52' : 'max-h-8'
                    )}
                  >
                    {row.cells.map((cell) => (
                      <div
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className={cx(
                          `flex items-center justify-center boder-r-0 md:border-r border-spark-gray last:border-r-0 relative`,
                          row.isExpanded
                            ? COLUMN_EXPANDED_STYLES[cell.column.id as keyof IDonor]
                            : COLUMN_STYLES[cell.column.id as keyof IDonor],
                          {
                            ['border-r-0 px-1.5 md:px-2.5 lg:border-r']: row.isExpanded
                          }
                        )}
                      >
                        {cell.render('Cell') as ReactNode}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <Loader size={64} />
  );
};

export default Table;
