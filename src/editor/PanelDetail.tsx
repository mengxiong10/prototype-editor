import React from 'react';
import { set } from 'dot-prop-immutable';
import type { DetailPanelType } from 'src/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';
import PanelDetailDefault from './PanelDetailDefault';

export interface PanelDetailProps<T = any> {
  path: string;
  data: T;
  detailPanel: DetailPanelType<T>;
}

export type PanelChangeHandler = (data: { prop: string; value: any; history?: boolean }) => void;

export interface PanelDetailBaseProps {
  data: any;
  onChange: PanelChangeHandler;
}

function PanelDetail({ data, path, detailPanel }: PanelDetailProps) {
  const dispatch = useEditor();

  const handleChange: PanelChangeHandler = ({ prop, value, history = true }) => {
    const action = history ? actions.update : actions.updateWithoutHistory;
    dispatch(
      action((item) => {
        return { data: set(item.data, path ? `${path}.${prop}` : prop, value) };
      })
    );
  };

  // 代理blur事件记录历史
  const handleBlur = (evt: React.FocusEvent) => {
    const { target } = evt;
    const { tagName } = target;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      dispatch(actions.recordHistory());
    }
  };

  return (
    <div onBlur={handleBlur}>
      {Array.isArray(detailPanel) ? (
        <PanelDetailDefault onChange={handleChange} data={data} groups={detailPanel} />
      ) : (
        React.createElement(detailPanel, {
          data,
          onChange: handleChange,
        })
      )}
    </div>
  );
}

export default PanelDetail;
