import React from 'react';
import {
  List,
  InfiniteLoader,
  IndexRange,
  ListRowRenderer,
  Index,
  AutoSizer,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import UserItem from './components/UserItem';

export type InfiniteListProps<T = { id: string } & Record<string, string>> = {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  list: T[];
  loadNextPage: (params: IndexRange) => Promise<unknown>;
  value: string;
  onSelectValue: (value: string) => void;
};

const UsersList: React.FC<InfiniteListProps> = ({
  hasNextPage,
  isNextPageLoading,
  list = [],
  loadNextPage,
  value,
  onSelectValue,
}) => {
  const rowHeight = 50;

  const rowCount = hasNextPage ? list.length + 1 : list.length;

  const loadMoreRows: (params: IndexRange) => Promise<unknown> = (params) =>
    isNextPageLoading ? Promise.resolve() : loadNextPage(params);

  const isRowLoaded: (props: Index) => boolean = ({ index }) => !hasNextPage || index < list.length;

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    const content = `#${index + 1} ${list[index]?.fullName} `;
    const isLoading = !isRowLoaded({ index });

    return (
      <UserItem
        key={key}
        style={style}
        user={content}
        selected={value === list[index]?.id}
        loading={isLoading}
        onClick={() => !isLoading && onSelectValue(list[index]?.id)}
      />
    );
  };

  return (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer style={{ height: '100vh' }}>
          {({ width, height }) => (
            <List
              ref={registerChild}
              onRowsRendered={onRowsRendered}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              width={width}
              height={height}
              rowHeight={rowHeight}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};
export default UsersList;
