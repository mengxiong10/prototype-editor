import React from 'react';
import { randomId } from '../utils/randomId';
import { EditorAPIProvider } from './EditorContext';
import { getComponent } from './components';
import ComponentList from './ComponentList';
import Stage from './Stage';
import DetailPanel from './DetailPanel';
import { ComponentData, ComponentPosition } from '@/types/editor';
// import

export interface EditorProps {}

export interface EditorState {
  components: ComponentData[];
  selected: string[];
}

export interface PayloadAdd {
  type: string;
  left: number;
  top: number;
}

export interface PayloadDelete {
  id: string | string[];
}

export interface PayloadUpdate {
  id: string | string[];
  data?: any;
  position?: ComponentPosition;
}

export interface PayloadSelect {
  id: string | string[];
  add?: boolean;
}

export type EditorAction =
  | { type: 'add'; payload: PayloadAdd }
  | { type: 'del'; payload: PayloadDelete }
  | { type: 'update'; payload: PayloadUpdate }
  | { type: 'select'; payload: PayloadSelect };

class Editor extends React.PureComponent<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      components: [],
      selected: [],
    };
  }

  dispatch = (action: EditorAction) => {
    const { type, payload } = action;
    const method = type;
    if (typeof this[method] === 'function') {
      this[method](payload as any);
    }
  };

  select({ id, add }: PayloadSelect) {
    const ids = typeof id === 'string' ? [id] : id;
    this.setState(prevState => {
      const selected = add ? [...new Set(prevState.selected.concat(ids))] : ids;
      return { selected };
    });
  }

  add({ type, top, left }: PayloadAdd) {
    const component = getComponent(type);
    if (!component) {
      console.warn(`${type} 没有注册`);
      return;
    }
    const id = randomId();
    const { width, height } = component.defaultSize || { width: 200, height: 200 };
    this.setState(prevState => {
      const newData = {
        type,
        id,
        position: {
          top,
          left,
          width,
          height,
        },
        data: {},
      };
      return { components: [...prevState.components, newData], selected: [id] };
    });
  }

  del({ id }: PayloadDelete) {
    const ids = typeof id === 'string' ? [id] : id;
    this.setState(prevState => {
      const components = prevState.components.filter(v => ids.indexOf(v.id) === -1);
      return { components };
    });
  }

  update({ id, data, position }: PayloadUpdate) {
    const ids = typeof id === 'string' ? [id] : id;
    this.setState(prevState => {
      const components = prevState.components.map(v => {
        if (ids.indexOf(v.id) !== -1) {
          // data 和 posision 都是spread传入组件，所以没有必要判断 data: data ? {...v.data, ...data} : v.data
          return { ...v, data: { ...v.data, ...data }, position: { ...v.position, ...position } };
        }
        return v;
      });
      return { components };
    });
  }

  render() {
    const { components, selected } = this.state;

    return (
      <EditorAPIProvider value={this.dispatch}>
        <div className="pe-container">
          <div className="pe-main">
            <ComponentList />
            <Stage data={components} selected={selected} />
            <DetailPanel data={components} selected={selected} />
          </div>
        </div>
      </EditorAPIProvider>
    );
  }
}

export default Editor;
