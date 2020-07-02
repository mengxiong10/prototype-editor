import React from 'react';
import classnames from 'classnames';
import { castArray } from 'lodash';

// 拖动 | 快捷键
type Feature = 'drag' | 'keyboardShortcut';

export interface DisableDragProps {
  children: React.ReactElement;
  disabled: Feature | Feature[];
}

export const disableClassnames = {
  drag: 'js-disable-drag',
  keyboardShortcut: 'js-disable-shortcut',
};

function DisableEditorFeature({ children, disabled }: DisableDragProps) {
  const arr = castArray(disabled).map((v) => disableClassnames[v]);

  const className = classnames(children.props.className, arr);

  return React.cloneElement(React.Children.only(children), {
    className,
  });
}

export default DisableEditorFeature;
