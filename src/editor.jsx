import Editor from '@monaco-editor/react';
import './editor.css';
import Person from './person';
import { toast } from "sonner"

const CodeEditor = () => {
  const handleCopyId = () => {
    toast.success("Room ID copied!");
  }

  const ppl = [
    {userId: 1, userName: "Shivam Paul"},
    {userId: 2, userName: "Virat Kohli"},
    {userId: 3, userName: "Rohit Sharma"},
    {userId: 4, userName: "KL Rahul"},
    {userId: 5, userName: "Sherlock Homes"},
    {userId: 6, userName: "Tony Stark"}
  ]
  
  return (
    <>
    <div className="editor-page">
      <div className="side-bar">
        <div className="upper-side-bar">
        <h1 className='side-bar-head'>In the room</h1>
        <div className="ppl">
          {
            ppl.map((user, key) => {
              let c = Math.floor(Math.random()*5);
              return <Person username={user.userName} color={c}/>
            })
          }
          </div>
          </div>
          <div className="editor-buttons">
            <button className='copy-id-but' onClick={handleCopyId}>Copy ID</button><br />
            <button className='leave-but'>Leave room</button>
          </div>
      </div>
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
