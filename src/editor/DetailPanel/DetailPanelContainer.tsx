import React from 'react';
import type { DetailPanelType } from 'src/editor/type';
import { set } from 'dot-prop-immutable';
import { useEditor } from 'src/editor/Context';
import DetailPanelDefault from './DetailPanelDefault';
import type { PanelChangeHandler } from './Helpers';

export interface DetailPanelContainerProps<T = any> {
  data: T;
  path: string | null;
  detailPanel: DetailPanelType<T>;
}

function DetailPanelContainer({ data, detailPanel, path }: DetailPanelContainerProps) {
  const execCommand = useEditor();
  // 代理blur事件记录历史
  const handleBlur = (evt: React.FocusEvent) => {
    const { target } = evt;
    const { tagName } = target;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      execCommand('recordHistory');
    }
  };

  const handleChange: PanelChangeHandler = ({ prop, value, history = true }) => {
    execCommand(history ? 'update' : 'updateWithoutHistory', (item) => {
      const key = path ? `${path}.data.${prop}` : `data.${prop}`;
      return set(item, key, value);
    });
  };

  return (
    <div onBlur={handleBlur}>
      {Array.isArray(detailPanel) ? (
        <DetailPanelDefault data={data} groups={detailPanel} onChange={handleChange} />
      ) : (
        React.createElement(detailPanel, {
          data,
          onChange: handleChange,
        })
      )}
    </div>
  );
}

export default DetailPanelContainer;
