import React from 'react';
import { DraggableCore, DraggableEventHandler, DraggableData } from 'react-draggable';
import classnames from 'classnames';
import shallowEqual from 'shallowequal';
import './DragResizable.scss';

type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export interface DragResizableData {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface DragResizableProps {
  data: DragResizableData;
  resizable: boolean;
  minHeight?: number;
  minWidth?: number;
  resizeHandles?: ResizeHandle[];
  onStop?: (data: DragResizableData) => void;
  cancel?: string;
  children: React.ReactElement;
}

const defaultResizeHandles = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

export default class DragResizable extends React.Component<DragResizableProps, DragResizableData> {
  slackX = 0;

  slackY = 0;

  isResizable = false;

  resizeStatus = {
    canResizeWidth: false,
    canResizeHeight: false,
    isLeft: false,
    isTop: false,
  };

  constructor(props: DragResizableProps) {
    super(props);
    this.state = this.props.data;
  }

  move(prevState: DragResizableData, data: DraggableData) {
    return {
      left: prevState.left + data.deltaX,
      top: prevState.top + data.deltaY,
    };
  }

  resize(prevState: DragResizableData, data: DraggableData) {
    const { isLeft, isTop, canResizeHeight, canResizeWidth } = this.resizeStatus;
    const { minWidth = 40, minHeight = 20 } = this.props;
    const deltaX = isLeft ? -data.deltaX : data.deltaX;
    const deltaY = isTop ? -data.deltaY : data.deltaY;
    const width = prevState.width + (canResizeWidth ? deltaX : 0);
    let nextWidth = width + this.slackX;
    nextWidth = Math.max(nextWidth, minWidth);
    this.slackX += width - nextWidth;
    const height = prevState.height + (canResizeHeight ? deltaY : 0);
    let nextHeight = height + this.slackY;
    nextHeight = Math.max(nextHeight, minHeight);
    this.slackY += height - nextHeight;

    const nextLeft = isLeft ? prevState.left + (prevState.width - nextWidth) : prevState.left;
    const nextTop = isTop ? prevState.top + (prevState.height - nextHeight) : prevState.top;

    return {
      width: nextWidth,
      height: nextHeight,
      left: nextLeft,
      top: nextTop,
    };
  }

  handleDrag: DraggableEventHandler = (e, data) => {
    this.setState(prevState => {
      return this.isResizable ? this.resize(prevState, data) : this.move(prevState, data);
    });
  };

  handleStop = () => {
    this.slackX = 0;
    this.slackY = 0;
    this.isResizable = false;
    if (this.props.onStop && !shallowEqual(this.state, this.props.data)) {
      this.props.onStop(this.state);
    }
  };

  handleResizeHandleClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const node = evt.currentTarget;
    const d = node.dataset.handle!;
    const canResizeWidth = d !== 'n' && d !== 's';
    const canResizeHeight = d !== 'e' && d !== 'w';
    const isLeft = d[d.length - 1] === 'w';
    const isTop = d[0] === 'n';
    this.isResizable = true;
    this.resizeStatus = { canResizeWidth, canResizeHeight, isLeft, isTop };
  };

  componentDidUpdate(prevProps: DragResizableProps) {
    if (!shallowEqual(prevProps.data, this.props.data)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(this.props.data);
    }
  }

  render() {
    const { children, resizable, cancel } = this.props;

    const resizeHandles = resizable ? this.props.resizeHandles || defaultResizeHandles : [];
    const { width, height, left, top } = this.state;

    const className = classnames(children.props.className, {
      resizable,
    });

    const style = { width, height, left, top, position: 'absolute' };

    return (
      <DraggableCore
        onMouseDown={children.props.onMouseDown}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        cancel={cancel}
      >
        {React.cloneElement(children, {
          className,
          style: { ...children.props.style, ...style },
          children: [
            children.props.children,
            resizeHandles.map(d => (
              <span
                key={d}
                data-handle={d}
                onMouseDown={this.handleResizeHandleClick}
                className={`resizable-handle resizable-handle-${d}`}
              ></span>
            )),
          ],
        })}
      </DraggableCore>
    );
  }
}
