import Editor from '@monaco-editor/react';
import './editor.css';
import Person from './person';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { socket } from './socket';

let lastSend = 0;
const CodeEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const currUser = state.currentUser;

  const defVal = (state.defContent == "")? "// Write your code here" : state.defContent;

  let [ppl, setPpl] = useState(state.users);
  let [editorVal, setEditorVal] = useState(defVal);

  let currRoom = window.location.pathname.slice(8);

  let [typing, setTyping] = useState(0);
  
  // socket
  useEffect(() => {
    // When SOMEONE ELSE joins
    socket.on("newJoin", (user) => {
      console.log(user);
      setPpl(prev => [
        ...prev,
        { unique_id: user.unique_id, userName: user.userName, userColor: user.userColor }
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

  socket.on("user_typing", (user_id) => {
    console.log(user_id);
    setTyping(user_id);
    setTimeout(() => {
      setTyping(0);
    }, 1500);
  });

  const handleCopyId = () => {
    toast.success("Room ID copied!");
    navigator.clipboard.writeText(currRoom);
  }

  const handleLeave = () => {
    console.log(currUser.unique_id);
    socket.emit("leave", {u_id: currUser.unique_id, room_id: currRoom});
    setTimeout(() => {
      navigate("/");
      toast.info("Room left");
    }, 1000);
  }

  const handleEditorChange = (value) => {
    // console.log(currUser.unique_id);
    setEditorVal(value); // Update editor locally
    
    const now = Date.now();
    
    // Allow emit only once every 120ms (adjustable)
    if (now - lastSend > 150) {
      socket.emit("typing", {user_id: currUser.unique_id, room_id: currRoom});
      socket.emit("change", { room_id: currRoom, val: value });
      lastSend = now;
    }
  };
  
  return (
    <>
    <div className="editor-page">
      <div className="side-bar">
        <div className="upper-side-bar">
        <h1 className='side-bar-head'>In the room</h1>
        <div className="ppl scroll-hidden overflow-y-scroll">
          {
            ppl.map((user) => {
              return <Person key={user.unique_id} username={user.userName} color={user.userColor} isTyping={
                typing === user.unique_id
              }/>
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
          minimap: { enabled: false }
        }}
      />
    </div>
    </div>
    </>
  );
};

export default CodeEditor;
