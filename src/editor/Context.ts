import React, { useContext, Dispatch } from 'react';

export const EditorAPIContext = React.createContext<Dispatch<any>>(() => {});

export const EditorAPIProvider = EditorAPIContext.Provider;

export const useEditor = () => useContext(EditorAPIContext);
