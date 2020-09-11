import React, { useContext } from 'react';
import type { Actions } from './reducer';

export type EditorExecCommand = <K extends keyof Actions>(
  command: K,
  ...params: Parameters<Actions[K]>
) => void;

export const EditorContext = React.createContext<EditorExecCommand>(() => {});

export const ComponentIdContext = React.createContext('');

export const CompositePathContext = React.createContext('');

export const useEditor = () => useContext(EditorContext);

export const useComponentId = () => useContext(ComponentIdContext);

export const useCompositePath = () => useContext(CompositePathContext);
