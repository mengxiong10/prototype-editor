import React from 'react';
import type { DetailPanelType } from 'src/types/editor';
import { set } from 'dot-prop-immutable';
import { useEditor } from 'src/editor/Context';
import { actions } from 'src/editor/reducer';
import DetailPanelDefault from './DetailPanelDefault';
import type { PanelChangeHandler } from './Helpers';

export interface DetailPanelContainerProps<T = any> {
  data: T;
  path: string;
  detailPanel: DetailPanelType<T>;
}

function DetailPanelContainer({ data, detailPanel, path }: DetailPanelContainerProps) {
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
