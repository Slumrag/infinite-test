import React, { ComponentPropsWithoutRef } from 'react';
import classes from './UserItem.module.scss';
import { default as cn } from 'classnames';

export type UserItemProps = ComponentPropsWithoutRef<'div'> & {
  user?: string;
  selected?: boolean;
  loading?: boolean;
};

const UserItem: React.FC<UserItemProps> = ({
  className,
  user,
  selected = false,
  loading = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        className,
        classes.UserItem,
        { [classes.UserItem_selected]: selected },
        { [classes.UserItem_loading]: loading }
      )}
      {...props}
    >
      <p>{loading ? 'загрузка...' : user}</p>
    </div>
  );
};

export default UserItem;
