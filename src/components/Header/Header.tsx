import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import classes from './Header.module.scss';
import { default as cn } from 'classnames';

export type HeaderProps = ComponentPropsWithoutRef<'header'> & {
  title?: ReactNode;
  subtitle?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ className, title, subtitle, ...props }) => {
  return (
    <header className={cn(className, classes.Header)} {...props}>
      <h1 className={classes.Header__title}>{title}</h1>
      <h2 className={classes.Header__subtitle}>{subtitle}</h2>
    </header>
  );
};

export default Header;
