import React, { ComponentPropsWithRef, useEffect, useState } from 'react';
import classes from './UserForm.module.scss';
import { default as cn } from 'classnames';
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
  value?: T;
  onSubmitValue?: (value: T) => void;
};

const fields: {
  name: keyof UserFormFields;
  type: string;
  label: string;
}[] = [
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
  },
  {
    type: 'date',
    name: 'birthDate',
    label: 'Дата рождения',
  },
  { type: 'text', name: 'company', label: 'Компания' },
  {
    type: 'text',
    name: 'department',
    label: 'Отдел',
  },
  {
    type: 'text',
    name: 'jobTitle',
    label: 'Должность',
  },
];

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
          {fields.map((el) => (
            <Input key={el.name} value={formData[el.name]} onChange={handleInput} {...el} />
          ))}
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
