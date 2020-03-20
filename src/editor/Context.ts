import React, { useContext, Dispatch } from 'react';

export type EditorDispatch = Dispatch<any>;

export const EditorContext = React.createContext<EditorDispatch>(() => {});

export const EditorProvider = EditorContext.Provider;

export const useEditor = () => useContext(EditorContext);
