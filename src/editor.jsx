import Editor from '@monaco-editor/react';
import './editor.css';

const CodeEditor = () => {
  return (
    <>
    <div className="editor-page">
    <div className="editor-container">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
        options={{
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          minimap: { enabled: false }, // Optional: cleaner look
          // padding: { top: 20, bottom: 20 } // Internal padding for the editor content
        }}
      />
    </div>
    </div>
    </>
  );
};

export default CodeEditor;
