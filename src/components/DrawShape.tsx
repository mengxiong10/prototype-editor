import React from 'react';
import { rafThrottle } from 'src/utils/rafThrottle';

export interface ShapeData {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ShapeRectHandler = (data: ShapeData) => void;

export interface DrawShapeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement;
  shapeStyle?: React.CSSProperties;
  onMove?: ShapeRectHandler;
  onStop?: ShapeRectHandler;
}

export interface DrawShapeState {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  dragging: boolean;
}

const getStyle = ({ x1, x2, y1, y2 }: Omit<DrawShapeState, 'dragging'>) => {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  return { left, top, width, height };
};

const defaultShapeStyle = {
  backgroundColor: 'rgba(16, 142, 233, 0.05)',
  border: '1px solid #108ee9',
};

export function offsetFromParent(
  evt: { clientX: number; clientY: number },
  offsetParent: Element,
  scale = 1
) {
  const isBody = offsetParent === document.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();
  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

  return { x, y };
}

class DrawShape extends React.Component<DrawShapeProps, DrawShapeState> {
  parentElement: Element | null;

  constructor(props: DrawShapeProps) {
    super(props);
    this.state = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      dragging: false,
    };
    this.parentElement = null;
  }

  handleMouseDown = (evt: React.MouseEvent<HTMLElement>) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(evt);
    }
    const currentTarget = evt.currentTarget as HTMLElement;
    const target = evt.target as HTMLElement;
    if (target !== currentTarget) return;
    // 只接受左键
    if (typeof evt.button === 'number' && evt.button !== 0) return;
    this.parentElement = currentTarget.offsetParent!;
    const { x, y } = offsetFromParent(evt, this.parentElement);
    document.body.style.userSelect = 'none';
    this.setState({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      dragging: true,
    });
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.handleDragEnd);
  };

  handleDrag = rafThrottle((evt: MouseEvent) => {
    if (!this.parentElement) {
      return;
    }
    const { x, y } = offsetFromParent(evt, this.parentElement);
    this.setState(
      {
        x2: x,
        y2: y,
      },
      () => {
        if (this.props.onMove) {
          this.props.onMove(getStyle(this.state));
        }
      }
    );
  });

  handleDragEnd = () => {
    if (!this.parentElement) {
      return;
    }
    this.setState({ dragging: false });
    if (this.props.onStop) {
      this.props.onStop(getStyle(this.state));
    }
    this.parentElement = null;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleDragEnd);
  };

  componentWillUnmount() {
    this.parentElement = null;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleDragEnd);
  }

  render() {
    // 需要把上层的oncontextmenu 等传进来
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, shapeStyle, onMove, onStop, ...restProps } = this.props;
    const { dragging } = this.state;
    const shapeElement = dragging && (
      <div
        key="dragSelect"
        style={{
          ...getStyle(this.state),
          ...(shapeStyle || defaultShapeStyle),
          position: 'absolute',
        }}
      />
    );
    return React.cloneElement(children, {
      ...restProps,
      onMouseDown: this.handleMouseDown,
      children: [children.props.children, shapeElement],
    });
  }
}

export default DrawShape;
