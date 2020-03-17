import React from 'react';
import { rafThrottle } from '@/utils/rafThrottle';

export interface Area {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type DragSelectHandler = (data: Area) => void;

export interface DragSelectProps {
  children: React.ReactElement;
  onDrag?: DragSelectHandler;
}

interface DragSelectState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dragging: boolean;
}

const getPosition = (
  { clientX, clientY }: { clientX: number; clientY: number },
  target: Element
) => {
  const rect = target.getBoundingClientRect();
  const x = clientX - rect.left + target.scrollLeft;
  const y = clientY - rect.top + target.scrollTop;
  return { x, y };
};

const getStyle = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) => {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  return { left, top, width, height };
};

class DragSelect extends React.Component<DragSelectProps, DragSelectState> {
  el: Element | null = null;

  constructor(props: DragSelectProps) {
    super(props);
    this.state = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      dragging: false,
    };
  }

  handleStart = (evt: React.MouseEvent) => {
    const { children } = this.props;
    if (children.props.onMouseDown) {
      children.props.onMouseDown(evt);
    }
    const { target, currentTarget, button } = evt;
    // 只响应左键
    if (typeof button === 'number' && button !== 0) {
      return;
    }
    // 不响应冒泡
    if (target !== currentTarget) {
      return;
    }
    const { x, y } = getPosition(evt, currentTarget);
    this.el = currentTarget;
    this.setState({ x1: x, y1: y, x2: x, y2: y, dragging: true });
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.handleStop);
  };

  handleDrag = rafThrottle((evt: MouseEvent) => {
    if (!this.state.dragging || !this.el) {
      return;
    }
    let { x, y } = getPosition(evt, this.el);
    const maxWidth = this.el.scrollWidth;
    const maxHeight = this.el.scrollHeight;
    x = Math.max(0, x);
    x = Math.min(x, maxWidth);
    y = Math.max(0, y);
    y = Math.min(y, maxHeight);
    if (x === this.state.x2 && y === this.state.y2) {
      return;
    }
    if (this.props.onDrag) {
      this.props.onDrag(getStyle({ x1: this.state.x1, y1: this.state.y1, x2: x, y2: y }));
    }
    this.setState({ x2: x, y2: y });
  });

  handleStop = () => {
    const { dragging } = this.state;
    if (!dragging) {
      return;
    }
    this.el = null;
    this.setState({
      dragging: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    });
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleStop);
  };

  componentWillUnmount() {
    this.el = null;
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleStop);
  }

  render() {
    const { children } = this.props;
    const { dragging } = this.state;
    const style = getStyle(this.state);
    const rectElement = dragging && (
      <div
        key="dragSelect"
        style={{
          ...style,
          position: 'absolute',
          backgroundColor: 'rgba(16, 142, 233, 0.05)',
          border: '1px solid #108ee9',
        }}
      />
    );
    return React.cloneElement(children, {
      onMouseDown: this.handleStart,
      // 禁止默认的选中文字效果
      style: dragging ? { ...children.props.style, userSelect: 'none' } : children.props.style,
      children: [children.props.children, rectElement],
    });
  }
}

export default DragSelect;
