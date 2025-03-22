import React, { ComponentPropsWithoutRef } from 'react';
import classes from './UsersList.module.scss';
import { default as cn } from 'classnames';
import UserItem from './components/UserItem';
import { ApiUser } from '@api/schema';

export type UsersListProps = ComponentPropsWithoutRef<'ul'> & {
  users?: ApiUser[];
  value?: ApiUser;
  onSelectValue?: (value: ApiUser) => void;
};

const UsersList: React.FC<UsersListProps> = ({
  className,
  users,
  value,
  onSelectValue,
  ...props
}) => {
  return (
    <ul className={cn(className, classes.UsersList)} {...props}>
      {users?.map((el) => (
        <li
          key={el.id}
          onClick={() => {
            if (onSelectValue) onSelectValue(el);
          }}
        >
          <UserItem selected={value?.id === el.id} user={el.firstName + ' ' + el.lastName} />
        </li>
      ))}
    </ul>
  );
};

export default UsersList;
