import React from 'react';
import ReactDOM from 'react-dom';

export interface ContextMenuProps {
  children: React.ReactElement;
  overlay: React.ReactNode;
  handle?: string;
  onOpen?: (evt: React.MouseEvent) => void;
}

interface ContextMenuState {
  left: number;
  top: number;
  visible: boolean;
}

class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  menuEl = React.createRef<HTMLDivElement>();

  constructor(props: ContextMenuProps) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      visible: false,
    };
  }

  hide() {
    this.setState({ visible: false });
  }

  handleContextMenu = (evt: React.MouseEvent) => {
    const { clientX, clientY } = evt;
    if (this.props.onOpen) {
      this.props.onOpen(evt);
    }
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ left: clientX, top: clientY, visible: true });
  };

  handleClickOutside = (evt: MouseEvent) => {
    if (!this.menuEl.current!.contains(evt.target as Element)) {
      this.hide();
    }
  };

  handleMenuClick = (evt: React.MouseEvent) => {
    const { target } = evt;
    const { handle } = this.props;
    if (!handle || (target as Element).matches(handle)) {
      this.hide();
    }
  };

  componentDidUpdate() {
    const el = this.menuEl.current!;
    const rect = el.getBoundingClientRect();
    const { width, height } = rect;
    let { top, left } = this.state;
    const { innerHeight, innerWidth } = window;
    if (top + height > innerHeight) {
      top -= height;
    }
    if (left + width > innerWidth) {
      left -= width;
    }
    if (top < 0) {
      top = height < innerHeight ? (innerHeight - height) / 2 : 0;
    }
    if (left < 0) {
      left = width < innerWidth ? (innerWidth - width) / 2 : 0;
    }
    if (top !== this.state.top || left !== this.state.left) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ top, left });
    }
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { children, overlay } = this.props;
    const { left, top, visible } = this.state;

    const menu = ReactDOM.createPortal(
      <div
        key="contextmenu"
        ref={this.menuEl}
        className="contextmenu"
        style={{
          display: visible ? 'block' : 'none',
          position: 'fixed',
          zIndex: 2000,
          left,
          top,
        }}
        onClick={this.handleMenuClick}
      >
        {overlay}
      </div>,
      document.body
    );

    return [
      React.cloneElement(children, {
        onContextMenu: this.handleContextMenu,
        key: 'contextmenutrigger',
      }),
      menu,
    ];
  }
}

export default ContextMenu;
