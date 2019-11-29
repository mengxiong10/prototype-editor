import React, { useContext } from 'react';
import Editor, { EditorState } from './Editor';

export const EditorAPIContext = React.createContext<
  Pick<
    Editor,
    | 'updateComponent'
    | 'addComponent'
    | 'selectComponent'
    | 'deleteComponent'
    | 'getSelectedComponent'
    | 'executeCommand'
  >
>({} as any);

export const EditorDataContext = React.createContext<EditorState>({} as any);

export const EditorAPIProvider = EditorAPIContext.Provider;

export const EditorDataProvider = EditorDataContext.Provider;

export const useEditorData = () => useContext(EditorDataContext);

export const useEditorAPI = () => useContext(EditorAPIContext);
