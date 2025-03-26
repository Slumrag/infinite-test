import { default as cn } from 'classnames';

import React, { ComponentPropsWithRef } from 'react';
import classes from './Button.module.scss';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'solid' | 'outline';
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = 'solid',
  loading = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        classes.Button,
        { [classes.Button_solid]: variant === 'solid' },
        { [classes.Button_outline]: variant === 'outline' },
        { [classes.Button_loading]: loading },

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
