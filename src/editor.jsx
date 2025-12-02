import Editor from '@monaco-editor/react';
import './editor.css';
import Person from './person';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { socket } from './socket';

const CodeEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const currUser = state.currentUser;

  let [ppl, setPpl] = useState(state.users);
  let [editorVal, setEditorVal] = useState("// Write your code here");

  let currRoom = window.location.pathname.slice(8);
  
  // socket
  useEffect(() => {
    // When SOMEONE ELSE joins
    socket.on("newJoin", (user) => {
      console.log(user);
      setPpl(prev => [
        ...prev,
        { userId: prev.length + 1, userName: user.userName }
      ]);
    });

    socket.on("disconnect_user", (users) => {
      console.log(users);
      setPpl(users);
    });

    
    return () => {
      socket.off("newJoin");
      socket.off("disconnect_user");
    };
  }, []);
  
  socket.on("newCode", (code) => {
    console.log(code);
    setEditorVal(code);
  });

  const handleCopyId = () => {
    toast.success("Room ID copied!");
    navigator.clipboard.writeText(currRoom);
  }

  const handleLeave = () => {
    console.log(currUser.unique_id);
    socket.emit("leave", currUser.unique_id);
    setTimeout(() => {
      navigate("/");
      toast.info("Room left");
    }, 1000);
  }

  const handleEditorChange = (e) => {
    socket.emit("change", {room_id:currRoom, val:e});
  }
  
  return (
    <>
    <div className="editor-page">
      <div className="side-bar">
        <div className="upper-side-bar">
        <h1 className='side-bar-head'>In the room</h1>
        <div className="ppl">
          {
            ppl.map((user, index) => {
              let c = Math.floor(Math.random()*5);
              return <Person key={index} username={user.userName} color={c}/>
            })
          }
          </div>
          </div>
          <div className="editor-buttons">
            <button className='copy-id-but' onClick={handleCopyId}>Copy Room ID</button><br />
            <button className='leave-but' onClick={handleLeave}>Leave Room</button>
          </div>
      </div>
    <div className="editor-container">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        value={editorVal}
        onChange={handleEditorChange}
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
