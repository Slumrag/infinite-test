import React, { ComponentPropsWithoutRef, ReactElement } from 'react';
import classes from './Layout.module.scss';
import { default as cn } from 'classnames';

export type LayoutProps = ComponentPropsWithoutRef<'div'> & {
  sidebar?: ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ className, children, sidebar, ...props }) => {
  return (
    <div className={cn(className, classes.Layout)} {...props}>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
