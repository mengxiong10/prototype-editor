import React from 'react';
import produce from 'immer';
import { randomId } from '../utils/randomId';
import { EditorDataProvider, EditorAPIProvider } from './EditorContext';
import { execute } from './command';
import { getComponent } from './component';

export interface Position {
  left: number;
  top: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComponentData {
  id: string;
  type: string;
  size: Size;
  position: Position;
  data: any;
}

export interface EditorProps {
  children: React.ReactNode;
}

export interface EditorState {
  data: ComponentData[];
  selected: string[];
}

class Editor extends React.PureComponent<EditorProps, EditorState> {
  executeCommand = execute(this);

  contextValue = {
    executeCommand: this.executeCommand,
    selectComponent: this.selectComponent.bind(this),
    addComponent: this.addComponent.bind(this),
    deleteComponent: this.deleteComponent.bind(this),
    updateComponent: this.updateComponent.bind(this),
    getSelectedComponent: this.getSelectedComponent.bind(this),
  };

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      data: [],
      selected: [],
    };
  }

  getSelectedComponent() {
    const { data, selected } = this.state;
    return data.filter(v => selected.indexOf(v.id) !== -1);
  }

  selectComponent(id: string | string[], add = false) {
    const ids = typeof id === 'string' ? [id] : id;
    this.setState(prevState => {
      const selected = add ? [...new Set(prevState.selected.concat(ids))] : ids;
      return { selected };
    });
  }

  addComponent(type: string, position: Position) {
    const component = getComponent(type);
    if (!component) {
      console.warn(`${type} 没有注册`);
      return;
    }
    const id = randomId();
    const size = component.defaultSize || { width: 200, height: 200 };
    this.setState(prevState => {
      const data = prevState.data.slice();
      data.push({
        type,
        id,
        size,
        position,
        data: {},
      });
      return { data, selected: [id] };
    });
  }

  deleteComponent(id: string | string[]) {
    const ids = typeof id === 'string' ? [id] : id;
    this.setState(prevState => {
      const data = prevState.data.filter(v => ids.indexOf(v.id) === -1);
      return { data };
    });
  }

  updateComponent(id: string | string[], value: any) {
    const ids = typeof id === 'string' ? [id] : id;

    this.setState(
      produce((draft: EditorState) => {
        draft.data.forEach(v => {
          if (ids.indexOf(v.id) !== -1) {
            Object.assign(v.data, value);
          }
        });
      })
    );
  }

  render() {
    const { children } = this.props;

    return (
      <EditorAPIProvider value={this.contextValue}>
        <EditorDataProvider value={this.state}>{children}</EditorDataProvider>
      </EditorAPIProvider>
    );
  }
}

export default Editor;
