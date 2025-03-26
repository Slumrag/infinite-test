import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, useEffect, useState } from 'react';
import classes from './UserForm.module.scss';
import { default as cn } from 'classnames';
import Button from '@components/Button';
import Input from '@components/Input';

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
  value?: T;
  onSubmitValue?: (value: T) => void;
};

const fields: Array<
  ComponentPropsWithoutRef<'input'> & {
    name: keyof UserFormFields;
    label?: string;
    formatter?: (value: unknown) => string;
  }
> = [
  {
    name: 'firstName',
    type: 'text',
    label: 'Имя',
  },
  { type: 'text', name: 'lastName', label: 'Фамилия' },
  {
    type: 'email',
    name: 'email',
    label: 'E-mail',
    required: true,
  },
  {
    type: 'date',
    name: 'birthDate',
    label: 'Дата рождения',
    required: true,
    formatter: (value) => (value as string)?.slice(0, 10),
  },
  { type: 'text', name: 'company', label: 'Компания', required: true },
  {
    type: 'text',
    name: 'department',
    label: 'Отдел',
    required: true,
  },
  {
    type: 'text',
    name: 'jobTitle',
    label: 'Должность',
    required: true,
  },
];

const UserForm = React.forwardRef<HTMLFormElement, UserFormProps>(
  ({ className, value, onSubmitValue, ...props }, ref) => {
    const [formData, setFormData] = useState<UserFormFields>(value as UserFormFields);

    useEffect(() => {
      if (value) {
        setFormData(value);
      }
    }, [value]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, name } = e.target;
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    };

    return (
      <>
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
            {fields.map(({ name, formatter, ...el }) => (
              <Input
                key={name}
                name={name}
                value={formatter ? formatter(formData[name]) : formData[name]}
                onChange={handleInput}
                {...el}
              />
            ))}
          </div>
          <div className={classes.UserForm__actions}>
            <Button type='submit'>сохранить</Button>
          </div>
        </form>
      </>
    );
  }
);

export default UserForm;
