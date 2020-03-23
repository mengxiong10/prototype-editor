import React from 'react';
import { Menu } from 'antd';
import { Store, actions, cloneComponentData, createComponentData } from './reducer';
import { ComponentData } from '@/types/editor';
import { EditorContext, EditorDispatch } from './Context';
import ContextMenu from '../components/ContextMenu';
import DragSelect, { DragArea } from '@/components/DragSelect';
import DropZone, { DropDoneData } from './DropZone';
import 'antd/es/dropdown/style/index.css';

interface StageProps extends Store {
  children: React.ReactNode;
}

export default class Stage extends React.Component<StageProps, {}> {
  static contextType = EditorContext;

  context: EditorDispatch;

  clipboardData: ComponentData[] = [];

  contextMenuPosition = { x: 0, y: 0 };

  add = ({ data: type, x, y }: DropDoneData) => {
    const dispatch = this.context;
    const componentdata = createComponentData(type, x - 20, y - 20);
    dispatch(actions.add(componentdata));
  };

  del = () => {
    const dispatch = this.context;
    const { selected } = this.props;
    dispatch(actions.del(selected));
  };

  copy = () => {
    const { data, selected } = this.props;
    if (!selected.length) return;
    this.clipboardData = data.filter(v => selected.indexOf(v.id) !== -1);
  };

  cut = () => {
    this.copy();
    this.del();
  };

  paste = () => {
    const dispatch = this.context;
    const { clipboardData } = this;
    if (!clipboardData.length) return;
    const { x, y } = this.contextMenuPosition;
    const minX = Math.min(...clipboardData.map(v => v.position.left));
    const minY = Math.min(...clipboardData.map(v => v.position.top));
    const diffX = x - minX;
    const diffY = y - minY;
    const data = clipboardData.map(v => {
      const position = { left: v.position.left + diffX, top: v.position.top + diffY };
      return cloneComponentData(v, position);
    });
    dispatch(actions.add(data));
  };

  handleSelect = (evt: React.MouseEvent) => {
    const dispatch = this.context;
    if (evt.target === evt.currentTarget) {
      // TODO: 没有第二个参数 推断是unknow, 需要修复成void
      dispatch(actions.selectClear(undefined));
    } else {
      const wrapper = (evt.target as Element).closest('.pe-component-wrapper');
      const id = (wrapper as HTMLDivElement).dataset.id!;
      dispatch(actions.select(id));
    }
  };

  handleDragSelect = (value: DragArea) => {
    const dispatch = this.context;
    dispatch(actions.selectArea(value));
  };

  handleOpenContextMenu = (evt: React.MouseEvent) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    this.contextMenuPosition.x = evt.clientX - rect.left;
    this.contextMenuPosition.y = evt.clientY - rect.top;
  };

  renderComponentMenu() {
    return (
      <Menu prefixCls="ant-dropdown-menu">
        <Menu.Item key="del" onClick={this.del}>
          删除
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="cut" onClick={this.cut}>
          剪切
        </Menu.Item>
        <Menu.Item key="copy" onClick={this.copy}>
          复制
        </Menu.Item>
      </Menu>
    );
  }

  renderStateMenu() {
    return (
      <Menu prefixCls="ant-dropdown-menu">
        <Menu.Item key="paste" onClick={this.paste}>
          粘贴
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const menu = this.props.selected.length ? this.renderComponentMenu() : this.renderStateMenu();

    return (
      <div className="pe-content">
        <ContextMenu
          handle=".ant-dropdown-menu-item"
          overlay={menu}
          onOpen={this.handleOpenContextMenu}
        >
          <DragSelect onMove={this.handleDragSelect}>
            <DropZone
              onDropDone={this.add}
              style={{ minWidth: '100%', minHeight: '100%', width: '2000px', height: '1000px' }}
              tabIndex={-1}
              onMouseDown={this.handleSelect}
            >
              {this.props.children}
            </DropZone>
          </DragSelect>
        </ContextMenu>
      </div>
    );
  }
}
