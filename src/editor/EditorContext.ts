import React, { useContext } from 'react';
import { EditorAction } from '.';

export const EditorAPIContext = React.createContext<(action: EditorAction) => void>(() => {});

export const EditorAPIProvider = EditorAPIContext.Provider;

export const useEditorDispatch = () => useContext(EditorAPIContext);
