import React, { ComponentPropsWithRef, useEffect, useState } from 'react';
import classes from './UserForm.module.scss';
import { default as cn } from 'classnames';
import { ApiUser } from '@api/schema';
import Button from '../Button';
import Input from '../Input';

type UserFormFields = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  department: string;
  company: string;
  jobTitle: string;
};

export type UserFormProps<T = UserFormFields> = ComponentPropsWithRef<'form'> & {
  // defaultValue?: ApiUser;
  value?: T;
  onSubmitValue?: (value: T) => void;
};

const UserForm = React.forwardRef<HTMLFormElement, UserFormProps>(
  ({ className, value, onSubmitValue, ...props }, ref) => {
    const [formData, setFormData] = useState<UserFormFields>(value as UserFormFields);
    useEffect(() => {
      if (value) setFormData(value);
    }, [value]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, name } = e.target;

      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    };
    return (
      <form
        autoComplete='off'
        ref={ref}
        className={cn(className, classes.UserForm)}
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmitValue) onSubmitValue(formData);
        }}
        {...props}
      >
        <div className={classes.UserForm__fields}>
          <Input
            type='text'
            name='firstName'
            label='Имя'
            value={formData?.firstName}
            onChange={handleInput}
          />
          <Input
            type='text'
            name='lastName'
            label='Фамилия'
            value={formData.lastName}
            onChange={handleInput}
          />
          <Input
            type='email'
            name='email'
            label='E-mail'
            value={formData.email}
            onChange={handleInput}
          />
          <Input
            type='date'
            name='birthDate'
            label='Дата рождения'
            value={formData.birthDate}
            onChange={handleInput}
          />
          <Input
            type='text'
            name='company'
            label='Компания'
            value={formData.company}
            onChange={handleInput}
          />
          <Input
            type='text'
            name='department'
            label='Отдел'
            value={formData.department}
            onChange={handleInput}
          />
          <Input
            type='text'
            name='jobTitle'
            label='Должность'
            value={formData.jobTitle}
            onChange={handleInput}
          />
        </div>
        <div className={classes.UserForm__actions}>
          <Button type='reset' variant='outline'>
            отменить
          </Button>
          <Button type='submit'>сохранить</Button>
        </div>
      </form>
    );
  }
);

export default UserForm;
