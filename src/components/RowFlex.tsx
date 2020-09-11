import React from 'react';
import classNames from 'classnames';

import './RowFlex.scss';

export interface RowFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'top' | 'middle' | 'bottom';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  column?: boolean;
  tag?: string;
}

export default function RowFlex(props: RowFlexProps) {
  const { tag = 'div', align, justify, column, className, children, ...prop } = props;
  const prefix = 'row-flex';
  const classes = classNames(
    {
      [prefix]: true,
      [`${prefix}-${justify}`]: justify,
      [`${prefix}-${align}`]: align,
      [`${prefix}-column`]: column,
    },
    className
  );
  return React.createElement(
    tag,
    {
      ...prop,
      className: classes,
    },
    children
  );
}
