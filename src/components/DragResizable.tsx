import React from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import classnames from 'classnames';
import './DragResizable.scss';
import { pick } from 'lodash';

type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export interface ResizableProps {
  width: number;
  height: number;
  left: number;
  top: number;
  active: boolean;
  minHeight?: number;
  minWidth?: number;
  resizeHandles?: ResizeHandle[];
  bound?: boolean; // 默认 true 限制在父元素里面, 暂时只支持父元素
  onStop?: (v: ResizableState) => void;
  children: React.ReactElement;
}

export interface ResizableState {
  width: number;
  height: number;
  left: number;
  top: number;
}

const defaultResizeHandles = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

export default class Resizable extends React.Component<ResizableProps, ResizableState> {
  slackX = 0;

  slackY = 0;

  elRef = React.createRef<HTMLElement>();

  constructor(props: ResizableProps) {
    super(props);
    this.state = {
      left: this.props.left,
      top: this.props.top,
      width: this.props.width,
      height: this.props.height,
    };
  }

  handleDrag: DraggableEventHandler = (e, { deltaX, deltaY }) => {
    this.setState(({ left: prevLeft, top: prevTop, width, height }) => {
      let left = prevLeft + deltaX;
      let top = prevTop + deltaY;
      if (this.props.bound !== false) {
        const parent = this.elRef.current!.offsetParent! as HTMLElement;
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        const [oldLeft, oldTop] = [left, top];
        left += this.slackX;
        top += this.slackY;
        left = Math.max(left, 0);
        left = Math.min(left, parentWidth - width);
        top = Math.max(top, 0);
        top = Math.min(top, parentHeight - height);
        this.slackX += oldLeft - left;
        this.slackY += oldTop - top;
      }
      return { left, top };
    });
  };

  handleResize: DraggableEventHandler = (e, { node, deltaX, deltaY }) => {
    const { width: prevWidth, height: prevHeight, left: prevLeft, top: prevTop } = this.state;
    const d = node.dataset.handle!;
    const canResizeWidth = d !== 'n' && d !== 's';
    const canResizeHeight = d !== 'e' && d !== 'w';
    const isLeft = d[d.length - 1] === 'w';
    const isTop = d[0] === 'n';
    deltaX = isLeft ? -deltaX : deltaX;
    deltaY = isTop ? -deltaY : deltaY;
    let width = prevWidth + (canResizeWidth ? deltaX : 0);
    let height = prevHeight + (canResizeHeight ? deltaY : 0);
    if (this.props.bound !== false) {
      const parent = this.elRef.current!.offsetParent! as HTMLElement;
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const maxWidth = isLeft ? prevLeft + prevWidth : parentWidth - prevLeft;
      const maxHeight = isTop ? prevTop + prevHeight : parentHeight - prevTop;
      const { minWidth = 40, minHeight = 20 } = this.props;
      const [oldWidth, oldHeight] = [width, height];
      width += this.slackX;
      width = Math.max(width, minWidth);
      width = Math.min(width, maxWidth);
      this.slackX += oldWidth - width;
      height += this.slackY;
      height = Math.max(height, minHeight);
      height = Math.min(height, maxHeight);
      this.slackY += oldHeight - height;
    }
    const left = isLeft ? prevLeft + (prevWidth - width) : prevLeft;
    const top = isTop ? prevTop + (prevHeight - height) : prevTop;
    this.setState({ width, height, left, top });
  };

  handleStop = () => {
    this.slackX = 0;
    this.slackY = 0;
    if (this.props.onStop) {
      this.props.onStop(this.state);
    }
  };

  componentDidUpdate(prevProps: ResizableProps) {
    const keys: ['width', 'height', 'left', 'top'] = ['width', 'height', 'left', 'top'];
    if (keys.some(k => prevProps[k] !== this.props[k])) {
      const newState = pick(this.props, keys);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(newState);
    }
  }

  render() {
    const { children, active } = this.props;

    const resizeHandles = active ? this.props.resizeHandles || defaultResizeHandles : [];
    const { width, height, left, top } = this.state;

    const className = classnames(children.props.className, {
      'drag-resizable': active,
    });

    const style = { width, height, left, top, position: 'absolute' };

    return (
      <DraggableCore
        disabled={!active}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        cancel=".js-drag-cancel"
      >
        {React.cloneElement(children, {
          ref: this.elRef,
          className,
          style: { ...children.props.style, ...style },
          children: [
            children.props.children,
            resizeHandles.map(d => (
              <DraggableCore
                key={d}
                onDrag={this.handleResize}
                onStop={this.handleStop}
                offsetParent={document.body}
              >
                <span
                  data-handle={d}
                  className={`resizable-handle resizable-handle-${d} js-drag-cancel`}
                ></span>
              </DraggableCore>
            )),
          ],
        })}
      </DraggableCore>
    );
  }
}
