declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.gif' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.js' {
  const value: any;
  export = value;
}

declare namespace JSX {
  interface IntrinsicAttributes {
    styleName?: string;
  }
}

interface Window {
  VERSION: string;
}
