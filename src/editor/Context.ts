import React, { useContext, Dispatch } from 'react';

export type EditorDispatch = Dispatch<any>;

export const EditorContext = React.createContext<EditorDispatch>(() => {});

export const ComponentIdContext = React.createContext('');

export const useEditor = () => useContext(EditorContext);

export const useComponentId = () => useContext(ComponentIdContext);
