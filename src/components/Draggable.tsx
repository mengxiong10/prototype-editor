import React from 'react';
import { rafThrottle } from '@/utils/rafThrottle';
import { matchesSelectorAndParentsTo } from '@/utils/domFns';

export interface DraggableData {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

export type DraggableHandler = (data: DraggableData) => void;

export interface DraggableProps {
  children: React.ReactElement;
  handle?: string;
  cancel?: string;
  onMouseDown?: (evt: React.MouseEvent) => void;
  onStart?: (evt: React.MouseEvent) => any;
  onMove: DraggableHandler;
  onStop?: DraggableHandler;
}

interface DraggableState {
  dragging: boolean;
  x: number;
  y: number;
}

function offsetXY(data: { clientX: number; clientY: number; scale?: number }) {
  const { clientX, clientY, scale = 1 } = data;
  const x = clientX / scale;
  const y = clientY / scale;

  return { x, y };
}

function getCoreData(data: {
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  scale?: number;
}) {
  const { clientX, clientY, x, y, scale = 1 } = data;
  const newData = offsetXY({ clientX, clientY, scale });

  return {
    deltaX: newData.x - x,
    deltaY: newData.y - y,
    x: newData.x,
    y: newData.y,
  };
}

class Draggable extends React.Component<DraggableProps, DraggableState> {
  constructor(props: DraggableProps) {
    super(props);
    this.state = {
      dragging: false,
      x: 0,
      y: 0,
    };
  }

  orginalUserSelect: string;

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = (evt: React.MouseEvent) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(evt);
    }
    const currentTarget = evt.currentTarget as HTMLElement;
    const target = evt.target as HTMLElement;
    const { handle, cancel } = this.props;
    // 只接受左键
    if (typeof evt.button === 'number' && evt.button !== 0) return;
    if (handle && !matchesSelectorAndParentsTo(target, handle, currentTarget)) return;
    if (cancel && matchesSelectorAndParentsTo(target, cancel, currentTarget)) return;
    const position = offsetXY({ clientX: evt.clientX, clientY: evt.clientY });
    if (this.props.onStart && this.props.onStart(evt) === false) return;
    this.setState({
      dragging: true,
      x: position.x,
      y: position.y,
    });
    this.orginalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = rafThrottle((evt: MouseEvent) => {
    const { x, y, dragging } = this.state;
    if (!dragging) return;
    const coreData = getCoreData({
      clientX: evt.clientX,
      clientY: evt.clientY,
      x,
      y,
    });
    this.setState({
      x: coreData.x,
      y: coreData.y,
    });
    this.props.onMove(coreData);
  });

  handleMouseUp = (evt: MouseEvent) => {
    const { x, y, dragging } = this.state;
    if (!dragging) return;
    const coreData = getCoreData({
      clientX: evt.clientX,
      clientY: evt.clientY,
      x,
      y,
    });
    if (this.props.onStop) {
      this.props.onStop(coreData);
    }
    this.setState({
      dragging: false,
      x: 0,
      y: 0,
    });
    document.body.style.userSelect = this.orginalUserSelect;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      onMouseDown: this.handleMouseDown,
    });
  }
}

export default Draggable;
