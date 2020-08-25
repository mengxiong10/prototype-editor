import React from 'react';
import type { DetailPanelType } from 'src/types/editor';
import { set } from 'dot-prop-immutable';
import { useEditor } from './Context';
import { actions } from './reducer';
import PanelDetailDefault from './PanelDetailDefault';
import type { PanelChangeHandler } from './PanelDetailHelper';

export interface PanelDetailContainerProps<T = any> {
  data: T;
  path: string;
  detailPanel: DetailPanelType<T>;
}

function PanelDetailContainer({ data, detailPanel, path }: PanelDetailContainerProps) {
  const dispatch = useEditor();
  // 代理blur事件记录历史
  const handleBlur = (evt: React.FocusEvent) => {
    const { target } = evt;
    const { tagName } = target;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      dispatch(actions.recordHistory());
    }
  };

  const handleChange: PanelChangeHandler = ({ prop, value, history = true }) => {
    const action = history ? actions.update : actions.updateWithoutHistory;
    dispatch(
      action((item) => {
        return { data: set(item.data, path ? `${path}.${prop}` : prop, value) };
      })
    );
  };

  return (
    <div onBlur={handleBlur}>
      {Array.isArray(detailPanel) ? (
        <PanelDetailDefault data={data} groups={detailPanel} onChange={handleChange} />
      ) : (
        React.createElement(detailPanel, {
          data,
          onChange: handleChange,
        })
      )}
    </div>
  );
}

export default PanelDetailContainer;
