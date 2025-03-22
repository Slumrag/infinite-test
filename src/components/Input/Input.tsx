import { default as cn } from 'classnames';
import React, { ComponentPropsWithRef } from 'react';
import classes from './Input.module.scss';

export type InputProps = { label?: string } & ComponentPropsWithRef<'input'>;

const Input: React.FC<InputProps> = ({ className, label, children, id, ...props }) => {
  return (
    <div className={cn(classes.Input, className)}>
      <label htmlFor={id} className={classes.Input__label}>
        {label}
      </label>
      <input id={id} className={classes.Input__element} {...props}>
        {children}
      </input>
    </div>
  );
};

export default Input;
