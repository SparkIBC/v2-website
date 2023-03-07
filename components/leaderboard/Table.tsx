import { useMemo, useState } from 'react';
import { useTable, Column, useExpanded, CellProps } from 'react-table';
import cx from 'classnames';

import { useDonor } from 'contexts/donor';
import { IDonor } from 'donors/types';

import NameEdit from 'components/leaderboard/NameEdit';

const formatDonorField = (donor: IDonor, field: string, isExpanded = false) => {
  const { name, address, info } = donor;
  switch (field) {
    case 'rank':
      return donor.rank;
    case 'name':
      const nameContent =
        name || `${address.substring(0, 13)}...${address.substring(address.length - 13, address.length)}`;
      return <div className="whitespace-nowrap text-ellipsis overflow-hidden">{nameContent}</div>;
    case 'sparkPoints':
      return (
        <div className="flex justify-between gap-2 text-sm w-full md:gap-4 md:text-base lg:justify-center">
          <span className={cx('md:block lg:hidden', { hidden: !isExpanded })}>Spark Points</span>
          <span
            className={cx('text-inherit font-normal md:text-spark-lightergray lg:text-inherit lg:font-bold', {
              'text-spark-lightergray lg:text-spark-lightergray lg:font-normal': isExpanded
            })}
          >
            {donor.sparkPoints.toLocaleString()}
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
      return (
        <>
          <div
            className={cx(
              'text-xs md:text-base text-center w-full transition-all duration-300',
              isExpanded ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'
            )}
          >
            {info}
          </div>
          <div
            className={cx(
              'hidden text-center whitespace-nowrap text-ellipsis overflow-hidden px-2.5 absolute w-full transition-all duration-300 lg:block',
              isExpanded ? 'opacity-0 invisible' : 'opacity-100 visible'
            )}
          >
            {info}
          </div>
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
  campaignDonations: 'hidden shrink-0  lg:flex basis-[10%] lg:justify-center',
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

  const renderCurrentDonorColumn = (column: Column<IDonor>) => {
    if (currentDonor) {
      if (column.id === 'name') {
        return (
          <>
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
            <NameEdit isVisible={isEditing} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          </>
        );
      } else if (column.id === 'info' && isCurrentExpanded && currentDonor?.sparkPoints < 50) {
        return (
          <div className="flex justify-center items-center w-full h-full">
            <img src="/images/icon_lock.svg" alt="locked" />
          </div>
        )
      } else return formatDonorField(currentDonor, column.id as keyof IDonor, isCurrentExpanded);
    }
  };

  return (
    <div
      {...getTableProps()}
      className="bg-gradient-to-br from-spark-orange-dark to-spark-orange rounded-lg p-[2px] font-outfit font-medium text-spark-lightergray w-full"
    >
      <div className="flex flex-col bg-spark-gray rounded-lg w-full">
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
                {column.render('Header')}
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
                    `flex items-center boder-r-0 md:border-r border-spark-gray last:border-r-0 relative`,
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
                          `flex items-center boder-r-0 md:border-r border-spark-gray last:border-r-0 relative`,
                          row.isExpanded
                            ? COLUMN_EXPANDED_STYLES[cell.column.id as keyof IDonor]
                            : COLUMN_STYLES[cell.column.id as keyof IDonor],
                          {
                            ['border-r-0 px-1.5 md:px-2.5 lg:border-r']: row.isExpanded
                          }
                        )}
                      >
                        {cell.render('Cell')}
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
  );
};

export default Table;
