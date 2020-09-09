import React from 'react';
import { rafThrottle } from 'src/utils/rafThrottle';

export interface ShapeData {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ShapeRectHandler = (data: ShapeData) => void;

export interface DrawShapeProps {
  children: React.ReactElement;
  scale?: number;
  shapeStyle?: React.CSSProperties;
  onStart?: (evt: React.MouseEvent) => boolean | void;
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

const defaultShapeStyle = {
  backgroundColor: 'rgba(16, 142, 233, 0.05)',
  border: '1px solid #108ee9',
};

export function offsetFromParent({
  x,
  y,
  offsetParent,
  scale = 1,
}: {
  x: number;
  y: number;
  offsetParent: Element;
  scale?: number;
}) {
  const isBody = offsetParent === document.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();
  x = (x + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  y = (y + offsetParent.scrollTop - offsetParentRect.top) / scale;

  return { x, y };
}

class DrawShape extends React.Component<DrawShapeProps, DrawShapeState> {
  el = React.createRef<HTMLDivElement>();

  constructor(props: DrawShapeProps) {
    super(props);
    this.state = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      dragging: false,
    };
  }

  getStyle = () => {
    const { x1, x2, y1, y2 } = this.state;
    const { scale = 1 } = this.props;
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x1 - x2) / scale;
    const height = Math.abs(y1 - y2) / scale;
    const offsetParent = (this.el.current && this.el.current.offsetParent) || document.body;

    const { x: left, y: top } = offsetFromParent({ x, y, offsetParent, scale });

    return { left, top, width, height };
  };

  handleMouseDown = (evt: React.MouseEvent<HTMLElement>) => {
    if (this.props.onStart && this.props.onStart(evt) === false) {
      return;
    }
    // 只接受左键
    if (typeof evt.button === 'number' && evt.button !== 0) return;

    document.body.style.userSelect = 'none';
    const x = evt.clientX;
    const y = evt.clientY;
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
    const { dragging } = this.state;
    const el = this.el.current;
    if (!el || !dragging) return;
    const x = evt.clientX;
    const y = evt.clientY;
    this.setState(
      {
        x2: x,
        y2: y,
      },
      () => {
        if (this.props.onMove) {
          this.props.onMove(this.getStyle());
        }
      }
    );
  });

  handleDragEnd = () => {
    const { dragging } = this.state;
    const el = this.el.current;
    if (!el || !dragging) return;
    if (this.props.onStop) {
      this.props.onStop(this.getStyle());
    }
    this.setState({ dragging: false });
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleDragEnd);
  };

  componentWillUnmount() {
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleDragEnd);
  }

  render() {
    const { children, shapeStyle } = this.props;
    const { dragging } = this.state;

    const shapeElement = dragging && (
      <div
        ref={this.el}
        key="shape-element"
        style={{
          ...this.getStyle(),
          ...(shapeStyle || defaultShapeStyle),
          position: 'absolute',
        }}
      />
    );

    return React.cloneElement(children, {
      onMouseDown: this.handleMouseDown,
      children: [children.props.children, shapeElement],
    });
  }
}

export default DrawShape;
