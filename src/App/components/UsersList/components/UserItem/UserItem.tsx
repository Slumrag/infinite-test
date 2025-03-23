import React, { ComponentPropsWithoutRef } from 'react';
import classes from './UserItem.module.scss';
import { default as cn } from 'classnames';

export type UserItemProps = ComponentPropsWithoutRef<'div'> & {
  user?: string;
  selected?: boolean;
};

const UserItem: React.FC<UserItemProps> = ({ className, user, selected = false, ...props }) => {
  return (
    <div
      className={cn(className, classes.UserItem, { [classes.UserItem_selected]: selected })}
      {...props}
    >
      <p>{user}</p>
    </div>
  );
};

export default UserItem;
