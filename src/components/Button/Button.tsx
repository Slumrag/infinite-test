import { default as cn } from 'classnames';

import React, { ComponentProps } from 'react';
import classes from './Button.module.scss';

export type ButtonProps = ComponentProps<'button'>;

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button className={cn(classes.Button, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
