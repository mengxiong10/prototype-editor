import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import DisableEditorFeature from 'src/editor/DisableEditorFeature';
import { InlineStyleControls, BlockStyleControls } from './StyleControls';
import 'draft-js/dist/Draft.css';
import styles from './RichEditor.module.scss';

export interface RichEditorProps {
  value: EditorState;
  backgroundColor: string;
}

function RichEditor({ value, backgroundColor }: RichEditorProps) {
  const [editorState, changeEditorState] = useState(value);

  const editor = useRef<Editor>(null);

  const focus = useCallback(() => {
    editor.current!.focus();
  }, []);

  const handleTab = (e: any) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    if (blockType === 'unordered-list-item' || blockType === 'ordered-list-item') {
      changeEditorState(RichUtils.onTab(e, editorState, 3));
    } else {
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        '    '
      );
      changeEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
    }
  };

  const toggleBlockType = (blockType: string) => {
    changeEditorState(prev => {
      return RichUtils.toggleBlockType(prev, blockType);
    });
  };

  const toggleInlineStyle = (blockType: string) => {
    changeEditorState(prev => {
      return RichUtils.toggleInlineStyle(prev, blockType);
    });
  };

  // const print = () => {
  //   const js = editorState.toJS();
  //   console.log(js, convertToRaw(editorState.getCurrentContent()));
  // };

  useEffect(() => {
    focus();
  }, [focus]);

  return (
    <div style={{ backgroundColor, display: 'flex' }} className={styles['rich-editor']}>
      <DisableEditorFeature disabled="drag">
        <div className="u-scroll" style={{ flex: 1, overflow: 'auto', padding: 5 }} onClick={focus}>
          <Editor
            editorState={editorState}
            onChange={changeEditorState}
            onTab={handleTab}
            ref={editor}
          />
        </div>
      </DisableEditorFeature>
      <footer className={styles['rich-editor-footer']}>
        <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
        <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
      </footer>
    </div>
  );
}

export default RichEditor;
